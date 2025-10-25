import { getCurrentUser } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const user = getCurrentUser(req)
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  res.status(200).json({ user })
}