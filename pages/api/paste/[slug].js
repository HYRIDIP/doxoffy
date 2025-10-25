import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function PastePage() {
  const router = useRouter()
  const { slug } = router.query
  const [paste, setPaste] = useState(null)
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    if (slug) {
      // Заглушка данных
      setPaste({
        id: 1,
        title: 'Example Paste',
        content: 'This is example paste content.\nYou can write anything here!',
        slug: slug,
        author: 'username',
        created_at: new Date().toISOString(),
        author_role: 'user'
      })
      setIsAuthor(true) // Заглушка - в реальности проверять текущего пользователя
    }
  }, [slug])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this paste?')) {
      // Заглушка - API запрос на удаление
      console.log('Deleting paste:', paste.id)
      router.push('/home')
    }
  }

  if (!paste) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#58a6ff' }}>{paste.title}</h1>
        
        {(isAuthor || paste.author_role === 'admin' || paste.author_role === 'moderator') && (
          <button 
            onClick={handleDelete}
            style={{
              background: '#da3633',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Delete Paste
          </button>
        )}
      </div>
      
      <div style={{ 
        marginBottom: '20px',
        color: '#8b949e',
        fontSize: '14px'
      }}>
        by{' '}
        <span className={paste.author_role === 'admin' ? 'admin-badge' : paste.author_role === 'moderator' ? 'moderator-badge' : ''}>
          {paste.author}
        </span>
        {' • '}
        {new Date(paste.created_at).toLocaleDateString()}
      </div>
      
      <pre style={{
        background: '#161b22',
        border: '1px solid #30363d',
        padding: '20px',
        borderRadius: '6px',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        color: '#c9d1d9',
        fontFamily: 'Courier New, monospace',
        lineHeight: '1.5'
      }}>
        {paste.content}
      </pre>
    </div>
  )
}