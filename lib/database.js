// Простая in-memory база для демонстрации на Vercel
let users = [
  {
    id: 1,
    username: 'небо',
    password: '$2a$10$I*&ASFDiagsdo87oasd', // хеш пароля I*&ASFDiagsdo87oasd
    role: 'admin',
    avatar: '',
    banner: '',
    created_at: new Date().toISOString(),
    is_online: false
  }
]

let pastes = []
let messages = []

export async function initDatabase() {
  return {
    users,
    pastes, 
    messages
  }
}

export function getDB() {
  return {
    users,
    pastes,
    messages,
    
    prepare(sql) {
      return {
        bind(params) {
          this.params = params
          return this
        },
        
        step() {
          return true
        },
        
        getAsObject() {
          return {}
        },
        
        free() {},
        
        run(params) {
          if (sql.includes('INSERT INTO users')) {
            const newUser = {
              id: users.length + 1,
              username: params[0],
              password: params[1],
              role: 'user',
              avatar: '',
              banner: '',
              created_at: new Date().toISOString(),
              is_online: true
            }
            users.push(newUser)
            return { lastInsertRowid: newUser.id }
          }
          
          if (sql.includes('INSERT INTO messages')) {
            const newMessage = {
              id: messages.length + 1,
              user_id: params[0],
              content: params[1],
              created_at: new Date().toISOString()
            }
            messages.push(newMessage)
            return { lastInsertRowid: newMessage.id }
          }
          
          if (sql.includes('INSERT INTO pastes')) {
            const newPaste = {
              id: pastes.length + 1,
              title: params[0],
              content: params[1],
              slug: params[2],
              author_id: params[3],
              created_at: new Date().toISOString()
            }
            pastes.push(newPaste)
            return { lastInsertRowid: newPaste.id }
          }
          
          if (sql.includes('UPDATE users SET is_online')) {
            const user = users.find(u => u.id === params[1])
            if (user) user.is_online = params[0]
            return {}
          }
          
          if (sql.includes('SELECT * FROM users WHERE username')) {
            return users.find(u => u.username === this.params[0]) || null
          }
          
          if (sql.includes('SELECT * FROM users WHERE id')) {
            return users.find(u => u.id === this.params[0]) || null
          }
          
          if (sql.includes('SELECT COUNT(*) as count FROM users WHERE is_online')) {
            return { count: users.filter(u => u.is_online).length }
          }
          
          if (sql.includes('SELECT * FROM pastes WHERE slug')) {
            return pastes.find(p => p.slug === this.params[0]) || null
          }
          
          if (sql.includes('SELECT m.*, u.username, u.role FROM messages m JOIN users u')) {
            const messageData = messages.map(msg => {
              const user = users.find(u => u.id === msg.user_id)
              return {
                ...msg,
                username: user?.username || 'unknown',
                role: user?.role || 'user'
              }
            })
            return messageData
          }
          
          return {}
        },
        
        all() {
          if (sql.includes('SELECT m.*, u.username, u.role FROM messages m JOIN users u')) {
            return messages.map(msg => {
              const user = users.find(u => u.id === msg.user_id)
              return {
                ...msg,
                username: user?.username || 'unknown',
                role: user?.role || 'user'
              }
            })
          }
          
          if (sql.includes('SELECT id, username, role, created_at, is_online FROM users')) {
            return users.map(u => ({
              id: u.id,
              username: u.username,
              role: u.role,
              created_at: u.created_at,
              is_online: u.is_online
            }))
          }
          
          return []
        }
      }
    }
  }
}
