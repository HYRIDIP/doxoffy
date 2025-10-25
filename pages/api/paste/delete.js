import db from '../../../lib/database'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pasteId, username } = req.body

  if (!pasteId || !username) {
    return res.status(400).json({ error: 'Paste ID and username required' })
  }

  // Находим пользователя и пасту
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  const paste = db.prepare('SELECT * FROM pastes WHERE id = ?').get(pasteId)

  if (!user || !paste) {
    return res.status(404).json({ error: 'User or paste not found' })
  }

  // Проверяем права: автор, модератор или админ
  const isAuthor = paste.author_id === user.id
  const isStaff = user.role === 'moderator' || user.role === 'admin'

  if (!isAuthor && !isStaff) {
    return res.status(403).json({ error: 'No permission to delete this paste' })
  }

  try {
    const stmt = db.prepare('DELETE FROM pastes WHERE id = ?')
    stmt.run(pasteId)
    
    res.status(200).json({ message: 'Paste deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}