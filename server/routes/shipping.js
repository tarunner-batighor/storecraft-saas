import express from 'express';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(requireTenant);

router.get('/zones', (req, res) => {
  const zones = db.find('shipping_zones', {}, req.tenant.id);
  res.json({ success: true, zones });
});

router.use(verifyAuth);
router.use(requireTenantStaff);

router.post('/zones', (req, res) => {
  const { name, cities, rate, free_shipping_threshold, estimated_days } = req.body;
  if (!name || rate === undefined) {
    return res.status(400).json({ success: false, message: 'Name and rate are required' });
  }

  const newZone = db.insert('shipping_zones', {
    tenant_id: req.tenant.id,
    name,
    cities: Array.isArray(cities) ? cities : (cities ? cities.split(',').map(s => s.trim()) : ['All']),
    rate: Number(rate),
    free_shipping_threshold: free_shipping_threshold ? Number(free_shipping_threshold) : null,
    estimated_days: estimated_days || '2-3 Days'
  }, req.tenant.id);

  res.status(201).json({ success: true, message: 'Shipping zone created', zone: newZone });
});

router.put('/zones/:id', (req, res) => {
  const updated = db.update('shipping_zones', req.params.id, req.body, req.tenant.id);
  res.json({ success: true, message: 'Shipping zone updated', zone: updated });
});

router.delete('/zones/:id', (req, res) => {
  db.delete('shipping_zones', req.params.id, req.tenant.id);
  res.json({ success: true, message: 'Shipping zone deleted' });
});

export default router;
