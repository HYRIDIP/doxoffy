import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    // Редирект на главную, так как у нас уже есть index.js
    window.location.href = '/'
  }, [])

  return <div>Redirecting...</div>
}