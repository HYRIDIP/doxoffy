import db from '../../../lib/database'
import { requireAdmin } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Получение списка пользователей
    const users = db.prepare(`
      SELECT id, username, role, created_at, is_online 
      FROM users 
      ORDER BY created_at DESC
    `).all()
    
    return res.status(200).json({ users })
  }

  if (req.method === 'DELETE') {
    const adminHandler = requireAdmin((req, res) => {
      const { userId } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' })
      }

      // Нельзя удалить себя
      const { username } = req.body
      const currentUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
      if (currentUser.id === userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' })
      }

      try {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?')
        stmt.run(userId)
        
        res.status(200).json({ message: 'User deleted successfully' })
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    return adminHandler(req, res)
  }

  if (req.method === 'POST') {
    const adminHandler = requireAdmin((req, res) => {
      const { userId, action } = req.body

      if (!userId || !action) {
        return res.status(400).json({ error: 'User ID and action required' })
      }

      try {
        if (action === 'make_moderator') {
          const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?')
          stmt.run('moderator', userId)
        } else if (action === 'remove_moderator') {
          const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?')
          stmt.run('user', userId)
        }

        res.status(200).json({ message: 'User role updated successfully' })
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
      }
    })

    return adminHandler(req, res)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}