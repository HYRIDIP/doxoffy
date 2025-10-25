import bcrypt from 'bcryptjs'
import { getSession } from './session.js'

export const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

export const getCurrentUser = (req) => {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return null

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, value] = cookie.trim().split('=')
      return [key, value]
    })
  )

  const sessionId = cookies.session
  if (!sessionId) return null

  const session = getSession(sessionId)
  return session ? session.user : null
}

export const requireAuth = (handler) => {
  return (req, res) => {
    const user = getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    req.user = user
    return handler(req, res)
  }
}

export const requireAdmin = (handler) => {
  return (req, res) => {
    const user = getCurrentUser(req)
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    
    req.user = user
    return handler(req, res)
  }
}
