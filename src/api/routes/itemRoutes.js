import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../../config/postgres.js';
import QRCode from 'qrcode';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// GET all items
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single item by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create item with optional image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { style_code, price, quantity, color, fabric_composition, fabric_weight, packaging_details } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const insertQuery = `INSERT INTO items (style_code, price, quantity, color, fabric_composition, fabric_weight, packaging_details, image_url)
                         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [style_code, price, quantity, color, fabric_composition, fabric_weight, packaging_details, imagePath];
    const { rows } = await pool.query(insertQuery, values);
    const item = rows[0];

    const qrPath = path.join('qr-codes', `item-${item.id}.png`);
    await fs.promises.mkdir('qr-codes', { recursive: true });
    await QRCode.toFile(qrPath, `https://mydomain.com/item/${item.id}`);
    await pool.query('UPDATE items SET qr_code_url=$1 WHERE id=$2', [qrPath, item.id]);

    const qrData = await fs.promises.readFile(qrPath);
    const base64Qr = qrData.toString('base64');
    res.status(201).json({ ...item, qr_code_url: qrPath, qr_code_base64: base64Qr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['price','quantity','color','fabric_composition','fabric_weight','packaging_details'];
    const updates = [];
    const values = [];
    fields.forEach((field, idx) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field}=$${values.length+1}`);
        values.push(req.body[field]);
      }
    });
    if (updates.length === 0) return res.status(400).json({ error: 'No valid fields' });
    values.push(id);
    const query = `UPDATE items SET ${updates.join(', ')} WHERE id=$${values.length} RETURNING *`;
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM items WHERE id=$1 RETURNING *', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    // delete QR code file if exists
    if (rows[0].qr_code_url) {
      fs.unlink(rows[0].qr_code_url, () => {});
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Summary report
router.get('/reports/summary', async (req, res) => {
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM items');
    const valueResult = await pool.query('SELECT SUM(price * quantity) AS total FROM items');
    const fabricResult = await pool.query('SELECT fabric_composition, COUNT(*) FROM items GROUP BY fabric_composition');
    const colorResult = await pool.query('SELECT color, COUNT(*) FROM items GROUP BY color');
    res.json({
      total_items: parseInt(countResult.rows[0].count, 10),
      total_value: Number(valueResult.rows[0].total || 0),
      by_fabric: fabricResult.rows,
      by_color: colorResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
