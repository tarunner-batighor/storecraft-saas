const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'storecraft_super_secure_jwt_secret_key_2026';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
      email: user.email,
      name: user.name,
      permissions: user.permissions || []
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findById('users', decoded.id);
    if (user && user.is_active) {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication is required to access this resource.'
    });
  }
  next();
}

function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Super Admin privileges required.'
    });
  }
  next();
}

function requireTenantStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Super admin can access any tenant
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Tenant owner or staff belonging to this tenant
  if (
    (req.user.role === 'store_owner' || req.user.role === 'store_staff') &&
    req.tenantId &&
    req.user.tenant_id === req.tenantId
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Forbidden',
    message: 'You do not have administrative permission for this store.'
  });
}

function checkPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.user.role === 'super_admin' || req.user.role === 'store_owner') {
      return next();
    }
    if (req.user.permissions && (req.user.permissions.includes('all') || req.user.permissions.includes(permission))) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: `Required permission '${permission}' not granted.`
    });
  };
}

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyAuth,
  requireAuth,
  requireSuperAdmin,
  requireTenantStaff,
  checkPermission
};
