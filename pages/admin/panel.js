import { useState, useEffect } from 'react'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [moderators, setModerators] = useState([])

  useEffect(() => {
    // Заглушка данных
    setUsers([
      { id: 1, username: 'user1', role: 'user', created_at: '2024-01-01' },
      { id: 2, username: 'user2', role: 'user', created_at: '2024-01-02' },
      { id: 3, username: 'user3', role: 'user', created_at: '2024-01-03' }
    ])
    
    setModerators([
      { id: 4, username: 'moderator1', role: 'moderator', created_at: '2024-01-01' }
    ])
  }, [])

  const deleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      // Заглушка - API запрос
      console.log('Deleting user:', userId)
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const makeModerator = (userId) => {
    // Заглушка - API запрос
    console.log('Making user moderator:', userId)
  }

  const removeModerator = (userId) => {
    // Заглушка - API запрос
    console.log('Removing moderator:', userId)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 20px' }}>
      <h1 style={{ color: '#58a6ff', marginBottom: '30px' }}>Admin Panel</h1>
      
      {/* Users Management */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Users Management</h2>
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
              <div>
                <span>{user.username}</span>
                <span style={{ color: '#8b949e', fontSize: '12px', marginLeft: '10px' }}>
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => makeModerator(user.id)}
                  style={{
                    background: '#bc8cff',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Make Moderator
                </button>
                
                <button 
                  onClick={() => deleteUser(user.id)}
                  style={{
                    background: '#da3633',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moderators Management */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Moderators Management</h2>
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          {moderators.map(mod => (
            <div key={mod.id} style={{
              padding: '15px',
              borderBottom: '1px solid #30363d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span className="moderator-badge">{mod.username}</span>
                <span style={{ color: '#8b949e', fontSize: '12px', marginLeft: '10px' }}>
                  Moderator since: {new Date(mod.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <button 
                onClick={() => removeModerator(mod.id)}
                style={{
                  background: '#da3633',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove Moderator
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}