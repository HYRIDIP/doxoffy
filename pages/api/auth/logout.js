import { deleteSession } from '../../../lib/session'
import User from '../../../models/User'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cookieHeader = req.headers.cookie
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=')
        return [key, value]
      })
    )

    const sessionId = cookies.session
    if (sessionId) {
      // Обновляем статус онлайн
      const session = getSession(sessionId)
      if (session && session.user) {
        await User.updateOnlineStatus(session.user.id, false)
      }
      
      deleteSession(sessionId)
    }
  }

  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  res.status(200).json({ message: 'Logged out successfully' })
}
