import { getDB, initDatabase } from '../lib/database';
import bcrypt from 'bcryptjs';

class User {
  static async create(username, password) {
    await initDatabase();
    const db = getDB();
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.bind([username, hashedPassword]);
    const result = stmt.step();
    stmt.free();
    
    return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0].values[0][0] };
  }

  static async findByUsername(username) {
    await initDatabase();
    const db = getDB();
    
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }

  static async findById(id) {
    await initDatabase();
    const db = getDB();
    
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }

  static async updateRole(userId, role) {
    await initDatabase();
    const db = getDB();
    
    const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
    stmt.bind([role, userId]);
    stmt.step();
    stmt.free();
  }

  static async delete(userId) {
    await initDatabase();
    const db = getDB();
    
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.bind([userId]);
    stmt.step();
    stmt.free();
  }

  static async getOnlineCount() {
    await initDatabase();
    const db = getDB();
    
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_online = 1');
    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();
    return result.count;
  }
}

static async updateOnlineStatus(userId, isOnline) {
  await initDatabase();
  const db = getDB();
  
  const stmt = db.prepare('UPDATE users SET is_online = ? WHERE id = ?');
  stmt.bind([isOnline ? 1 : 0, userId]);
  stmt.step();
  stmt.free();
}

export default User;

