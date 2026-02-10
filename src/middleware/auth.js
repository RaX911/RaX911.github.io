function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId || req.session.role !== 'admin') {
    return res.status(403).render('error', { title: 'Access Denied', message: 'Admin access required', user: req.session });
  }
  next();
}

async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required', message: 'Provide API key via X-API-Key header or api_key query parameter' });
  }

  const pool = require('../db');
  try {
    const result = await pool.query(
      `SELECT ak.*, u.plan, u.is_active as user_active, u.id as uid
       FROM api_keys ak JOIN users u ON ak.user_id = u.id
       WHERE ak.api_key = $1 AND ak.is_active = true`,
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const key = result.rows[0];
    if (!key.user_active) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    const planLimits = { free: 100, premium: 1000, vip: 10000 };
    const limit = planLimits[key.plan] || 100;

    if (key.requests_today >= limit) {
      return res.status(429).json({ error: 'Daily limit exceeded', limit, used: key.requests_today });
    }

    await pool.query('UPDATE api_keys SET requests_today = requests_today + 1, requests_total = requests_total + 1, last_used_at = NOW() WHERE id = $1', [key.id]);

    req.apiKeyData = key;
    next();
  } catch (err) {
    console.error('API auth error:', err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { requireLogin, requireAdmin, apiKeyAuth };
