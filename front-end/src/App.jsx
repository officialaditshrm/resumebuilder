import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Community from './pages/Community.jsx'
import EditResume from './pages/EditResume.jsx'
import MyResumes from './pages/MyResumes.jsx'
import Header from './components/Header.jsx'
import SidePanel from "./components/SidePanel"
import Login from './components/Login.jsx'
import Resume from './pages/Resume.jsx'
import ResumeBegin from './components/ResumeBegin.jsx'
import Footer from './components/Footer.jsx'
import Profile from './pages/Profile.jsx'
import Landing from './pages/Landing.jsx'

const url = 'https://resumebuilder-15o2.onrender.com'
// const url = "http://localhost:6500"

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('resoluteTheme') === 'dark' } catch { return false }
  })
  const [token, setToken] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [currResumeData, setCurrResumeData] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginMode, setLoginMode] = useState('login')
  const [allResumes, setAllResumes] = useState(null)
  const [smallScreen, setSmallScreen] = useState(false)
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const [resumeBegin, setResumeBegin] = useState(false)
  const [untitledResume, setUntitledResume] = useState(null)
  const [nameAlert, setNameAlert] = useState(null)
  const [pfp, setPfp] = useState(null)
  const [particularUser, setParticularUser] = useState(false)
  const [resumeToEdit, setResumeToEdit] = useState(false)
  const [jobDescription, setJobDescription] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const navigate = useNavigate()
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [allUsers, setAllUsers] = useState(null)
  // Number of create / update / delete requests still running. While it's above zero,
  // navigation is paused so a request isn't cut off halfway by a page change.
  const [busy, setBusy] = useState(0)
  const resumesFetch = useRef(null)
  const resumesAgain = useRef(false)
  const resumeUpdates = useRef({})
  const resumeDeletes = useRef({})
  const resumeCreate = useRef(null)

  const track = async (work) => {
    setBusy((n) => n + 1)
    try { return await work() } finally { setBusy((n) => n - 1) }
  }

  // Warn before closing or reloading the tab while something is still being saved.
  useEffect(() => {
    if (!busy) return
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [busy])

  // Remember an explicit theme choice and keep the page edges (overscroll, notch areas) in step.
  useEffect(() => {
    try { localStorage.setItem('resoluteTheme', darkMode ? 'dark' : 'light') } catch { /* private mode */ }
    const bg = darkMode ? '#18181B' : '#F4F4F5'
    document.documentElement.style.backgroundColor = bg
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
  }, [darkMode])

  // A closed login dialog always reopens on the log-in form.
  useEffect(() => {
    if (!showLogin) setLoginMode('login')
  }, [showLogin])

  const openLogin = (mode = 'login') => {
    setLoginMode(mode)
    setShowLogin(true)
  }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSmallScreen(true)
            } else {
                setSmallScreen(false)
                setHamburgerOpen(false)
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
    if (resumeBegin || particularUser || showLogin || (hamburgerOpen && smallScreen)) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [resumeBegin, showLogin, hamburgerOpen, particularUser, smallScreen]);

  useEffect(() => {
    console.log("Logged in user is:", loggedInUser)
  }, [loggedInUser])

  useEffect(() => {
    console.log("token changed to", token)
    if (!token ||  typeof token !== 'string' || token === '' ) {
      setLoggedInUser(null)
      return
    }
    else {
      try {
        const id = (decodeJWT(token).id)
        displayLoggedInUser(id)
      } catch (error) {
        localStorage.removeItem("resoluteToken")
        setToken("")
        console.log(error)
      }
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
        if (loggedInUser) {
          setUntitledResume({
            name : "Untitled " + new Date().toLocaleString(),
            private : false,
            user_id : loggedInUser._id,
            username : loggedInUser.name
        })
        setResumeBegin(true)}
    }

  const copyResume = (refResume) => {
    if (loggedInUser) {
      const newCopy = {...refResume, name: refResume.name + "_Copy", user_id: loggedInUser._id, username : loggedInUser.name}
      delete newCopy._id
      delete newCopy.createdAt
      delete newCopy.updatedAt
      setUntitledResume(newCopy)
      setResumeBegin(true)
    }
  }


  const fetchResumes = () => {
    if (resumesFetch.current) { resumesAgain.current = true; return resumesFetch.current }
    const run = async () => {
      do { resumesAgain.current = false; await loadResumes() } while (resumesAgain.current)
    }
    resumesFetch.current = run().finally(() => { resumesFetch.current = null })
    return resumesFetch.current
  }

  const loadResumes = async () => {
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

  const createResume = (newResume) => {
    if (resumeCreate.current) return resumeCreate.current
    resumeCreate.current = track(() => postResume(newResume)).finally(() => { resumeCreate.current = null })
    return resumeCreate.current
  }

  const postResume = async (newResume) => {
    try {
      const response = await fetch(`${url}/api/resumes/`, {
          method: "POST",
          headers: {
          "Content-Type" : "application/json"
          },
          body: JSON.stringify(newResume)
      })
      const data = await response.json(); // <-- read JSON from backend

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not create new resume");
      }

      console.log(data.message); // log success message
      await fetchResumes();
      return true
    } catch (error) {
      console.error("Error creating resume:", error.message);
      return false
    }
  };


  const updateResume = (id, newResume) => {
    const run = () => putResume(id, newResume)
    const previous = resumeUpdates.current[id] || Promise.resolve()
    const next = previous.then(run, run)
    resumeUpdates.current[id] = next
    return track(() => next)
  }

  const putResume = async (id, newResume) => {
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
      return true
      } catch(error) {
      console.error(error.message)
      return false
      }
  }

  const deleteResume = (id) => {
    if (resumeDeletes.current[id]) return resumeDeletes.current[id]
    resumeDeletes.current[id] = track(() => removeResume(id)).finally(() => { delete resumeDeletes.current[id] })
    return resumeDeletes.current[id]
  }

  const removeResume = async (id) => {
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
      await fetchResumes()
      return true
      } catch(error) {
      console.error(error.message)
      return false
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
      if (!actualresponse.data) {
        // The account behind this token no longer exists; sign out instead of waiting forever.
        localStorage.removeItem("resoluteToken")
        setToken("")
      }
    } catch(error) {
      console.error(error.message)
      setLoggedInUser(null)
    }
  }

  const fetchUsers = async () => {
        try {
            const response = await fetch(`${url}/api/users`)
            if (!response.ok) {
            throw new Error("Could not fetch users")
            }
            const actualresponse = await response.json()
            const usersWithSrc = actualresponse.data?.map(user => ({
            ...user,
            profilesrc: user.profileimg || null // <- ensures all users have a profilesrc field, even if null
            }))
            setAllUsers(usersWithSrc) //  all users included
        } catch (error) {
            console.error(error.message)
        }}

  const updateUser = (id, formData) => track(() => putUser(id, formData))

  const putUser = async (id, formData) => {
    try {

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
      return actualresponse.success !== false
    } catch(error) {
      console.error(error.message)
      setNameAlert("Couldn't reach the server. Check your connection and try again.")
      flashNameAlert()
      return false
    }
  }

  const aiRunning = useRef(false)
  const handleAIAnalysis = async (resumetoreview) => {
      if (aiRunning.current) return;   // one analysis at a time
      aiRunning.current = true;
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);
      try {
          const res = await fetch(`${url}/api/analyze-resume`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ resumeData: resumetoreview, jobDescription }),
          });
          const data = await res.json();
          if (res.ok) {
              setAiResult(data);
          } else {
              setAiError(data.error || 'Analysis failed');
          }
      } catch (err) {
          setAiError('Network error');
      }
      setAiLoading(false);
      aiRunning.current = false;
  };
  
  const fetchpfp = (profileimgURL) => {
  if (profileimgURL) {
    setPfp(profileimgURL)
  } else {
    setPfp(null)
  }
}

  useEffect(() => {
    if ( loggedInUser && loggedInUser.profileimg) {
      fetchpfp(loggedInUser.profileimg)
    }
  }, [loggedInUser])

  const signingIn = Boolean(token) && !loggedInUser

  return (
    <div>
      <div className = {`${darkMode ? "dark bg-zinc-900 text-white": "bg-zinc-100"} font-[courier] border border-transparent [--tw-border-opacity:1]`}>
        {(signingIn || busy > 0) &&
          <div role="progressbar" aria-label={signingIn ? "Signing you in" : "Saving"} className="ui fixed top-0 inset-x-0 z-[60] h-[3px] overflow-hidden bg-ink/10">
            <div className="ui-progress h-full w-2/5 bg-ink" />
          </div>
        }
        <Header 
        smallScreen = {smallScreen} 
        darkMode = {darkMode}
        setHamburgerOpen={setHamburgerOpen}
        hamburgerOpen={hamburgerOpen}
        loggedInUser = {loggedInUser}
        pfp = {pfp}
        signingIn = {signingIn}
        openLogin = {openLogin}
        busy = {busy > 0}
        />
        <div aria-hidden="true" className="h-14 md:hidden" />

        <SidePanel 
          pfp = {pfp}
          darkMode = {darkMode}
          setDarkMode = {setDarkMode}
          setPfp = {setPfp}
          buildResume = {buildResume}
          hamburgerOpen = {hamburgerOpen}
          setHamburgerOpen = {setHamburgerOpen}
          token = {token}
          setToken = {setToken}
          signingIn = {signingIn}
          smallScreen = {smallScreen}
          openLogin = {openLogin}
          loggedInUser = {loggedInUser}
          allResumes = {allResumes}
          setLoggedInUser = {setLoggedInUser}
          setCurrResumeData = {setCurrResumeData}
          busy = {busy > 0}
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
          <Login
          fetchResumes = {fetchResumes}
          setLoggedInUser = {setLoggedInUser}
          url = {url}
          setShowLogin = {setShowLogin}
          setToken = {setToken}
          mode = {loginMode}
          setMode = {setLoginMode}
          />
        }
        <Routes>

          <Route path = "/" element = {
            <Landing
            darkMode = {darkMode}
            fetchUsers = {fetchUsers}
            allResumes={allResumes}
            allUsers={allUsers}
            loggedInUser={loggedInUser}
            buildResume = {buildResume}
            openLogin = {openLogin}
            setCurrResumeData = {setCurrResumeData}
            signingIn = {signingIn}
            />
          } />
          <Route path = "/myresumes" element = {
            <MyResumes
            darkMode = {darkMode}
            buildResume = {buildResume} 
            setShowLogin = {setShowLogin} 
            openLogin = {openLogin}
            signingIn = {signingIn}
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
            url = {url}
            setShowAllSuggestions={setShowAllSuggestions}
            showAllSuggestions = {showAllSuggestions}
            setJobDescription = {setJobDescription}
            aiError = {aiError}
            aiLoading = {aiLoading}
            aiResult = {aiResult}
            setAiResult = {setAiResult}
            jobDescription = {jobDescription}
            copyResume = {copyResume}
            handleAIAnalysis = {handleAIAnalysis}
            darkMode = {darkMode}
            smallScreen = {smallScreen} 
            fetchResumes = {fetchResumes} 
            updateResume = {updateResume} 
            deleteResume={deleteResume} 
            loggedInUser={loggedInUser} 
            currResumeData = {currResumeData} 
            setCurrResumeData = {setCurrResumeData}
            openLogin = {openLogin}
            signingIn = {signingIn}
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
            openLogin = {openLogin}
            signingIn = {signingIn}
            nameAlert={nameAlert}
            flashNameAlert={flashNameAlert}
            setNameAlert={setNameAlert}
            setLoggedInUser = {setLoggedInUser}
            setCurrResumeData = {setCurrResumeData}
            updateUser={updateUser}
            smallScreen = {smallScreen} 
            fetchResumes = {fetchResumes}
            loggedInUser={loggedInUser}
            pfp = {pfp}
            />
          } />
          <Route path = "/community" element = {
            <Community
            allUsers = {allUsers}
            setAllUsers = {setAllUsers}
            fetchUsers={fetchUsers}
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
          <Route path =  "/editresume" element = {
            <EditResume
            url = {url}
            setShowAllSuggestions={setShowAllSuggestions}
            showAllSuggestions = {showAllSuggestions}
            setJobDescription = {setJobDescription}
            aiError = {aiError}
            aiLoading = {aiLoading}
            aiResult = {aiResult}
            setAiResult = {setAiResult}
            jobDescription = {jobDescription}
            handleAIAnalysis = {handleAIAnalysis}
            updateResume={updateResume}
            setCurrResumeData = {setCurrResumeData}
            currResumeData = {currResumeData}
            darkMode = {darkMode}
            />
          } />
          
        </Routes>
        <Footer />
      </div>
      
    </div>
  )
}

export default App
