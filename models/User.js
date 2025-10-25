import { initDatabase, getDB } from '../lib/database.js'
import bcrypt from 'bcryptjs'

class User {
  static async create(username, password) {
    await initDatabase()
    const db = getDB()
    
    const hashedPassword = bcrypt.hashSync(password, 10)
    const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run([username, hashedPassword])
    
    return { lastInsertRowid: result.lastInsertRowid }
  }

  static async findByUsername(username) {
    await initDatabase()
    const db = getDB()
    
    return db.prepare('SELECT * FROM users WHERE username = ?').bind([username]).run()
  }

  static async findById(id) {
    await initDatabase()
    const db = getDB()
    
    return db.prepare('SELECT * FROM users WHERE id = ?').bind([id]).run()
  }

  static async updateRole(userId, role) {
    await initDatabase()
    const db = getDB()
    
    // In-memory implementation
    const user = db.users.find(u => u.id === userId)
    if (user) user.role = role
  }

  static async delete(userId) {
    await initDatabase()
    const db = getDB()
    
    db.users = db.users.filter(u => u.id !== userId)
  }

  static async getOnlineCount() {
    await initDatabase()
    const db = getDB()
    
    const result = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_online = 1').run()
    return result.count
  }

  static async updateOnlineStatus(userId, isOnline) {
    await initDatabase()
    const db = getDB()
    
    db.prepare('UPDATE users SET is_online = ? WHERE id = ?').run([isOnline ? 1 : 0, userId])
  }
}

export default User
