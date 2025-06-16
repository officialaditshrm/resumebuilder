import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Login from './components/Login.jsx'
import ListUsers from './pages/ListUsers.jsx'
import Header from './components/Header.jsx'
import Landing from './pages/Landing.jsx'
import MyResumes from './pages/MyResumes.jsx'


const url = 'http://localhost:6500'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(null)
  const [users, setUsers] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [allResumes, setallResumes] = useState([])
  const [currResumeData, setCurrResumeData] = useState(null)


  // DECODING TOKEN IF THE USER IS ALREADY LOGGED IN TO LOAD USER-DATA

  function decodeJWT(token) {
      try {
          const base64Url = token.split('.')[1]; // Get the payload part of the JWT
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
              atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
          );
          return JSON.parse(jsonPayload);
      } catch (error) {
          alert('Error decoding JWT:', error.message);
          return null;
      }
  }

  useEffect (() => {
    const savedToken = localStorage.getItem("resumeBuilderToken")
    console.log(savedToken)
    if (savedToken) {
      setToken(savedToken)
      const decodedToken = decodeJWT(savedToken)
      setLoggedInUser(decodedToken.id)
    } else {
      setLoggedInUser(null)
    }
  }, [token])

  useEffect(() => {
    if (loggedInUser) {
      displayUser()
    }
    console.log("Logged in User is:", loggedInUser)
  }, [loggedInUser])

  // DEFINING OTHER CONTEXT-FUCTIONS TO FETCH RESUMES AND USERS APIs

  const fetchResumes = async () => {
      try{
          const response = await fetch(`${url}/api/resumes`)
          if (!response.ok) {
              throw new Error("Could not list resumes")
          }
          const jsonresponse = await response.json()
          setallResumes(jsonresponse.data)
      } catch(error) {
          setallResumes([])
          alert(error)
      }
  }

  const displayUser = async () => {
    try {
      const response = await fetch(`${url}/api/users/${loggedInUser}`, {
        method: 'GET',
        headers : {
          "Content-Type" : "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to Display User: `)
      }
      const data = await response.json()
      setLoggedInUserData(data.data)
    } catch(error) {
      setLoggedInUserData(null)
      alert(error.message)
    }
  }

  const listUsers = async () => {
    try {
      const response = await fetch(`${url}/api/users/`, {
        method : "GET",
        headers : {
          "Content-Type" : "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`Failed to list users`)
      }
      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      setUsers([])
      alert(error.message)
    }
  }

  const displayResume = async(resumeID) => {
    try {
      const response = await fetch(`${url}/api/resumes/${resumeID}`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json"
        }
      })
      const data = await response.json()
      setCurrResumeData(data.data)
    } catch (error) {
      setCurrResumeData(null)
      alert(error.message)
    }
  }

  return (
    <div className = "bg-black text-white">
      <Header 
        fetchResumes={fetchResumes}
        showLogin = {showLogin}
        setShowLogin = {setShowLogin}
        token = {token}
        setToken = {setToken}
        loggedInUser = {loggedInUser}
        setLoggedInUser = {setLoggedInUser}
        listUsers = {listUsers}
      />
      
      {showLogin && 
        <Login url = {url} setToken = {setToken} setShowLogin = {setShowLogin}/>
      }

      <Routes>
        <Route path = "/" element = {<Landing />} />
        <Route path = "/myresumes" element = {<MyResumes currResumeData = {currResumeData} setCurrResumeData = {setCurrResumeData} displayResume = {displayResume} fetchResumes = {fetchResumes} allResumes = {allResumes} loggedInUser = {loggedInUser}/>} />
        <Route path = "/listusers" element = {<ListUsers allResumes = {allResumes} setallResumes={setallResumes} fetchResumes={fetchResumes} listUsers = {listUsers} url = {url} users = {users} />} />
      </Routes>

    </div>
  )
}

export default App
