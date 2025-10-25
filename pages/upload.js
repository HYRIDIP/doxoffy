import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: ''
  })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Заглушка - будет API запрос
    console.log('Creating paste:', formData)
    
    // Редирект на созданную пасту
    router.push(`/paste/${formData.slug || 'example'}`)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title: title,
      slug: generateSlug(title)
    })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '0 20px' }}>
      <h2>Create New Paste</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Enter paste title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Slug/URL:</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="URL identifier"
            required
          />
          <small style={{ color: '#8b949e' }}>
            https://doxify/{formData.slug || 'your-paste-slug'}
          </small>
        </div>
        
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Paste your content here..."
            required
            rows="15"
            style={{
              width: '100%',
              padding: '10px',
              background: '#0d1117',
              border: '1px solid #30363d',
              color: '#c9d1d9',
              borderRadius: '3px',
              fontFamily: 'Courier New, monospace',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button type="submit" className="btn">Create Paste</button>
      </form>
    </div>
  )
}