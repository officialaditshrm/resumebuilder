import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function SidePanel ({setShowLogin, loggedInUser, allResumes, setLoggedInUser, setCurrResumeData})  {
    const navigate = useNavigate()
    return (
        <div className = {`z-40 fixed md:w-100 p-5 gap-5 md:left-0 text-sm flex flex-col md:top-0 justify-between h-screen`}>
            {loggedInUser && <div className = "relative rounded-xl bg-neutral-200 flex flex-col p-6 gap-4 items-center shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <div className = "rounded-full bg-violet-300 w-[50px] h-[50px]" >
                </div>
                <h1 className = "font-semibold text-xl">{loggedInUser.name.toUpperCase()}</h1>
            </div>}
            {loggedInUser && <div className = "flex-1 max-h-[45%] relative rounded-xl bg-neutral-200 flex flex-col p-3 gap-2  shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <h1 className = "text-neutral-500">Resumes</h1>
                <ul className = "flex flex-col text-xs font-bold gap-3 overflow-y-auto px-2 h-4/5 hide-scrollbar">
                    {allResumes && 
                    allResumes
                    .filter(resume => resume.user_id === loggedInUser._id)
                    .map((resume, index) => (
                        <Link onClick = {() => setCurrResumeData(resume)} key={index} to="/resume">{resume.name}</Link>
                    ))}
                </ul>
                <button className = "absolute right-6"><img src = "/editblack.svg" /></button>
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
                    onClick = {() => {setLoggedInUser(null); localStorage.removeItem("resoluteToken")}}
                    className = "px-3 py-2 rounded-md text-white bg-red-900 flex items-center gap-1"><img src = "/logout.svg" />LOGOUT</button>
                    :
                    <button 
                    onClick = {() => setShowLogin(true)}
                    className = "px-3 py-2 rounded-md text-white bg-blue-900 flex items-center gap-1"><img src = "/login.svg" />LOGIN</button>
                }
            </div> 
        </div>
    )
}