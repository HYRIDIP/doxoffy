import { useState, useEffect } from 'react'

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Получаем текущего пользователя
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(console.error)

    loadMessages()
    const interval = setInterval(loadMessages, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages')
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !currentUser) return

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message
        })
      })

      if (response.ok) {
        setMessage('')
        loadMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        Global Chat {isOpen ? '▲' : '▼'}
      </div>
      
      {isOpen && (
        <>
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: '8px' }}>
                <span className={msg.role === 'admin' ? 'admin-badge' : msg.role === 'moderator' ? 'moderator-badge' : ''}>
                  {msg.username}:
                </span> {msg.content}
                <span style={{ fontSize: '10px', color: '#8b949e', marginLeft: '5px' }}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          
          <form onSubmit={sendMessage} className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={currentUser ? "Type a message..." : "Login to chat"}
              disabled={!currentUser}
              maxLength={200}
            />
          </form>
        </>
      )}
    </div>
  )
}
