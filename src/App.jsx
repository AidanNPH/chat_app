import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Image from './pages/image/Image'
import Schedule from './pages/schedule/Schedule'

function App() {
  let Component

  switch (window.location.pathname) {
    case '/':
      Component = Home
      break
    case '/image':
      Component = Image
      break
    case '/schedule':
      Component = Schedule
      break
  }

  const [key, setKey] = useState('')

  return (
    <>
      <Navbar setKey={setKey} />
      <div className='container'><Component apiKey={key} /></div>
    </>
  )
}

export default App
