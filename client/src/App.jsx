import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import ListUsers from './components/ListUsers.jsx'

const url = 'http://localhost:6500'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("resumeBuilderToken"))
  const [users, setUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)

  useEffect (() => {
    console.log(token)
  }, [token])

  

  const listUsers = async () => {
    try {
      const response = await fetch(`${url}/api/users/`, {
        method : "GET",
        headers : {
          "Content-Type" : "application/json"
        }
      })
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to list users`)
      }
      const data = await response.json()
      console.log(data)
      setUsers(data.data)
      setShowUserList(true)
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className = "bg-black h-screen text-white">

      {token == "" &&
      <button 
      className = {`bg-neutral-800 py-2 px-3 rounded-md`}
      onClick = {() => setShowLogin(true)}>
        Login
      </button>
      }

      {token != "" &&
      <button 
      className = {`bg-neutral-800 py-2 px-3 rounded-md`}
      onClick = {() => {setToken(""); localStorage.setItem("resumeBuilderToken", "")}}>
        Logout
      </button>
      }     

      <button 
      className = {`bg-neutral-800 py-2 px-3 rounded-md`}
      onClick = {listUsers}>
        Show Users
      </button>

      {showLogin && 
        <Login url = {url} setToken = {setToken} setShowLogin = {setShowLogin}/>
      }
      {showUserList && <ListUsers listUsers = {listUsers} setShowUserList = {setShowUserList} url = {url} users = {users} />}
    </div>
  )
}

export default App
