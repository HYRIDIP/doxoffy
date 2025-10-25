const sessions = new Map()

export const createSession = (user) => {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const session = {
    id: sessionId,
    user: user,
    createdAt: new Date(),
    lastActive: new Date()
  }
  
  sessions.set(sessionId, session)
  return sessionId
}

export const getSession = (sessionId) => {
  if (!sessionId) return null
  
  const session = sessions.get(sessionId)
  if (session) {
    session.lastActive = new Date()
    return session
  }
  return null
}

export const deleteSession = (sessionId) => {
  sessions.delete(sessionId)
}

// Очистка старых сессий каждые 30 минут
setInterval(() => {
  const now = new Date()
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActive > 24 * 60 * 60 * 1000) { // 24 часа
      sessions.delete(sessionId)
    }
  }
}, 30 * 60 * 1000)
