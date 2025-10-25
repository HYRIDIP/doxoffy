import Header from './Header'
import Footer from './Footer'
import Chat from './Chat'

export default function Layout({ children }) {
  return (
    <div className="container">
      <Header />
      <main>{children}</main>
      <Footer />
      <Chat />
    </div>
  )
}