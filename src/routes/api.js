const express = require('express');
const pool = require('../db');
const { apiKeyAuth } = require('../middleware/auth');
const { identifyOperator, generateIMEI, generateIMSI, generateICCID } = require('./msisdn');
const router = express.Router();

router.get('/api/v1/msisdn/:msisdn', apiKeyAuth, async (req, res) => {
  const start = Date.now();
  const { msisdn } = req.params;

  try {
    const { normalized, operator, prefix } = identifyOperator(msisdn);
    if (!operator) {
      return res.status(400).json({ success: false, error: 'Operator tidak dikenali', prefix });
    }

    const towers = await pool.query(
      `SELECT bt.*, p.name as province_name, c.name as city_name, o.brand as operator_brand, o.name as operator_name
       FROM bts_towers bt
       JOIN provinces p ON bt.province_code = p.code
       JOIN cities c ON bt.city_code = c.code
       JOIN operators o ON bt.operator_id = o.id
       WHERE bt.mnc = $1 AND bt.is_active = true
       ORDER BY RANDOM() LIMIT 5`,
      [operator.mnc]
    );

    if (towers.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tower data not found' });
    }

    const mainTower = towers.rows[0];
    const imei = generateIMEI(normalized);
    const imsi = generateIMSI('510', operator.mnc, normalized);
    const iccid = generateICCID(operator.mnc, normalized);

    const result = {
      success: true,
      data: {
        msisdn: normalized,
        msisdn_international: '+62' + normalized.substring(1),
        operator: { name: mainTower.operator_name, brand: mainTower.operator_brand, mcc: '510', mnc: operator.mnc },
        device: { imei, imsi, iccid },
        serving_cell: {
          cell_id: mainTower.cell_id, lac: mainTower.lac, mcc: mainTower.mcc, mnc: mainTower.mnc,
          tower_type: mainTower.tower_type, band: mainTower.band,
          latitude: mainTower.latitude, longitude: mainTower.longitude,
          azimuth: mainTower.azimuth, height_m: mainTower.height_m, power_dbm: mainTower.power_dbm
        },
        location: { province: mainTower.province_name, city: mainTower.city_name, address: mainTower.address },
        neighboring_cells: towers.rows.slice(1).map(t => ({
          cell_id: t.cell_id, lac: t.lac, tower_type: t.tower_type,
          latitude: t.latitude, longitude: t.longitude, city: t.city_name
        }))
      },
      meta: { response_time_ms: Date.now() - start, timestamp: new Date().toISOString() }
    };

    await pool.query(
      'INSERT INTO msisdn_lookups (api_key_id, msisdn, operator_name, result) VALUES ($1, $2, $3, $4)',
      [req.apiKeyData.id, normalized, operator.brand, JSON.stringify(result)]
    );

    await pool.query(
      'INSERT INTO usage_logs (api_key_id, user_id, endpoint, method, status_code, response_time_ms, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [req.apiKeyData.id, req.apiKeyData.uid, `/api/v1/msisdn/${msisdn}`, 'GET', 200, Date.now() - start, req.ip]
    );

    res.json(result);
  } catch (err) {
    console.error('API MSISDN error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/towers', apiKeyAuth, async (req, res) => {
  try {
    const { province, city, operator, type, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['bt.is_active = true'];
    let params = [];
    let idx = 1;

    if (province) { where.push(`bt.province_code = $${idx++}`); params.push(province); }
    if (city) { where.push(`bt.city_code = $${idx++}`); params.push(city); }
    if (operator) { where.push(`bt.mnc = $${idx++}`); params.push(operator); }
    if (type) { where.push(`bt.tower_type = $${idx++}`); params.push(type); }

    const countResult = await pool.query(`SELECT COUNT(*) FROM bts_towers bt WHERE ${where.join(' AND ')}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit));
    params.push(offset);
    const towers = await pool.query(
      `SELECT bt.*, p.name as province_name, c.name as city_name, o.brand as operator_brand
       FROM bts_towers bt
       JOIN provinces p ON bt.province_code = p.code
       JOIN cities c ON bt.city_code = c.code
       JOIN operators o ON bt.operator_id = o.id
       WHERE ${where.join(' AND ')}
       ORDER BY bt.id LIMIT $${idx++} OFFSET $${idx}`,
      params
    );

    res.json({
      success: true,
      data: towers.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error('API towers error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/towers/:id', apiKeyAuth, async (req, res) => {
  try {
    const tower = await pool.query(
      `SELECT bt.*, p.name as province_name, c.name as city_name, o.brand as operator_brand, o.name as operator_name
       FROM bts_towers bt
       JOIN provinces p ON bt.province_code = p.code
       JOIN cities c ON bt.city_code = c.code
       JOIN operators o ON bt.operator_id = o.id
       WHERE bt.id = $1`,
      [req.params.id]
    );
    if (tower.rows.length === 0) return res.status(404).json({ success: false, error: 'Tower not found' });
    res.json({ success: true, data: tower.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/provinces', apiKeyAuth, async (req, res) => {
  try {
    const provinces = await pool.query('SELECT * FROM provinces ORDER BY name');
    res.json({ success: true, data: provinces.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/cities', apiKeyAuth, async (req, res) => {
  try {
    const { province } = req.query;
    let q = 'SELECT c.*, p.name as province_name FROM cities c JOIN provinces p ON c.province_code = p.code';
    let params = [];
    if (province) { q += ' WHERE c.province_code = $1'; params.push(province); }
    q += ' ORDER BY c.name';
    const cities = await pool.query(q, params);
    res.json({ success: true, data: cities.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/operators', apiKeyAuth, async (req, res) => {
  try {
    const ops = await pool.query('SELECT * FROM operators ORDER BY brand');
    res.json({ success: true, data: ops.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/api/v1/stats', apiKeyAuth, async (req, res) => {
  try {
    const towers = await pool.query('SELECT COUNT(*) FROM bts_towers WHERE is_active = true');
    const provinces = await pool.query('SELECT COUNT(*) FROM provinces');
    const cities = await pool.query('SELECT COUNT(*) FROM cities');
    const operators = await pool.query('SELECT COUNT(*) FROM operators');
    res.json({
      success: true,
      data: {
        total_towers: parseInt(towers.rows[0].count),
        total_provinces: parseInt(provinces.rows[0].count),
        total_cities: parseInt(cities.rows[0].count),
        total_operators: parseInt(operators.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
