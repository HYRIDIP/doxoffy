import db from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHandler = requireAuth((req, res) => {
    const { username, content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content required' })
    }

    if (content.length > 200) {
      return res.status(400).json({ error: 'Message too long' })
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    try {
      const stmt = db.prepare('INSERT INTO messages (user_id, content) VALUES (?, ?)')
      const result = stmt.run(user.id, content.trim())
      
      res.status(201).json({
        message: 'Message sent',
        messageId: result.lastInsertRowid
      })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return authHandler(req, res)
}