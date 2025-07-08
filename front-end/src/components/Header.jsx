import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header ({setDarkMode, darkMode, loggedInUser, smallScreen, hamburgerOpen, setHamburgerOpen}) {
    const navigate = useNavigate()

    const [showFeedback, setShowFeedback] = useState(false)

    if (!smallScreen) {
        return (
            <header className = "z-40 fixed right-5 top-3 h-20 lg:w-[540px] md:w-[480px] dark:bg-zinc-800 bg-neutral-200 flex justify-between items-center rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <img onClick = {() => navigate('/')} src = {darkMode ? "/logotransparentdark.png": "/logotransparent.png"} className = "cursor-pointer object-contain w-[20%] p-4"/>
                <div className = "flex relative flex-1 justify-evenly overflow-hidden">
                    <Link title='My Resumes' to = "/myresumes" className = "hover:scale-[0.9] w-1/4 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/editdoc.svg" : "/editdocblack.svg"} /></Link>
                    <Link title = "Community" to = "/community" className = "hover:scale-[0.9] w-1/4 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/community.svg" : "/communityblack.svg"} /></Link>
                    {loggedInUser &&
                        <Link title = "Profile" to = "/profile" className = "hover:scale-[0.9] w-1/4 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/profile.svg" : "/profileblack.svg"} /></Link>
                    }
                    
                </div>
                
                <div className = "border-l border-black/25 dark:border-white/25 h-full w-1/4 flex items-center justify-center">
                    <button
                    onClick = {() => {setDarkMode(!darkMode)}}
                    className = "relative text-sm w-[12vh] h-[6vh]">
                        <div className = "h-[1.5vh] flex items-center left-0 w-full bg-zinc-400 rounded-md shadow-[0_3px_5px_1px_rgba(0,0,0,0.25)]"></div>
                        <div className = {`${darkMode && "translate-x-[6vh]"} h-[5vh] w-[5vh] border border-black/20 flex items-center justify-center absolute bg-zinc-300 left-[0.5vh] top-[0.5vh] shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] rounded-full`}>
                            <img className = "object-cover w-[70%]" src = {darkMode ? "darkblack.svg" : "lightblack.svg"} />
                        </div>
                    </button>
                </div>
            </header>
        )
    } else {
        return (
            <div>
                <button 
                onClick={() => {setHamburgerOpen(!hamburgerOpen)}}
                className = {`z-40 ${hamburgerOpen && "z-50"} flex items-center flex-col justify-evenly px-[1%] ${!hamburgerOpen && 'bg-zinc-200 dark:bg-zinc-800 shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]'} rounded-md fixed top-2 right-2 w-[8vh] h-[8vh]`}>
                    {!hamburgerOpen && <div className = {`bg-zinc-900 dark:bg-zinc-100 w-[6vh] h-[8%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                    <div className = {`${hamburgerOpen ? "rotate-45 w-[6vh] bg-zinc-600" : "w-[6vh] bg-zinc-900 dark:bg-zinc-100"} rounded-md h-[8%] shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    <div className = {`${hamburgerOpen ? "-rotate-45 w-[6vh] bg-zinc-600" : "w-[6vh] bg-zinc-900 dark:bg-zinc-100"} h-[8%] absolute rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    {!hamburgerOpen && <div className = {`bg-zinc-900 dark:bg-zinc-100 w-[6vh] h-[8%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                </button>
                {hamburgerOpen &&
                    <div className = "pt-[10vh] z-40 bg-zinc-100/50 dark:bg-zinc-950/50 backdrop-blur fixed h-screen w-screen top-0 left-0 z-40 background">
                        <div className = "dark:border-white/25 absolute top-4 left-2 flex items-center justify-center">
                            <button
                            onClick = {() => {setDarkMode(!darkMode)}}
                            className = "relative text-sm w-[12vh] h-[6vh]">
                                <div className = "h-[1.5vh] flex items-center left-0 w-full bg-zinc-400 rounded-md shadow-[0_3px_5px_1px_rgba(0,0,0,0.25)]"></div>
                                <div className = {`${darkMode && "translate-x-[6vh]"} h-[5vh] w-[5vh] border border-black/20 flex items-center justify-center absolute bg-zinc-300 left-[0.5vh] top-[0.5vh] shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] rounded-full`}>
                                    <img className = "object-cover w-[70%]" src = {darkMode ? "darkblack.svg" : "lightblack.svg"} />
                                </div>
                            </button>
                        </div>
                        <nav className = "flex flex-col justify-evenly items-center font-bold text-xl h-full">
                            <Link to = "/" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">HOME</Link>
                            <Link to = "/myresumes" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">MY RESUMES</Link>
                            <Link to = "/community" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">COMMUNITY</Link>
                            {loggedInUser &&
                                <Link to = "/profile" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">PROFILE</Link>
                            }
                            
                        </nav>
                    </div>
                }
            </div>
        )
    }
}

export default Header