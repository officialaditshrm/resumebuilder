import { Link } from 'react-router-dom'

function Header ({setDarkMode, darkMode, loggedInUser, smallScreen, hamburgerOpen, setHamburgerOpen}) {

    if (!smallScreen) {
        return (
            <header className = "z-40 fixed right-5 top-3 h-20 lg:w-[540px] md:w-[480px] dark:bg-zinc-800 bg-neutral-200 flex justify-between items-center rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <div className = "flex flex-1">
                    <Link title='My Resumes' to = "/" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/editdoc.svg" : "/editdocblack.svg"} /></Link>
                    <Link title = "Community" to = "/community" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/community.svg" : "/communityblack.svg"} /></Link>
                    {loggedInUser &&
                        <Link title = "Profile" to = "/profile" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = {darkMode? "/profile.svg" : "/profileblack.svg"} /></Link>
                    }
                </div>
                <div className = "border-l border-black/25 dark:border-white/25 h-full w-1/4 flex items-center justify-center">
                    <button
                    onClick = {() => {setDarkMode(!darkMode)}}
                    className = "text-sm hover:font-bold">
                        {darkMode ?
                            "DARKMODE"
                            :
                            "LIGHTMODE"
                        }
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
                        <nav className = "flex flex-col justify-evenly items-center font-bold text-xl h-full">
                            <Link to = "/" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">MY RESUMES</Link>
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