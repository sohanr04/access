CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  style_code VARCHAR,
  price NUMERIC,
  quantity INTEGER,
  color VARCHAR,
  fabric_composition VARCHAR,
  fabric_weight NUMERIC,
  packaging_details TEXT,
  qr_code_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
