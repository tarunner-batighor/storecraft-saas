import express from 'express';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(requireTenant);
router.use(verifyAuth);
router.use(requireTenantStaff);

router.get('/providers', (req, res) => {
  const tenant = db.findById('tenants', req.tenant.id);
  const settings = tenant.courier_settings || {};

  const providers = [
    {
      id: 'pathao',
      name: 'Pathao Courier API',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=100&q=80',
      description: 'Fastest home delivery across 64 districts with instant cash on delivery collection.',
      enabled: settings.pathao?.enabled ?? true,
      features: ['Automated Consignment', 'Real-time Webhook', 'Next Day Inside Dhaka', 'OTP Delivery']
    },
    {
      id: 'steadfast',
      name: 'Steadfast Courier',
      logo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=100&q=80',
      description: 'Lowest return rate & fastest nationwide coverage with live parcel tracking.',
      enabled: settings.steadfast?.enabled ?? true,
      features: ['Automated Consignment', 'SMS Notification to Customer', '0% Return Charge']
    },
    {
      id: 'redx',
      name: 'RedX Logistics',
      logo: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=100&q=80',
      description: 'Nationwide doorstep pickup and express parcel delivery.',
      enabled: settings.redx?.enabled ?? false,
      features: ['Doorstep Pickup', 'Cash on Delivery', 'Bulk Upload']
    }
  ];

  res.json({ success: true, providers });
});

router.post('/estimate', (req, res) => {
  const { provider = 'pathao', destination_city = 'Dhaka', weight_kg = 1 } = req.body;
  const isInsideDhaka = destination_city.toLowerCase().includes('dhaka');
  
  let baseRate = isInsideDhaka ? 60 : 120;
  let extraWeightCharge = Math.max(0, weight_kg - 1) * 20;
  let codFee = 10;

  const totalEstimate = baseRate + extraWeightCharge + codFee;

  res.json({
    success: true,
    provider,
    estimate: {
      base_rate: baseRate,
      weight_charge: extraWeightCharge,
      cod_fee: codFee,
      total_charge: totalEstimate,
      estimated_delivery_days: isInsideDhaka ? '1 Day' : '2-3 Days'
    }
  });
});

export default router;
