const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const pool = require('./src/db');

const app = express();
const PORT = 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(session({
  store: new pgSession({ pool, tableName: 'session', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' }
}));

app.use(require('./src/routes/auth'));
app.use(require('./src/routes/pages'));
app.use(require('./src/routes/dashboard'));
app.use(require('./src/routes/msisdn'));
app.use(require('./src/routes/api'));
app.use(require('./src/routes/admin'));

app.use((req, res) => {
  res.status(404).render('error', { title: '404 Not Found', message: 'Halaman tidak ditemukan', user: req.session });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', { title: 'Server Error', message: 'Terjadi kesalahan server', user: req.session });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BTS Indonesia API Server running on port ${PORT}`);
});
