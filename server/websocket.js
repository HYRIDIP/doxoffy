const WebSocket = require('ws')
const db = require('../lib/database')

class ChatServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server })
    this.clients = new Map()
    
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req)
    })
  }

  handleConnection(ws, req) {
    // Получаем сессию из cookies
    const cookies = this.parseCookies(req.headers.cookie)
    const sessionId = cookies.session
    
    if (!sessionId) {
      ws.close()
      return
    }

    const session = require('../lib/session').getSession(sessionId)
    if (!session) {
      ws.close()
      return
    }

    const user = session.user
    this.clients.set(ws, user)

    console.log(`User ${user.username} connected to chat`)

    // Отправляем историю сообщений
    this.sendMessageHistory(ws)

    ws.on('message', (data) => {
      this.handleMessage(ws, data.toString(), user)
    })

    ws.on('close', () => {
      this.clients.delete(ws)
      console.log(`User ${user.username} disconnected from chat`)
    })
  }

  parseCookies(cookieHeader) {
    if (!cookieHeader) return {}
    return Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=')
        return [key, value]
      })
    )
  }

  async sendMessageHistory(ws) {
    try {
      const messages = db.prepare(`
        SELECT m.*, u.username, u.role 
        FROM messages m 
        JOIN users u ON m.user_id = u.id 
        ORDER BY m.created_at DESC 
        LIMIT 50
      `).all().reverse()

      ws.send(JSON.stringify({
        type: 'message_history',
        messages: messages
      }))
    } catch (error) {
      console.error('Error sending message history:', error)
    }
  }

  async handleMessage(ws, data, user) {
    try {
      const messageData = JSON.parse(data)
      
      if (messageData.type === 'chat_message') {
        const content = messageData.content?.trim()
        
        if (!content || content.length === 0 || content.length > 200) {
          return
        }

        // Сохраняем в базу
        const stmt = db.prepare('INSERT INTO messages (user_id, content) VALUES (?, ?)')
        const result = stmt.run(user.id, content)

        // Создаем объект сообщения для рассылки
        const message = {
          id: result.lastInsertRowid,
          content: content,
          username: user.username,
          role: user.role,
          created_at: new Date().toISOString()
        }

        // Рассылаем всем клиентам
        this.broadcast({
          type: 'new_message',
          message: message
        })
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  }

  broadcast(data) {
    const message = JSON.stringify(data)
    this.clients.forEach((user, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }
}

module.exports = ChatServer