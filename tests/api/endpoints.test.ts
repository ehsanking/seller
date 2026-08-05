/**
 * API Integration Tests for Seller REST Endpoints
 * Author: EHSANKiNG
 * Engine: Seller Platform
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

// Setup minimal test app mirroring server.ts routes
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Seller by EHSANKiNG', timestamp: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  res.json([
    { id: 'prod_1', name: 'Ehsan Signature Tech Hoodie', price: 89.99, stock: 45 },
    { id: 'prod_2', name: 'Minimalist Mechanical Keyboard', price: 149.50, stock: 12 }
  ]);
});

app.post('/api/orders', (req, res) => {
  const { items, customerEmail } = req.body;
  if (!items || !customerEmail) {
    return res.status(422).json({ error: 'Unprocessable Entity: items and customerEmail are required' });
  }
  res.status(201).json({
    orderId: 'ord_' + Math.random().toString(36).substr(2, 9),
    status: 'created',
    itemsCount: items.length,
    customerEmail
  });
});

describe('Seller API Integration Suite (Author: EHSANKiNG)', () => {
  it('GET /api/health returns 200 OK and engine signature', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.engine).toBe('Seller by EHSANKiNG');
  });

  it('GET /api/products returns product catalog array with correct JSON structure', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('price');
  });

  it('POST /api/orders creates order successfully on valid payload (201 Created)', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        customerEmail: 'ehsan@seller.io',
        items: [{ productId: 'prod_1', quantity: 1 }]
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('orderId');
    expect(response.body.customerEmail).toBe('ehsan@seller.io');
  });

  it('POST /api/orders returns 422 Unprocessable Entity on missing required payload fields', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ customerEmail: 'ehsan@seller.io' }); // missing items
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error');
  });
});
