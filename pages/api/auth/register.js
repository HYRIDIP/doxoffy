import User from '../../../models/User'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  // Валидация
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // Проверка существующего пользователя
  const existingUser = User.findByUsername(username)
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' })
  }

  try {
    // Создание пользователя
    const result = User.create(username, password)
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.lastInsertRowid 
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}