const db = require('../lib/database');
const bcrypt = require('bcryptjs');

class User {
  static create(username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    return stmt.run(username, hashedPassword);
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static updateRole(userId, role) {
    const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
    return stmt.run(role, userId);
  }

  static delete(userId) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(userId);
  }

  static getOnlineCount() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_online = TRUE');
    return stmt.get().count;
  }
}

module.exports = User;