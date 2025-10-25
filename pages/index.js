import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [recentPastes, setRecentPastes] = useState([])

  useEffect(() => {
    // Заглушка данных
    setRecentPastes([
      { id: 1, title: 'Welcome to Doxify', author: 'admin', slug: 'welcome' },
      { id: 2, title: 'Rules & Guidelines', author: 'moderator', slug: 'rules' },
      { id: 3, title: 'Test Paste', author: 'user1', slug: 'test-paste' }
    ])
  }, [])

  const asciiCube = `

    (
     )
    ()
   |--|
   |  |
 .-|  |-.
:  |  |  :
:  '--'  :
 '-....-'

  `

  return (
    <div style={{ padding: '20px 0' }}>
      {/* ASCII Cube */}
      <div className="ascii-cube">
        {asciiCube}
      </div>

      {/* Search Bar */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <input 
          type="text" 
          placeholder="Search pastes..."
          style={{
            width: '50%',
            padding: '10px',
            background: '#0d1117',
            border: '1px solid #30363d',
            color: '#c9d1d9',
            borderRadius: '3px'
          }}
        />
      </div>

      {/* Recent Pastes */}
      <h2 style={{ marginBottom: '20px', color: '#c9d1d9' }}>Recent Pastes</h2>
      <div className="paste-grid">
        {recentPastes.map(paste => (
          <div key={paste.id} className="paste-card">
            <Link href={`/paste/${paste.slug}`}>
              <div className="paste-title">{paste.title}</div>
            </Link>
            <Link href={`/profile/${paste.author}`}>
              <div className="paste-author">by {paste.author}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}