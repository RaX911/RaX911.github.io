CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  plan VARCHAR(20) DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  api_key VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(100) DEFAULT 'Default',
  is_active BOOLEAN DEFAULT true,
  requests_today INTEGER DEFAULT 0,
  requests_total INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provinces (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  province_code VARCHAR(10) REFERENCES provinces(code),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'kabupaten'
);

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  code VARCHAR(15) UNIQUE NOT NULL,
  city_code VARCHAR(10) REFERENCES cities(code),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS villages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  district_code VARCHAR(15) REFERENCES districts(code),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'desa'
);

CREATE TABLE IF NOT EXISTS operators (
  id SERIAL PRIMARY KEY,
  mcc VARCHAR(5) NOT NULL DEFAULT '510',
  mnc VARCHAR(5) NOT NULL,
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  prefix VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS bts_towers (
  id SERIAL PRIMARY KEY,
  cell_id INTEGER NOT NULL,
  lac INTEGER NOT NULL,
  mcc VARCHAR(5) NOT NULL DEFAULT '510',
  mnc VARCHAR(5) NOT NULL,
  operator_id INTEGER REFERENCES operators(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  province_code VARCHAR(10) REFERENCES provinces(code),
  city_code VARCHAR(10),
  district_code VARCHAR(15),
  village_code VARCHAR(20),
  tower_type VARCHAR(20) DEFAULT '4G',
  azimuth INTEGER DEFAULT 0,
  height_m DOUBLE PRECISION DEFAULT 30,
  power_dbm DOUBLE PRECISION DEFAULT 43,
  band VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bts_cell_lac ON bts_towers(cell_id, lac);
CREATE INDEX IF NOT EXISTS idx_bts_mcc_mnc ON bts_towers(mcc, mnc);
CREATE INDEX IF NOT EXISTS idx_bts_province ON bts_towers(province_code);
CREATE INDEX IF NOT EXISTS idx_bts_city ON bts_towers(city_code);
CREATE INDEX IF NOT EXISTS idx_bts_location ON bts_towers(latitude, longitude);

CREATE TABLE IF NOT EXISTS msisdn_lookups (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER REFERENCES api_keys(id),
  msisdn VARCHAR(20) NOT NULL,
  operator_name VARCHAR(100),
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER REFERENCES api_keys(id),
  user_id INTEGER REFERENCES users(id),
  endpoint VARCHAR(200),
  method VARCHAR(10),
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  daily_limit INTEGER DEFAULT 100,
  monthly_limit INTEGER DEFAULT 3000,
  features TEXT,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO plans (name, display_name, price, daily_limit, monthly_limit, features) VALUES
  ('free', 'Free Plan', 0, 100, 3000, 'Basic MSISDN lookup,BTS tower search,Limited API calls'),
  ('premium', 'Premium Plan', 99000, 1000, 30000, 'Advanced MSISDN lookup,Full BTS data,Coordinate tracking,Priority support'),
  ('vip', 'VIP Plan', 299000, 10000, 300000, 'Unlimited MSISDN lookup,Full BTS data,Real-time tracking,Dedicated support,Export data,Bulk lookup')
ON CONFLICT (name) DO NOTHING;
