import db from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHandler = requireAuth((req, res) => {
    const { title, content, slug, username } = req.body

    if (!title || !content || !slug) {
      return res.status(400).json({ error: 'Title, content and slug required' })
    }

    // Проверяем существование slug
    const existingPaste = db.prepare('SELECT * FROM pastes WHERE slug = ?').get(slug)
    if (existingPaste) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    // Находим пользователя
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO pastes (title, content, slug, author_id) 
        VALUES (?, ?, ?, ?)
      `)
      const result = stmt.run(title, content, slug, user.id)
      
      res.status(201).json({
        message: 'Paste created successfully',
        pasteId: result.lastInsertRowid,
        slug: slug
      })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return authHandler(req, res)
}