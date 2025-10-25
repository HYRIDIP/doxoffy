import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Заглушка данных
    setUsers([
      { id: 1, username: 'небо', role: 'admin', is_online: true },
      { id: 2, username: 'moderator1', role: 'moderator', is_online: true },
      { id: 3, username: 'user1', role: 'user', is_online: true },
      { id: 4, username: 'user2', role: 'user', is_online: false },
      { id: 5, username: 'user3', role: 'user', is_online: true }
    ])
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Users</h1>
      
      <div style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        {users.map(user => (
          <div key={user.id} style={{
            padding: '15px',
            borderBottom: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href={`/profile/${user.username}`}>
              <span className={user.role === 'admin' ? 'admin-badge' : user.role === 'moderator' ? 'moderator-badge' : ''}>
                {user.username}
              </span>
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: user.is_online ? '#3fb950' : '#8b949e'
              }}></span>
              <span style={{ color: '#8b949e', fontSize: '12px' }}>
                {user.is_online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}