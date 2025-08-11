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

// const url = 'https://resumebuilder-15o2.onrender.com'
const url = "http://localhost:6500"

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
  const [resumeToEdit, setResumeToEdit] = useState(false)
  const [jobDescription, setJobDescription] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const navigate = useNavigate()
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [allUsers, setAllUsers] = useState(null)

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

  const updateUser = async (id, formData) => {
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
    } catch(error) {
      console.error(error.message)
    }
  }

  const handleAIAnalysis = async (resumetoreview) => {
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

  return (
    <div>
      <div className = {`${darkMode ? "dark bg-zinc-900 text-white": "bg-zinc-100"} font-[courier] border-black border font-calibri`}>
        {smallScreen && <div className = {`w-full flex ${!loggedInUser ? "h-36": "h-10"} justify-center items-end`}><img onClick = {() => navigate('/')} src = {darkMode ? "/logotransparentdark.png": "/logotransparent.png"} className = "w-[80px] cursor-pointer"/></div>}
        {(token ) && !loggedInUser && <div className = {`w-full flex h-48 justify-center items-end text-2xl font-extrabold text-red-700`}>Token Found...<br/> Logging you in</div>}
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
            <Landing
            darkMode = {darkMode}
            fetchUsers = {fetchUsers}
            allResumes={allResumes}
            allUsers={allUsers}
            loggedInUser={loggedInUser}
            />
          } />
          <Route path = "/myresumes" element = {
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
        <div ref = {footerRef}>
          <Footer />
        </div>
      </div>
      
    </div>
  )
}

export default App
