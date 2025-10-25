import db from '../../../lib/database'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stmt = db.prepare(`
      SELECT m.*, u.username, u.role 
      FROM messages m 
      JOIN users u ON m.user_id = u.id 
      ORDER BY m.created_at DESC 
      LIMIT 50
    `)
    const messages = stmt.all().reverse() // Чтобы новые были внизу
    
    res.status(200).json({ messages })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}