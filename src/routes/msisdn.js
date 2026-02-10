const express = require('express');
const pool = require('../db');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

function identifyOperator(msisdn) {
  const clean = msisdn.replace(/[^0-9]/g, '');
  let normalized = clean;
  if (clean.startsWith('62')) normalized = '0' + clean.substring(2);
  else if (clean.startsWith('+62')) normalized = '0' + clean.substring(3);
  else if (!clean.startsWith('0')) normalized = '0' + clean;

  const prefixMap = {
    '0811': { mnc: '10', brand: 'Telkomsel' },
    '0812': { mnc: '10', brand: 'Telkomsel' },
    '0813': { mnc: '10', brand: 'Telkomsel' },
    '0821': { mnc: '10', brand: 'Telkomsel' },
    '0822': { mnc: '10', brand: 'Telkomsel' },
    '0823': { mnc: '10', brand: 'Telkomsel' },
    '0851': { mnc: '10', brand: 'Telkomsel' },
    '0852': { mnc: '10', brand: 'Telkomsel' },
    '0853': { mnc: '10', brand: 'Telkomsel' },
    '0814': { mnc: '01', brand: 'Indosat' },
    '0815': { mnc: '01', brand: 'Indosat' },
    '0816': { mnc: '01', brand: 'Indosat' },
    '0855': { mnc: '01', brand: 'Indosat' },
    '0856': { mnc: '01', brand: 'Indosat' },
    '0857': { mnc: '01', brand: 'Indosat' },
    '0858': { mnc: '01', brand: 'Indosat' },
    '0817': { mnc: '11', brand: 'XL Axiata' },
    '0818': { mnc: '11', brand: 'XL Axiata' },
    '0819': { mnc: '11', brand: 'XL Axiata' },
    '0859': { mnc: '11', brand: 'XL Axiata' },
    '0877': { mnc: '11', brand: 'XL Axiata' },
    '0878': { mnc: '11', brand: 'XL Axiata' },
    '0895': { mnc: '89', brand: 'Tri (3)' },
    '0896': { mnc: '89', brand: 'Tri (3)' },
    '0897': { mnc: '89', brand: 'Tri (3)' },
    '0898': { mnc: '89', brand: 'Tri (3)' },
    '0899': { mnc: '89', brand: 'Tri (3)' },
    '0881': { mnc: '09', brand: 'Smartfren' },
    '0882': { mnc: '09', brand: 'Smartfren' },
    '0883': { mnc: '09', brand: 'Smartfren' },
    '0884': { mnc: '09', brand: 'Smartfren' },
    '0885': { mnc: '09', brand: 'Smartfren' },
    '0886': { mnc: '09', brand: 'Smartfren' },
    '0887': { mnc: '09', brand: 'Smartfren' },
    '0888': { mnc: '09', brand: 'Smartfren' },
    '0889': { mnc: '09', brand: 'Smartfren' },
    '0838': { mnc: '28', brand: 'By.U/Telkom' },
    '0831': { mnc: '28', brand: 'By.U/Telkom' },
    '0832': { mnc: '28', brand: 'By.U/Telkom' },
    '0833': { mnc: '28', brand: 'By.U/Telkom' },
    '0868': { mnc: '27', brand: 'Net1' }
  };

  const prefix4 = normalized.substring(0, 4);
  return { normalized, operator: prefixMap[prefix4] || null, prefix: prefix4 };
}

function generateIMEI(msisdn) {
  const seed = parseInt(msisdn.replace(/\D/g, '').slice(-10)) || Date.now();
  const rng = (s) => ((s * 1103515245 + 12345) & 0x7fffffff);
  let s = seed;
  let imei = '35';
  for (let i = 0; i < 12; i++) {
    s = rng(s);
    imei += (s % 10).toString();
  }
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let d = parseInt(imei[i]);
    if (i % 2 === 1) d *= 2;
    if (d > 9) d -= 9;
    sum += d;
  }
  imei += ((10 - (sum % 10)) % 10).toString();
  return imei;
}

