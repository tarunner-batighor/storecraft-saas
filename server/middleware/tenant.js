const db = require('../db');

function resolveTenant(req, res, next) {
  try {
    // 1. Check custom headers
    let tenantIdentifier = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'];
    
    // 2. Check query parameter
    if (!tenantIdentifier && (req.query.tenant || req.query.store)) {
      tenantIdentifier = req.query.tenant || req.query.store;
    }

    // 3. Check Host header (for subdomains or custom domains)
    if (!tenantIdentifier && req.headers.host) {
      const host = req.headers.host.split(':')[0]; // Remove port if any
      // Match custom domain
      const customDomainTenant = db.findOne('tenants', { custom_domain: host });
      if (customDomainTenant) {
        req.tenant = customDomainTenant;
        req.tenantId = customDomainTenant.id;
        return next();
      }

      // Match subdomain like tenant-slug.domain.com
      const parts = host.split('.');
      if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'admin' && parts[0] !== 'api') {
        tenantIdentifier = parts[0];
      }
    }

    if (tenantIdentifier) {
      // Find tenant by ID or by Slug
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

function requireTenant(req, res, next) {
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

module.exports = {
  resolveTenant,
  requireTenant
};
