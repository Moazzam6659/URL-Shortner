import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <main className='min-h-screen container mx-auto'>
        <Header />
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
