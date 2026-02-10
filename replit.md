# BTS Indonesia API

## Overview
Platform API untuk database Tower BTS seluruh Indonesia. Menyediakan MSISDN lookup, database BTS tower, manajemen API key, dan admin control panel.

## Recent Changes
- 2026-02-10: Initial build - Full platform with database, API, frontend, admin panel, CLI tool

## Project Architecture
- **Backend**: Node.js + Express (server.js)
- **Database**: PostgreSQL with tables: users, api_keys, bts_towers, provinces, cities, districts, villages, operators, msisdn_lookups, usage_logs, plans
- **Frontend**: EJS templates (views/)
- **Auth**: Session-based with bcryptjs
- **Port**: 5000 (frontend + API)

## Key Files
- `server.js` - Main Express server
- `src/db.js` - Database connection pool
- `src/routes/` - All route handlers (auth, dashboard, msisdn, api, admin, pages)
- `src/middleware/auth.js` - Authentication middleware
- `views/` - EJS templates
- `views/admin/` - Admin panel views
- `db/schema.sql` - Database schema
- `db/seed-data.js` - Database seeder
- `cli/bts-cli.js` - CLI client tool

## Database Stats
- 38 Provinces
- 469 Kabupaten/Kota
- 7 Operators (Telkomsel, Indosat, XL, Tri, Smartfren, By.U, Net1)
- ~28,000 BTS towers
- 1,970 Districts

## Admin Login
- Username: admin
- Password: admin123

## API Endpoints
- GET /api/v1/msisdn/:msisdn - MSISDN lookup
- GET /api/v1/towers - List towers with filters
- GET /api/v1/towers/:id - Tower detail
- GET /api/v1/provinces - All provinces
- GET /api/v1/cities - Cities with optional province filter
- GET /api/v1/operators - All operators
- GET /api/v1/stats - Database statistics

## User Preferences
- Language: Bahasa Indonesia
- Contact: Telegram @XCodedLab_Dev, DANA +628984668800
