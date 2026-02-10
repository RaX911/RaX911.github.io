const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stats = {};
    stats.towers = (await pool.query('SELECT COUNT(*) FROM bts_towers WHERE is_active = true')).rows[0].count;
    stats.provinces = (await pool.query('SELECT COUNT(*) FROM provinces')).rows[0].count;
    stats.cities = (await pool.query('SELECT COUNT(*) FROM cities')).rows[0].count;
    stats.operators = (await pool.query('SELECT COUNT(*) FROM operators')).rows[0].count;
    const plans = (await pool.query('SELECT * FROM plans WHERE is_active = true ORDER BY price')).rows;
    res.render('index', { title: 'BTS Indonesia API', user: req.session, stats, plans });
  } catch (err) {
    console.error('Home error:', err);
    res.render('index', { title: 'BTS Indonesia API', user: req.session, stats: {}, plans: [] });
  }
});

router.get('/pricing', async (req, res) => {
  try {
    const plans = (await pool.query('SELECT * FROM plans WHERE is_active = true ORDER BY price')).rows;
    res.render('pricing', { title: 'Pricing', user: req.session, plans });
  } catch (err) {
    res.render('pricing', { title: 'Pricing', user: req.session, plans: [] });
  }
});

router.get('/docs', (req, res) => {
  res.render('docs', { title: 'API Documentation', user: req.session });
});

router.get('/towers', async (req, res) => {
  try {
    const { province, page = 1 } = req.query;
    const limit = 30;
    const offset = (parseInt(page) - 1) * limit;
    let where = ['bt.is_active = true'];
    let params = [];
    let idx = 1;
    if (province) { where.push(`bt.province_code = $${idx++}`); params.push(province); }

    const countQ = await pool.query(`SELECT COUNT(*) FROM bts_towers bt WHERE ${where.join(' AND ')}`, params);
    const total = parseInt(countQ.rows[0].count);

    params.push(limit);
    params.push(offset);
    const towers = await pool.query(
      `SELECT bt.*, p.name as province_name, c.name as city_name, o.brand as operator_brand
       FROM bts_towers bt
       JOIN provinces p ON bt.province_code = p.code
       JOIN cities c ON bt.city_code = c.code
       JOIN operators o ON bt.operator_id = o.id
       WHERE ${where.join(' AND ')}
       ORDER BY bt.province_code, bt.city_code LIMIT $${idx++} OFFSET $${idx}`,
      params
    );
    const provinces = (await pool.query('SELECT * FROM provinces ORDER BY name')).rows;

    res.render('towers', {
      title: 'BTS Towers Database',
      user: req.session,
      towers: towers.rows,
      provinces,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      selectedProvince: province || ''
    });
  } catch (err) {
    console.error('Towers error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat data tower', user: req.session });
  }
});

module.exports = router;
