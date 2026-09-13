import db from '../db.js';

export function resolveTenant(req, res, next) {
  try {
    let tenantIdentifier = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'];
    
    if (!tenantIdentifier && (req.query.tenant || req.query.store)) {
      tenantIdentifier = req.query.tenant || req.query.store;
    }

    if (!tenantIdentifier && req.headers.host) {
      const host = req.headers.host.split(':')[0];
      const customDomainTenant = db.findOne('tenants', { custom_domain: host });
      if (customDomainTenant) {
        req.tenant = customDomainTenant;
        req.tenantId = customDomainTenant.id;
        return next();
      }

      const parts = host.split('.');
      if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'admin' && parts[0] !== 'api') {
        tenantIdentifier = parts[0];
      }
    }

    if (tenantIdentifier) {
      const tenant = db.findOne('tenants', t => t.id === tenantIdentifier || t.slug === tenantIdentifier);
      if (tenant) {
        req.tenant = tenant;
        req.tenantId = tenant.id;
      }
    }

    next();
  } catch (err) {
    console.error('[Tenant Middleware] Error resolving tenant:', err);
    next();
  }
}

export function requireTenant(req, res, next) {
  if (!req.tenant) {
    return res.status(404).json({
      success: false,
      error: 'TenantNotFound',
      message: 'Store not found. Please specify a valid x-tenant-id or ?store=slug.'
    });
  }

  if (req.tenant.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: 'TenantSuspended',
      message: 'This store is temporarily suspended. Please contact platform support.'
    });
  }

  next();
}
