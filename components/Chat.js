import { initDatabase, getDB } from '../../../lib/database'
import { getCurrentUser } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { content } = req.body

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content required' })
  }

  if (content.length > 200) {
    return res.status(400).json({ error: 'Message too long' })
  }

  try {
    await initDatabase()
    const db = getDB()
    
    const stmt = db.prepare('INSERT INTO messages (user_id, content) VALUES (?, ?)')
    stmt.bind([user.id, content.trim()])
    stmt.step()
    stmt.free()

    res.status(201).json({
      message: 'Message sent',
      success: true
    })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
