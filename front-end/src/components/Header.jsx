import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'

function Header ({loggedInUser, smallScreen, hamburgerOpen, setHamburgerOpen}) {
    


    if (!smallScreen) {
        return (
            <header className = "z-40 fixed right-5 top-3 h-20 lg:w-[540px] md:w-[480px] bg-neutral-200 flex justify-between items-center rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <div className = "flex flex-1">
                    <Link title='My Resumes' to = "/" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/editdocblack.svg" /></Link>
                    <Link title = "Community" to = "/community" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/communityblack.svg" /></Link>
                    {loggedInUser &&
                        <Link title = "Profile" to = "/profile" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/profileblack.svg" /></Link>
                    }
                </div>
                <div className = "border-l border-black/25 h-full w-1/4 flex items-center justify-center">
                    <button className = "hover:font-bold">
                        DARKMODE
                    </button>
                </div>
            </header>
        )
    } else {
        return (
            <div>
                <button 
                onClick={() => {setHamburgerOpen(!hamburgerOpen)}}
                className = {`z-40 ${hamburgerOpen && "z-50"} flex items-center flex-col justify-evenly px-[1%] ${!hamburgerOpen && 'bg-neutral-200 shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]'} rounded-md fixed top-2 right-2 w-[8vh] h-[8vh]`}>
                    {!hamburgerOpen && <div className = {`bg-neutral-900 w-[6vh] h-[8%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                    <div className = {`${hamburgerOpen ? "rotate-45 w-[6vh] bg-neutral-600" : "w-[6vh] bg-neutral-900"} rounded-md h-[8%] shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    <div className = {`${hamburgerOpen ? "-rotate-45 w-[6vh] bg-neutral-600" : "w-[6vh] bg-neutral-900"} h-[8%] absolute rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    {!hamburgerOpen && <div className = {`bg-neutral-900 w-[6vh] h-[8%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                </button>
                {hamburgerOpen &&
                    <div className = "pt-[10vh] bg-neutral-100/50 backdrop-blur fixed h-screen w-screen top-0 left-0 z-40 background">
                        <nav className = "flex flex-col justify-evenly items-center font-bold text-xl h-full">
                            <Link to = "/" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">MY RESUMES</Link>
                            <Link to = "/community" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">COMMUNITY</Link>
                            <Link to = "/explore" onClick = {() => setHamburgerOpen(false)} className = "hover:scale-[0.9]">EXPLORE</Link>
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