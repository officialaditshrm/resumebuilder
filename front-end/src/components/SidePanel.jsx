import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function SidePanel ({footerShow, pfp, buildResume, it, setIt, smallScreen, setToken, token, setShowLogin, loggedInUser, allResumes, setLoggedInUser, setCurrResumeData})  {
    const navigate = useNavigate()
    

    if ((!smallScreen && !footerShow) || !loggedInUser) {
        return (
            <div className = {`z-40 fixed md:w-100 p-5 gap-5 md:left-0 text-sm flex flex-col top-0 justify-between h-screen`}>
                {loggedInUser && <div className = "relative rounded-xl bg-neutral-200 flex flex-col p-6 gap-4 items-center shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                    <button
                    onClick={() => navigate("/profile")}
                    className = "rounded-full bg-violet-300 flex items-center justify-center w-[50px] h-[50px]" >
                        {pfp ?
                            <img src = {pfp} className = "object-cover rounded-full h-full w-full" />
                            :
                            <img src = "/profileblack.svg" className = "rounded-full object-cover w-[30px] h-[30px]"/>
                        }
                    </button>
                    <h1 className = "font-semibold text-xl">{loggedInUser.name.toUpperCase()}</h1>
                </div>}
                {loggedInUser && <div className = "flex-1 max-h-[45%] relative rounded-xl bg-neutral-200 flex flex-col p-3 gap-2  shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                    <h1 className = "text-neutral-500">Resumes</h1>
                    <ul className = "flex flex-col text-xs font-bold gap-3 overflow-y-auto px-2 h-4/5 hide-scrollbar">
                        {allResumes && 
                        allResumes
                        .filter(resume => resume.user_id === loggedInUser._id)
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .map((resume, index) => (
                            <Link onClick = {() => setCurrResumeData(resume)} key={index} to="/resume">{resume.name}</Link>
                        ))}
                    </ul>
                    <button
                    onClick = {() => buildResume()}
                    className = "absolute right-6">
                        <img src = "/editblack.svg" />
                    </button>
                    <div className = "w-full flex text-sm font-semibold justify-center">
                        <button
                        onClick = {() => navigate("/")}
                        className = "px-3 py-2 rounded-md text-white bg-neutral-700">
                            VIEW ALL
                        </button>
                    </div>
                </div>}
                <div className = "relative rounded-xl font-semibold bg-neutral-200 flex text-sm flex-col p-6 gap-4 items-center  shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                    {loggedInUser ?
                        <button
                        onClick = {() => {setLoggedInUser(null); localStorage.removeItem("resoluteToken"); setToken("");}}
                        className = "px-3 py-2 rounded-md text-white bg-red-900 flex items-center gap-1"><img src = "/logout.svg" />LOGOUT</button>
                        :
                        <button 
                        onClick = {() => setShowLogin(true)}
                        className = "px-3 py-2 rounded-md text-white bg-blue-900 flex items-center gap-1"><img src = "/login.svg" />LOGIN</button>
                    }
                </div> 
            </div>
        )
    } else {
        return (
            <div>
                {it &&
                    <div className = "z-50 fixed w-screen gap-5 md:left-0 text-sm flex flex-col items-center top-0 justify-evenly backdrop-blur bg-neutral-100/30 backdrop-blur h-screen">
                    {loggedInUser && <div className = "relative rounded-xl bg-neutral-200 flex flex-col p-6 gap-4 items-center shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                        <button
                        onClick = {() => {navigate('/profile'); setIt(false)}}
                        className = "rounded-full bg-violet-300 w-[50px] h-[50px]" >
                            {pfp ?
                            <img src = {pfp} className = "object-cover rounded-full h-full w-full" />
                            :
                            <img src = "/profileblack.svg" className = "rounded-full object-cover w-[30px] h-[30px]"/>
                        }
                        </button>
                        <h1 className = "font-semibold text-xl">{loggedInUser.name.toUpperCase()}</h1>
                        <button
                        onClick = {() => setIt(false)}
                        className = "absolute w-[10vh] h-[10vh] left-0 top-0 flex flex-col justify-center items-center">
                            <div className = {`${it && '-rotate-45'} h-[5%] w-[4vh] bg-neutral-500 rounded-md`}></div>
                            <div className = {`${it && 'rotate-45'} absolute h-[5%] w-[4vh] bg-neutral-500 rounded-md`}></div>
                        </button>
                    </div>}
                    {loggedInUser && <div className = "flex-1 max-h-[45%] relative rounded-xl bg-neutral-200 flex flex-col p-3 gap-2  shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                        <h1 className = "text-neutral-500">Resumes</h1>
                        <ul className = "flex flex-col text-xs font-bold gap-3 overflow-y-auto px-2 h-4/5 hide-scrollbar">
                            {allResumes && 
                            allResumes
                            .filter(resume => resume.user_id === loggedInUser._id)
                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                            .map((resume, index) => (
                                <Link onClick = {() => {setCurrResumeData(resume); setIt(false)}} key={index} to="/resume">{resume.name}</Link>
                            ))}
                        </ul>
                        <button
                        onClick = {() => {buildResume(); setIt(false)}}
                        className = "absolute right-6">
                            <img src = "/editblack.svg" />
                        </button>
                        <div className = "w-full flex text-sm font-semibold justify-center">
                            <button
                            onClick = {() => {navigate("/"); setIt(false)}}
                            className = "px-3 py-2 rounded-md text-white bg-neutral-700">
                                VIEW ALL
                            </button>
                        </div>
                    </div>}
                    <div className = "relative rounded-xl font-semibold bg-neutral-200 flex text-sm flex-col p-6 gap-4 items-center  shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                        {!loggedInUser && 
                            <button
                            onClick = {() => setIt(false)}
                            className = "absolute w-[10vh] h-[10vh] left-0 top-0 flex flex-col justify-center items-center">
                                <div className = {`${it && '-rotate-45'} h-[5%] w-[4vh] bg-neutral-500 rounded-md`}></div>
                                <div className = {`${it && 'rotate-45'} absolute h-[5%] w-[4vh] bg-neutral-500 rounded-md`}></div>
                            </button>
                        }
                        {loggedInUser ?
                            <button
                            onClick = {() => {setLoggedInUser(null); localStorage.removeItem("resoluteToken"); setToken(""); setIt(false)}}
                            className = "px-3 py-2 rounded-md text-white bg-red-900 flex items-center gap-1"><img src = "/logout.svg" />LOGOUT</button>
                            :
                            <button 
                            onClick = {() => {setShowLogin(true); setIt(false)}}
                            className = "px-3 py-2 mt-8 rounded-md text-white bg-blue-900 flex items-center gap-1"><img src = "/login.svg" />LOGIN</button>
                        }
                    </div> 
                </div>}
                <button
                onClick = {() => {setIt(true)}}
                className = {`bg-violet-300  shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] fixed z-30 top-2 left-2 h-[8vh] w-[8vh] rounded-full`}>
                    {pfp ?
                        <img src = {pfp} className = "object-cover rounded-full h-full w-full" />
                        :
                        <img src = "/profileblack.svg" className = "rounded-full object-cover w-[30px] h-[30px]"/>
                    }
                </button>
            </div>
        )
    }
}