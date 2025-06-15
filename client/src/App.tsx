import { useState } from 'react'
import Login from './components/Login.tsx'

function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className = "bg-black h-screen text-white">

      <button 
      className = {`bg-neutral-800 py-2 px-3 rounded-md`}
      onClick = {() => setShowLogin(true)}>
        Login
      </button>

      {showLogin && 
        <Login setShowLogin = {setShowLogin}/>
      }
    </div>
  )
}

export default App
