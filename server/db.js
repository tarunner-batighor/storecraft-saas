import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/db.json');

class Database {
  constructor() {
    this.data = {
      tenants: [],
      plans: [],
      users: [],
      categories: [],
      brands: [],
      products: [],
      orders: [],
      coupons: [],
      shipping_zones: [],
      reviews: [],
      wishlists: [],
      notifications: [],
      audit_logs: [],
      platform_invoices: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(raw);
        console.log('[DB] Database loaded successfully from disk.');
      } else {
        console.log('[DB] No database found on disk, running initial seed...');
        this.save();
      }
    } catch (err) {
      console.error('[DB] Error loading database:', err);
    }
  }

  save() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Error saving database to disk:', err);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  find(collectionName, query = {}, tenantId = undefined) {
    const coll = this.getCollection(collectionName);
    return coll.filter(item => {
      if (tenantId !== undefined && item.tenant_id !== undefined) {
        if (item.tenant_id !== tenantId) return false;
      }
      if (typeof query === 'function') {
        return query(item);
      }
      for (const [key, val] of Object.entries(query)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
  }

  findOne(collectionName, query = {}, tenantId = undefined) {
    const results = this.find(collectionName, query, tenantId);
    return results.length > 0 ? results[0] : null;
  }

  findById(collectionName, id, tenantId = undefined) {
    return this.findOne(collectionName, { id }, tenantId);
  }

  insert(collectionName, record, tenantId = undefined) {
    const coll = this.getCollection(collectionName);
    const id = record.id || uuidv4();
    const now = new Date().toISOString();
    
    const newRecord = {
      ...record,
      id,
      ...(tenantId && record.tenant_id === undefined ? { tenant_id: tenantId } : {}),
      created_at: record.created_at || now,
      updated_at: now
    };

    coll.push(newRecord);
    this.save();
    return newRecord;
  }

  update(collectionName, id, updates, tenantId = undefined) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => {
      if (item.id !== id) return false;
      if (tenantId !== undefined && item.tenant_id !== undefined && item.tenant_id !== tenantId) return false;
      return true;
    });

    if (index === -1) return null;

    coll[index] = {
      ...coll[index],
      ...updates,
      id,
      ...(tenantId && coll[index].tenant_id ? { tenant_id: coll[index].tenant_id } : {}),
      updated_at: new Date().toISOString()
    };

    this.save();
    return coll[index];
  }

  delete(collectionName, id, tenantId = undefined) {
    const coll = this.getCollection(collectionName);
    const index = coll.findIndex(item => {
      if (item.id !== id) return false;
      if (tenantId !== undefined && item.tenant_id !== undefined && item.tenant_id !== tenantId) return false;
      return true;
    });

    if (index === -1) return false;

    const removed = coll.splice(index, 1)[0];
    this.save();
    return removed;
  }

  count(collectionName, query = {}, tenantId = undefined) {
    return this.find(collectionName, query, tenantId).length;
  }

  reset() {
    this.data = {
      tenants: [],
      plans: [],
      users: [],
      categories: [],
      brands: [],
      products: [],
      orders: [],
      coupons: [],
      shipping_zones: [],
      reviews: [],
      wishlists: [],
      notifications: [],
      audit_logs: [],
      platform_invoices: []
    };
    this.save();
  }
}

const db = new Database();
export default db;
