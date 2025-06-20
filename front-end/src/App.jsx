import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import MyResumes from './pages/MyResumes.jsx'
import Header from './components/Header.jsx'
import SidePanel from "./components/SidePanel"
import Login from './components/Login.jsx'
import Resume from './pages/Resume.jsx'

const url = 'http://localhost:6500'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('resoluteToken') || "")
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [currResumeData, setCurrResumeData] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [allResumes, setAllResumes] = useState(null)
  const [allUsers, setAllUsers] = useState(null)

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
          console.log('Error decoding JWT:', error.message);
          return null;
      }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  useEffect (() => {
    console.log("All Resumes are:", allResumes)
  }, [allResumes])
  

  useEffect(() => {
    console.log("Logged in user is:", loggedInUser)
  }, [loggedInUser])

  useEffect(() => {
    console.log("token is", token)
    if (!token || typeof token !== 'string' || token.trim() === '')
      return;
    else {
      const id = (decodeJWT(token).id)
      displayUsers(id)
    }
  }, [token])


  const fetchResumes = async () => {
    try {
      const response = await fetch(`${url}/api/resumes`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json"
        }
      })
      if (!response.ok) {
        throw new Error("Could not fetch resumes")
      }
      const actualresponse = await response.json()
      setAllResumes(actualresponse.data)
    } catch(error) {
      setAllResumes(null)
      console.error(error.message)
    }
  }

  const createResume = async (newResume) => {
      try {
      const response = await fetch(`${url}/api/resumes/`, {
          method: "POST",
          headers: {
          "Content-Type" : "application/json"
          },
          body: JSON.stringify(newResume)
      })
      if (!response.ok) {
          throw new Error("Could not create new resume")
      }
      const actualresponse = await response.json()
      console.log(actualresponse.message)
      fetchResumes()
    } catch(error) {
      console.error(error.message)
    }
  }


  const updateResume = async (id, newResume) => {
      try {
      const response = await fetch(`${url}/api/resumes/${id}`, {
          method: "PUT",
          headers: {
          "Content-Type" : "application/json"
          },
          body: JSON.stringify(newResume)
      })
      if (!response.ok) {
          throw new Error("Could not update resume")
      }
      const actualresponse = await response.json()
      console.log(actualresponse.message)
      fetchResumes()
      } catch(error) {
      console.error(error.message)
      }
  }

  const deleteResume = async (id) => {
      try {
      const response = await fetch(`${url}/api/resumes/${id}`, {
          method: "DELETE",
          headers: {
          "Content-Type" : "application/json"
          }
      })
      if (!response.ok) {
          throw new Error("Could not delete resume")
      }
      const actualresponse = await response.json()
      console.log(actualresponse.message)
      fetchResumes()
      } catch(error) {
      console.error(error.message)
      }
  }




  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json"
        }
      })
      if (!response.ok) {
        throw new Error("Could not fetch users")
      }
      const actualresponse = await response.json()
      setAllUsers(actualresponse.data)
    } catch(error) {
      setAllResumes(null)
      console.error(error.message)
    }
  }

  const displayUsers = async (id) => {
    try {
      const response = await fetch(`${url}/api/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json"
        }
      })
      if (!response.ok) {
        throw new Error("Could not display user")
      }
      const actualresponse = await response.json()
      setLoggedInUser(actualresponse.data)
    } catch(error) {
      console.error(error.message)
      setLoggedInUser(null)
    }
  }


  return (
    <div className = {`${darkMode ? "bg-black text-white": "bg-white"} min-h-screen font-calibri`}>
      <Header darkMode = {darkMode} setDarkMode = {setDarkMode} loggedInUser = {loggedInUser}/>
      <SidePanel 
        setShowLogin = {setShowLogin} 
        loggedInUser = {loggedInUser}
        allResumes = {allResumes}
        setLoggedInUser = {setLoggedInUser}
        setCurrResumeData = {setCurrResumeData}
      />
      
      {showLogin &&
        <Login setLoggedInUser = {setLoggedInUser} url = {url} setShowLogin = {setShowLogin} setToken = {setToken}/>
      }
      <Routes>

        <Route path = "/resume" element = {<Resume fetchResumes = {fetchResumes} updateResume = {updateResume} deleteResume={deleteResume} loggedInUser={loggedInUser} currResumeData = {currResumeData} setCurrResumeData = {setCurrResumeData}/>} />
        <Route path = "/" element = {<MyResumes deleteResume = {deleteResume} currResumeData = {currResumeData} createResume = {createResume} setCurrResumeData = {setCurrResumeData} loggedInUser = {loggedInUser} allResumes={allResumes} fetchResumes = {fetchResumes}/>} />
      </Routes>
    </div>
  )
}

export default App
