import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Проверка админских credentials
    if (formData.username === 'небо' && formData.password === 'I*&ASFDiagsdo87oasd') {
      console.log('Admin login successful')
      router.push('/admin/panel')
      return
    }

    // Заглушка для обычного пользователя
    console.log('User login attempt:', formData)
    router.push('/home')
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <div style={{ color: '#f85149', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  )
}