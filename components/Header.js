import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const [onlineCount, setOnlineCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Заглушка онлайн count
    setOnlineCount(42)
    
    // Получаем текущего пользователя
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(console.error)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setCurrentUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">Doxify</Link>
        
        <nav className="nav-links">
          <Link href="/home">Home</Link>
          <Link href="/upload">Upload</Link>
          <Link href="/users">Users</Link>
          
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && (
                <Link href="/admin/panel">Admin</Link>
              )}
              <span className={currentUser.role === 'admin' ? 'admin-badge' : currentUser.role === 'moderator' ? 'moderator-badge' : ''}>
                {currentUser.username}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c9d1d9',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
            </>
          )}
          
          <span className="online-count">Online: {onlineCount}</span>
        </nav>
      </div>
    </header>
  )
}