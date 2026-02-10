const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', requireLogin, async (req, res) => {
  try {
    const user = (await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId])).rows[0];
    const apiKeys = (await pool.query('SELECT * FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC', [req.session.userId])).rows;
    const usageResult = await pool.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN created_at > NOW() - INTERVAL \'24 hours\' THEN 1 ELSE 0 END), 0) as today FROM msisdn_lookups WHERE api_key_id IN (SELECT id FROM api_keys WHERE user_id = $1)',
      [req.session.userId]
    );
    const recentLookups = (await pool.query(
      `SELECT ml.*, ak.name as key_name FROM msisdn_lookups ml
       JOIN api_keys ak ON ml.api_key_id = ak.id
       WHERE ak.user_id = $1 ORDER BY ml.created_at DESC LIMIT 10`,
      [req.session.userId]
    )).rows;

    res.render('dashboard', {
      title: 'Dashboard',
      user,
      apiKeys,
      usage: usageResult.rows[0],
      recentLookups,
      message: req.query.msg || null
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.render('error', { title: 'Error', message: 'Gagal memuat dashboard', user: req.session });
  }
});

router.post('/dashboard/generate-key', requireLogin, async (req, res) => {
  try {
    const keyName = req.body.name || 'API Key';
    const existingKeys = await pool.query('SELECT COUNT(*) as cnt FROM api_keys WHERE user_id = $1', [req.session.userId]);
    const maxKeys = { free: 2, premium: 5, vip: 20 };
    const plan = req.session.plan || 'free';
    if (parseInt(existingKeys.rows[0].cnt) >= (maxKeys[plan] || 2)) {
      return res.redirect('/dashboard?msg=Batas+jumlah+API+key+tercapai');
    }
    const apiKey = 'bts_' + crypto.randomBytes(28).toString('hex');
    await pool.query('INSERT INTO api_keys (user_id, api_key, name) VALUES ($1, $2, $3)', [req.session.userId, apiKey, keyName]);
    res.redirect('/dashboard?msg=API+key+berhasil+dibuat');
  } catch (err) {
    console.error('Generate key error:', err);
    res.redirect('/dashboard?msg=Gagal+membuat+API+key');
  }
});

router.post('/dashboard/delete-key/:id', requireLogin, async (req, res) => {
  try {
    await pool.query('DELETE FROM api_keys WHERE id = $1 AND user_id = $2', [req.params.id, req.session.userId]);
    res.redirect('/dashboard?msg=API+key+berhasil+dihapus');
  } catch (err) {
    console.error('Delete key error:', err);
    res.redirect('/dashboard?msg=Gagal+menghapus+API+key');
  }
});

router.post('/dashboard/toggle-key/:id', requireLogin, async (req, res) => {
  try {
    await pool.query('UPDATE api_keys SET is_active = NOT is_active WHERE id = $1 AND user_id = $2', [req.params.id, req.session.userId]);
    res.redirect('/dashboard?msg=Status+API+key+diperbarui');
  } catch (err) {
    console.error('Toggle key error:', err);
    res.redirect('/dashboard?msg=Gagal+memperbarui+API+key');
  }
});

module.exports = router;
