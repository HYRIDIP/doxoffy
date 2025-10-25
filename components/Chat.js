import { useState, useEffect, useRef } from 'react'

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    // Получаем текущего пользователя
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user)
          connectWebSocket()
        }
      })
      .catch(console.error)

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}`
    
    ws.current = new WebSocket(wsUrl)
    
    ws.current.onopen = () => {
      setIsConnected(true)
      console.log('Connected to chat')
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      console.log('Disconnected from chat')
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'message_history') {
        setMessages(data.messages)
      } else if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.message])
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !currentUser || !isConnected) return

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat_message',
        content: message
      }))
      setMessage('')
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        Global Chat {isOpen ? '▲' : '▼'}
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#3fb950' : '#da3633',
          marginLeft: '8px',
          display: 'inline-block'
        }}></span>
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
              placeholder={currentUser && isConnected ? "Type a message..." : "Connecting..."}
              disabled={!currentUser || !isConnected}
              maxLength={200}
            />
          </form>
        </>
      )}
    </div>
  )
}