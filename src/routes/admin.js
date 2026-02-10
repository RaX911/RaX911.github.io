const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { requireLogin, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/admin', requireLogin, requireAdmin, async (req, res) => {
  try {
    const stats = {};
    stats.totalUsers = (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count;
    stats.totalApiKeys = (await pool.query('SELECT COUNT(*) FROM api_keys')).rows[0].count;
    stats.totalTowers = (await pool.query('SELECT COUNT(*) FROM bts_towers')).rows[0].count;
    stats.totalLookups = (await pool.query('SELECT COUNT(*) FROM msisdn_lookups')).rows[0].count;
    stats.totalProvinces = (await pool.query('SELECT COUNT(*) FROM provinces')).rows[0].count;
    stats.totalCities = (await pool.query('SELECT COUNT(*) FROM cities')).rows[0].count;
    stats.activeKeys = (await pool.query('SELECT COUNT(*) FROM api_keys WHERE is_active = true')).rows[0].count;
    stats.todayLookups = (await pool.query("SELECT COUNT(*) FROM msisdn_lookups WHERE created_at > NOW() - INTERVAL '24 hours'")).rows[0].count;

    const recentUsers = (await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 10')).rows;
    const recentLookups = (await pool.query(
      `SELECT ml.*, u.username, ak.name as key_name FROM msisdn_lookups ml
       JOIN api_keys ak ON ml.api_key_id = ak.id
       JOIN users u ON ak.user_id = u.id
       ORDER BY ml.created_at DESC LIMIT 20`
    )).rows;

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.session,
      stats,
      recentUsers,
      recentLookups,
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat admin dashboard', user: req.session });
  }
});

router.get('/admin/users', requireLogin, requireAdmin, async (req, res) => {
  try {
    const users = (await pool.query(
      `SELECT u.*, COUNT(ak.id) as key_count FROM users u
       LEFT JOIN api_keys ak ON u.id = ak.user_id
       GROUP BY u.id ORDER BY u.created_at DESC`
    )).rows;
    const plans = (await pool.query('SELECT * FROM plans ORDER BY price')).rows;
    res.render('admin/users', { title: 'Manage Users', user: req.session, users, plans, message: req.query.msg || null });
  } catch (err) {
    console.error('Admin users error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat data pengguna', user: req.session });
  }
});

router.post('/admin/users/:id/plan', requireLogin, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE users SET plan = $1, updated_at = NOW() WHERE id = $2', [req.body.plan, req.params.id]);
    res.redirect('/admin/users?msg=Plan+berhasil+diperbarui');
  } catch (err) {
    res.redirect('/admin/users?msg=Gagal+memperbarui+plan');
  }
});

router.post('/admin/users/:id/toggle', requireLogin, requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1', [req.params.id]);
    res.redirect('/admin/users?msg=Status+pengguna+diperbarui');
  } catch (err) {
    res.redirect('/admin/users?msg=Gagal+memperbarui+status');
  }
});

router.post('/admin/users/:id/delete', requireLogin, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      return res.redirect('/admin/users?msg=Tidak+dapat+menghapus+akun+sendiri');
    }
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.redirect('/admin/users?msg=Pengguna+berhasil+dihapus');
  } catch (err) {
    res.redirect('/admin/users?msg=Gagal+menghapus+pengguna');
  }
});

router.get('/admin/towers', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { province, page = 1 } = req.query;
    const limit = 50;
    const offset = (parseInt(page) - 1) * limit;
    let where = [];
    let params = [];
    let idx = 1;
    if (province) { where.push(`bt.province_code = $${idx++}`); params.push(province); }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
    const countQ = await pool.query(`SELECT COUNT(*) FROM bts_towers bt ${whereClause}`, params);
    const total = parseInt(countQ.rows[0].count);

    params.push(limit);
    params.push(offset);
    const towers = await pool.query(
      `SELECT bt.*, p.name as province_name, c.name as city_name, o.brand as operator_brand
       FROM bts_towers bt
       JOIN provinces p ON bt.province_code = p.code
       JOIN cities c ON bt.city_code = c.code
       JOIN operators o ON bt.operator_id = o.id
       ${whereClause}
       ORDER BY bt.id LIMIT $${idx++} OFFSET $${idx}`,
      params
    );
    const provinces = (await pool.query('SELECT * FROM provinces ORDER BY name')).rows;

    res.render('admin/towers', {
      title: 'BTS Towers',
      user: req.session,
      towers: towers.rows,
      provinces,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      selectedProvince: province || '',
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Admin towers error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat data tower', user: req.session });
  }
});

router.get('/admin/plans', requireLogin, requireAdmin, async (req, res) => {
  try {
    const plans = (await pool.query('SELECT * FROM plans ORDER BY price')).rows;
    res.render('admin/plans', { title: 'Manage Plans', user: req.session, plans, message: req.query.msg || null });
  } catch (err) {
    res.render('error', { title: 'Error', message: 'Gagal memuat data plan', user: req.session });
  }
});

router.post('/admin/plans/:id', requireLogin, requireAdmin, async (req, res) => {
  try {
    const { display_name, price, daily_limit, monthly_limit, features } = req.body;
    await pool.query(
      'UPDATE plans SET display_name = $1, price = $2, daily_limit = $3, monthly_limit = $4, features = $5 WHERE id = $6',
      [display_name, price, daily_limit, monthly_limit, features, req.params.id]
    );
    res.redirect('/admin/plans?msg=Plan+berhasil+diperbarui');
  } catch (err) {
    res.redirect('/admin/plans?msg=Gagal+memperbarui+plan');
  }
});

router.get('/admin/logs', requireLogin, requireAdmin, async (req, res) => {
  try {
    const logs = (await pool.query(
      `SELECT ul.*, u.username, ak.name as key_name FROM usage_logs ul
       JOIN users u ON ul.user_id = u.id
       JOIN api_keys ak ON ul.api_key_id = ak.id
       ORDER BY ul.created_at DESC LIMIT 100`
    )).rows;
    res.render('admin/logs', { title: 'Usage Logs', user: req.session, logs, message: req.query.msg || null });
  } catch (err) {
    console.error('Admin logs error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat log', user: req.session });
  }
});

module.exports = router;
