// Client API Helper with auto-attached Tenant and Auth headers

let currentTenantSlug = 'gadgetvibe';
let currentTenantId = 'tenant-gadgetvibe';

export function setApiTenant(slug, id) {
  if (slug) currentTenantSlug = slug;
  if (id) currentTenantId = id;
}

export function getApiTenantSlug() {
  return currentTenantSlug;
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('storecraft_token');
  const storedSlug = localStorage.getItem('storecraft_tenant_slug') || currentTenantSlug;
  const storedId = localStorage.getItem('storecraft_tenant_id') || currentTenantId;

  const headers = {
    'Content-Type': 'application/json',
    ...(storedSlug ? { 'x-tenant-slug': storedSlug } : {}),
    ...(storedId ? { 'x-tenant-id': storedId } : {}),
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
