import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Profile() {
  const router = useRouter()
  const { username } = router.query
  const [profile, setProfile] = useState(null)
  const [userPastes, setUserPastes] = useState([])

  useEffect(() => {
    if (username) {
      // Заглушка данных
      setProfile({
        username: username,
        role: username === 'небо' ? 'admin' : username === 'moderator' ? 'moderator' : 'user',
        created_at: '2024-01-01',
        avatar: '',
        banner: ''
      })
      
      setUserPastes([
        { id: 1, title: 'My First Paste', slug: 'first-paste', created_at: '2024-01-01' },
        { id: 2, title: 'Another Paste', slug: 'another-paste', created_at: '2024-01-02' }
      ])
    }
  }, [username])

  if (!profile) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        height: '200px',
        background: profile.banner ? `url(${profile.banner})` : '#161b22',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid #30363d'
      }}></div>
      
      {/* Profile Info */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: profile.avatar ? `url(${profile.avatar})` : '#30363d',
            backgroundSize: 'cover',
            border: '2px solid #58a6ff'
          }}></div>
          
          <div>
            <h1 className={profile.role === 'admin' ? 'admin-badge' : profile.role === 'moderator' ? 'moderator-badge' : ''}>
              {profile.username}
            </h1>
            <p style={{ color: '#8b949e' }}>
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User's Pastes */}
        <h3 style={{ marginBottom: '15px' }}>Pastes by {profile.username}</h3>
        <div className="paste-grid">
          {userPastes.map(paste => (
            <div key={paste.id} className="paste-card" onClick={() => router.push(`/paste/${paste.slug}`)}>
              <div className="paste-title">{paste.title}</div>
              <div className="paste-author">
                {new Date(paste.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}