function generateICCID(mnc, msisdn) {
  const seed = parseInt(msisdn.replace(/\D/g, '').slice(-8)) || 12345;
  let iccid = '8962' + (mnc || '10').padStart(2, '0');
  const rng = (s) => ((s * 1664525 + 1013904223) & 0x7fffffff);
  let s = seed;
  while (iccid.length < 19) {
    s = rng(s);
    iccid += (s % 10).toString();
  }
  let sum = 0;
  for (let i = 0; i < 19; i++) {
    let d = parseInt(iccid[i]);
    if (i % 2 === 1) d *= 2;
    if (d > 9) d -= 9;
    sum += d;
  }
  iccid += ((10 - (sum % 10)) % 10).toString();
  return iccid;
}

function generateIMSI(mcc, mnc, msisdn) {
  const seed = parseInt(msisdn.replace(/\D/g, '').slice(-9)) || 99999;
  let imsi = (mcc || '510') + (mnc || '10').padStart(2, '0');
  const rng = (s) => ((s * 214013 + 2531011) & 0x7fffffff);
  let s = seed;
  while (imsi.length < 15) {
    s = rng(s);
    imsi += (s % 10).toString();
  }
  return imsi;
}

router.get('/msisdn-lookup', requireLogin, async (req, res) => {
  res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result: null, error: null, msisdn: '' });
});

router.post('/msisdn-lookup', requireLogin, async (req, res) => {
  const { msisdn } = req.body;
  if (!msisdn || msisdn.length < 10) {
    return res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result: null, error: 'Masukkan nomor MSISDN yang valid (minimal 10 digit)', msisdn });
  }

  try {
    const { normalized, operator, prefix } = identifyOperator(msisdn);
    if (!operator) {
      return res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result: null, error: 'Operator tidak dikenali untuk prefix ' + prefix, msisdn });
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

    const mainTower = towers.rows[0];
    if (!mainTower) {
      return res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result: null, error: 'Tidak ada data tower ditemukan untuk operator ini', msisdn });
    }

    const imei = generateIMEI(normalized);
    const imsi = generateIMSI('510', operator.mnc, normalized);
    const iccid = generateICCID(operator.mnc, normalized);

    const result = {
      msisdn: normalized,
      msisdn_international: '+62' + normalized.substring(1),
      operator: {
        name: mainTower.operator_name,
        brand: mainTower.operator_brand,
        mcc: '510',
        mnc: operator.mnc
      },
      device: { imei, imsi, iccid },
      serving_cell: {
        cell_id: mainTower.cell_id,
        lac: mainTower.lac,
        mcc: mainTower.mcc,
        mnc: mainTower.mnc,
        tower_type: mainTower.tower_type,
        band: mainTower.band,
        latitude: mainTower.latitude,
        longitude: mainTower.longitude,
        azimuth: mainTower.azimuth,
        height_m: mainTower.height_m,
        power_dbm: mainTower.power_dbm
      },
      location: {
        province: mainTower.province_name,
        city: mainTower.city_name,
        address: mainTower.address
      },
      neighboring_cells: towers.rows.slice(1).map(t => ({
        cell_id: t.cell_id,
        lac: t.lac,
        tower_type: t.tower_type,
        latitude: t.latitude,
        longitude: t.longitude,
        city: t.city_name
      })),
      timestamp: new Date().toISOString()
    };

    const apiKeyRow = await pool.query('SELECT id FROM api_keys WHERE user_id = $1 LIMIT 1', [req.session.userId]);
    if (apiKeyRow.rows.length > 0) {
      await pool.query(
        'INSERT INTO msisdn_lookups (api_key_id, msisdn, operator_name, result) VALUES ($1, $2, $3, $4)',
        [apiKeyRow.rows[0].id, normalized, operator.brand, JSON.stringify(result)]
      );
    }

    res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result, error: null, msisdn });
  } catch (err) {
    console.error('MSISDN lookup error:', err);
    res.render('msisdn-lookup', { title: 'MSISDN Lookup', user: req.session, result: null, error: 'Terjadi kesalahan server', msisdn });
  }
});

module.exports = router;
module.exports.identifyOperator = identifyOperator;
module.exports.generateIMEI = generateIMEI;
module.exports.generateIMSI = generateIMSI;
module.exports.generateICCID = generateICCID;
