import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'

function Header ({loggedInUser, smallScreen}) {
    const [hamburgerOpen, setHamburgerOpen] = useState(false)

    if (!smallScreen) {
        return (
            <header className = "z-40 fixed right-5 top-3 h-20 lg:w-[540px] md:w-[480px] bg-neutral-200 flex justify-between items-center rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <div className = "flex flex-1">
                    <Link to = "/" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/communityblack.svg" /></Link>
                    <Link to = "/community" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/editdocblack.svg" /></Link>
                    {loggedInUser &&
                        <Link to = "/profile" className = "hover:scale-[0.9] w-1/5 flex justify-center items-center"><img className = "size-3/5" src = "/profileblack.svg" /></Link>
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
                className = {`z-40 ${hamburgerOpen && "z-50"} flex items-center flex-col justify-evenly px-[1%] ${!hamburgerOpen && 'bg-neutral-200 shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]'} rounded-md fixed top-2 right-2 w-[10vh] h-[10vh]`}>
                    {!hamburgerOpen && <div className = {`bg-black w-[8vh] h-[12%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                    <div className = {`${hamburgerOpen && "rotate-45"} bg-black w-[8vh] h-[12%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    <div className = {`${hamburgerOpen && "-rotate-45"} absolute w-[8vh] bg-black h-[12%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.125)]`}></div>
                    {!hamburgerOpen && <div className = {`bg-black w-[8vh] h-[12%] rounded-md shadow-[0_0_2px_1px_rgba(0,0,0,0.25)]`}></div>}
                </button>
            </div>
        )
    }
}

export default Header