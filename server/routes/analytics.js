import express from 'express';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(requireTenant);
router.use(verifyAuth);
router.use(requireTenantStaff);

router.get('/dashboard', (req, res) => {
  try {
    const orders = db.find('orders', {}, req.tenant.id);
    const products = db.find('products', {}, req.tenant.id);
    const customers = db.find('users', { role: 'customer' }, req.tenant.id);

    const totalOrders = orders.length;
    const grossRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const paidOrders = orders.filter(o => o.payment_status === 'paid');
    const netPaidRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;
    const pendingFulfillments = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

    const lowStockProducts = products.filter(p => {
      if (!p.track_quantity) return false;
      const threshold = p.low_stock_threshold || 5;
      return (p.stock_quantity || 0) <= threshold;
    }).map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock_quantity: p.stock_quantity,
      threshold: p.low_stock_threshold || 5,
      price: p.price
    }));

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    const last7Days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;

      const dayOrders = orders.filter(o => o.created_at && o.created_at.startsWith(dateStr));
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      last7Days.push({
        date: dateStr,
        label: dayLabel,
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    const productSalesMap = {};
    orders.forEach(o => {
      if (o.status !== 'cancelled' && Array.isArray(o.items)) {
        o.items.forEach(item => {
          if (!productSalesMap[item.product_id]) {
            productSalesMap[item.product_id] = {
              product_id: item.product_id,
              name: item.name,
              units_sold: 0,
              total_revenue: 0,
              image: item.image
            };
          }
          productSalesMap[item.product_id].units_sold += item.quantity;
          productSalesMap[item.product_id].total_revenue += item.total;
        });
      }
    });

    const topSelling = Object.values(productSalesMap)
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    res.json({
      success: true,
      metrics: {
        total_orders: totalOrders,
        gross_revenue: grossRevenue,
        net_paid_revenue: netPaidRevenue,
        avg_order_value: avgOrderValue,
        pending_fulfillments: pendingFulfillments,
        total_products: products.length,
        total_customers: customers.length,
        low_stock_count: lowStockProducts.length
      },
      charts: {
        daily_sales: last7Days,
        status_breakdown: [
          { name: 'Pending', count: statusCounts.pending, color: '#f59e0b' },
          { name: 'Confirmed', count: statusCounts.confirmed, color: '#0ea5e9' },
          { name: 'Processing', count: statusCounts.processing, color: '#8b5cf6' },
          { name: 'Shipped', count: statusCounts.shipped, color: '#3b82f6' },
          { name: 'Delivered', count: statusCounts.delivered, color: '#10b981' },
          { name: 'Cancelled', count: statusCounts.cancelled, color: '#ef4444' }
        ]
      },
      top_selling_products: topSelling,
      low_stock_products: lowStockProducts,
      recent_orders: recentOrders
    });
  } catch (err) {
    console.error('[Analytics Dashboard Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

router.get('/export-csv', (req, res) => {
  try {
    const orders = db.find('orders', {}, req.tenant.id);
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Subtotal (BDT)', 'Discount', 'Shipping', 'Total (BDT)', 'Payment Method', 'Payment Status', 'Fulfillment Status', 'Courier'];
    const rows = orders.map(o => [
      o.order_number,
      o.created_at ? o.created_at.split('T')[0] : '',
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      o.customer_phone || '',
      o.items ? o.items.length : 0,
      o.subtotal || 0,
      o.discount_amount || 0,
      o.shipping_cost || 0,
      o.total_amount || 0,
      o.payment_method || '',
      o.payment_status || '',
      o.status || '',
      o.courier_name || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${req.tenant.slug}-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

export default router;
