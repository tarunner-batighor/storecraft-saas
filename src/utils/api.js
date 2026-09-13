// Client API Helper with dynamic URL and Tenant Header resolution

let currentTenantSlug = 'sarwarbooks';
let currentTenantId = null;

export function setApiTenant(slug, id) {
  if (slug) {
    currentTenantSlug = slug;
    localStorage.setItem('storecraft_tenant_slug', slug);
  }
  if (id) {
    currentTenantId = id;
    localStorage.setItem('storecraft_tenant_id', id);
  }
}

export function getApiTenantSlug() {
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/\/store\/([^/]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return localStorage.getItem('storecraft_tenant_slug') || currentTenantSlug;
  }
  return currentTenantSlug;
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('storecraft_token');
  
  // Always prioritize the slug in the URL path if currently on a storefront
  let activeSlug = currentTenantSlug;
  if (typeof window !== 'undefined') {
    const match = window.location.pathname.match(/\/store\/([^/]+)/);
    if (match && match[1]) {
      activeSlug = match[1];
    } else {
      activeSlug = localStorage.getItem('storecraft_tenant_slug') || currentTenantSlug;
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(activeSlug ? { 'x-tenant-slug': activeSlug } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.headers.get('content-type')?.includes('text/csv')) {
      return res.text();
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  del: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options })
};
