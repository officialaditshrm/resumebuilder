import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'

import Community from './pages/Community.jsx'
import MyResumes from './pages/MyResumes.jsx'
import Header from './components/Header.jsx'
import SidePanel from "./components/SidePanel"
import Login from './components/Login.jsx'
import Resume from './pages/Resume.jsx'
import ResumeBegin from './components/ResumeBegin.jsx'
import Footer from './components/Footer.jsx'
import Profile from './pages/Profile.jsx'

const url = 'http://localhost:6500'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [token, setToken] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [currResumeData, setCurrResumeData] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [allResumes, setAllResumes] = useState(null)
  const [smallScreen, setSmallScreen] = useState(false)
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [it, setIt] = useState(false)
  const [resumeBegin, setResumeBegin] = useState(false)
  const [untitledResume, setUntitledResume] = useState(null)
  const footerRef = useRef(null)
  const [footerShow, setFooterShow] = useState(false)
  const [nameAlert, setNameAlert] = useState(null)
  const [pfp, setPfp] = useState(null)
  const [particularUser, setParticularUser] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0){
          setFooterShow(true)
        } else {
          setFooterShow(false)
        }
      }
    )
    observer.observe(footerRef.current)
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSmallScreen(true)
            } else {
                setSmallScreen(false)
                setHamburgerOpen(false)
                setIt(false)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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


  useEffect(() => {
    if (resumeBegin || particularUser || showLogin || it || hamburgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [resumeBegin, showLogin, it, hamburgerOpen, particularUser]);

  useEffect(() => {
    console.log("Logged in user is:", loggedInUser)
  }, [loggedInUser])

  useEffect(() => {
    console.log("token changed to", token)
    if (!token || typeof token !== 'string' || token.trim() === '') {
      setLoggedInUser(null)
      return
    }
    else {
      const id = (decodeJWT(token).id)
      displayLoggedInUser(id)
    }
  }, [token])


  useEffect(() => {
    console.log("local storage token value:", localStorage.getItem("resoluteToken"))
    setToken(localStorage.getItem("resoluteToken") || "")
  }, [])

  const flashNameAlert = () => {
        setTimeout(() => {
            setNameAlert(null)
        }, 5000)
    }

  const buildResume = () => {
        setUntitledResume({
            name : "Untitled " + new Date().toLocaleString(),
            private : false,
            user_id : loggedInUser._id,
            username : loggedInUser.name
        })
        setResumeBegin(true)
    }


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
      fetchResumes()
      } catch(error) {
      console.error(error.message)
      }
  }

  const displayLoggedInUser = async (id) => {
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


  const updateUser = async (id, user) => {
    try {
      const formData = new FormData()

      if (user.profileimg) {
        formData.append("profileimg", user.profileimg)
      }

      if (user.bio) {
        formData.append("bio", user.bio)
      }

      if (user.name) {
        formData.append("name", user.name)
      }

      if (user.email) {
        formData.append("email", user.email)
      }

      if (user.password) {
        formData.append("password", user.password)
      }

      if (user.newPassword) {
        formData.append("newPassword", user.newPassword)
      }

      const response = await fetch(`${url}/api/users/${id}`, {
        method: "PUT",
        body: formData
      })
      if (!response.ok) {
        throw new Error("Could not update user")
      }
      displayLoggedInUser(id)
      const actualresponse = await response.json()
      setNameAlert(actualresponse.message)
      flashNameAlert()
    } catch(error) {
      console.error(error.message)
    }
  }
  
  const fetchpfp = async(filename) => {
    try {
      const response = await fetch(`${url}/pfpimages/${filename}`, {
        method: "GET",
      })
      if (!response.ok) {
        throw new Error("Error Fetching PFP")
      }

      const blob = await response.blob()
      setPfp(URL.createObjectURL(blob))
    } catch(error) {
      setPfp(null)
      console.log(error.message)
    }
  }

  useEffect(() => {
    if ( loggedInUser && loggedInUser.profileimg) {
      fetchpfp(loggedInUser.profileimg)
    }
  }, [loggedInUser])

  return (
    <div>
      <div className = {`${darkMode ? "dark bg-zinc-900 text-white": "bg-zinc-100"} border-black border font-calibri`}>

        <Header 
        smallScreen = {smallScreen} 
        darkMode = {darkMode}
        setHamburgerOpen={setHamburgerOpen}
        hamburgerOpen={hamburgerOpen}
        setDarkMode = {setDarkMode} 
        loggedInUser = {loggedInUser}
        />

        <SidePanel 
          pfp = {pfp}
          darkMode = {darkMode}
          setPfp = {setPfp}
          footerShow = {footerShow}
          buildResume = {buildResume}
          it = {it}
          setIt={setIt}
          token = {token}
          setToken = {setToken}
          smallScreen = {smallScreen}
          setShowLogin = {setShowLogin} 
          loggedInUser = {loggedInUser}
          allResumes = {allResumes}
          setLoggedInUser = {setLoggedInUser}
          setCurrResumeData = {setCurrResumeData}
        />

        {resumeBegin &&
          <ResumeBegin
          darkMode = {darkMode}
          setUntitledResume = {setUntitledResume}
          untitledResume={untitledResume}
          setResumeBegin = {setResumeBegin}
          createResume = {createResume}/>
        }
        
        {showLogin &&
          <Login fetchResumes = {fetchResumes} darkMode = {darkMode} smallScreen = {smallScreen} setLoggedInUser = {setLoggedInUser} url = {url} setShowLogin = {setShowLogin} setToken = {setToken}/>
        }
        <Routes>
          <Route path = "/" element = {
            <MyResumes
            darkMode = {darkMode}
            buildResume = {buildResume} 
            setShowLogin = {setShowLogin} 
            smallScreen = {smallScreen} 
            deleteResume = {deleteResume} 
            currResumeData = {currResumeData} 
            createResume = {createResume} 
            setCurrResumeData = {setCurrResumeData} 
            loggedInUser = {loggedInUser} 
            allResumes={allResumes} 
            fetchResumes = {fetchResumes}
            />
          } />
          <Route path = "/resume" element = {
            <Resume 
            darkMode = {darkMode}
            smallScreen = {smallScreen} 
            fetchResumes = {fetchResumes} 
            updateResume = {updateResume} 
            deleteResume={deleteResume} 
            loggedInUser={loggedInUser} 
            currResumeData = {currResumeData} 
            setCurrResumeData = {setCurrResumeData}
            />
          } />
          <Route path = "/profile" element = {
            <Profile
            setToken = {setToken}
            darkMode = {darkMode}
            setPfp = {setPfp}
            displayLoggedInUser = {displayLoggedInUser}
            url = {url}
            setShowLogin = {setShowLogin}
            nameAlert={nameAlert}
            flashNameAlert={flashNameAlert}
            setNameAlert={setNameAlert}
            setLoggedInUser = {setLoggedInUser}
            updateUser={updateUser}
            smallScreen = {smallScreen} 
            fetchResumes = {fetchResumes}
            loggedInUser={loggedInUser}
            pfp = {pfp}
            />
          } />
          <Route path = "/community" element = {
            <Community
            darkMode = {darkMode}
            particularUser = {particularUser}
            setParticularUser = {setParticularUser}
            currResumeData = {currResumeData}
            setCurrResumeData = {setCurrResumeData}
            loggedInUser = {loggedInUser}
            fetchResumes = {fetchResumes}
            allResumes = {allResumes}
            url = {url}
            />
          } />
          
        </Routes>
        <div ref = {footerRef}>
          <Footer />
        </div>
      </div>
      
    </div>
  )
}

export default App
