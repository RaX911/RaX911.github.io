const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.render('login', { title: 'Login', error: null, user: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
    if (result.rows.length === 0) {
      return res.render('login', { title: 'Login', error: 'Username atau password salah', user: null });
    }
    const user = result.rows[0];
    if (!user.is_active) {
      return res.render('login', { title: 'Login', error: 'Akun dinonaktifkan', user: null });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.render('login', { title: 'Login', error: 'Username atau password salah', user: null });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.plan = user.plan;

    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { title: 'Login', error: 'Terjadi kesalahan server', user: null });
  }
});

router.get('/register', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.render('register', { title: 'Register', error: null, user: null });
});

router.post('/register', async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.render('register', { title: 'Register', error: 'Password tidak cocok', user: null });
  }
  if (password.length < 6) {
    return res.render('register', { title: 'Register', error: 'Password minimal 6 karakter', user: null });
  }
  try {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing.rows.length > 0) {
      return res.render('register', { title: 'Register', error: 'Username atau email sudah terdaftar', user: null });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hash]);
    res.redirect('/login?registered=1');
  } catch (err) {
    console.error('Register error:', err);
    res.render('register', { title: 'Register', error: 'Terjadi kesalahan server', user: null });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
