import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import Resume from '../components/Resume.jsx'

function MyResumes ({fetchResumes, currResumeData, setCurrResumeData, displayResume, allResumes, loggedInUser}) {
    
    const [showResume, setShowResume] = useState(false) 

    useEffect(() => {
        fetchResumes()
    }, [])

    const openResume = (resumeID) => {
        displayResume(resumeID)
        setShowResume(true)
    }

    return (
        <div className = "relative pt-24 min-h-screen bg-blue-950 items-center gap-10 flex flex-col">
                
            {showResume ? 
                <Resume currResumeData = {currResumeData} setCurrResumeData = {setCurrResumeData} setShowResume = {setShowResume} showResume = {showResume} />
                :
                <div className = "">
                    <div className = "flex justify-center relative items-center w-3/5">
                        <h1 className = "text-6xl font-extrabold">My Resumes</h1> 
                        {loggedInUser &&
                            <button className = "absolute right-0 h-full"><img className = "size-full" src = "adddoc.svg" /></button>}
                    </div>
                    {allResumes.map((resume) => {
                        const userResume = allResumes.find((element) => element.user_id == loggedInUser)
                        return userResume ? 
                            <div 
                            key ={userResume._id} 
                            className = "p-10 bg-neutral-100/10 w-2/5 flex gap-10 flex-col items-center rounded-2xl">
                                <button 
                                onClick = {() => openResume(userResume._id)}
                                className = "hover:underline text-3xl font-bold">{userResume.name}</button>
                                <div className = "w-full text-center">
                                    <p className = "text-sm">Last Updated:{" "}
                                        {new Date(userResume.updatedAt).toLocaleDateString("en-IN", {
                                            timeZone : "Asia/Kolkata",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                            :
                            (loggedInUser ?
                                <section className = "text-3xl font-bold">You have built no resumes yet!</section>
                                :
                                <section className = "text-3xl font-bold">Login to see or build!</section>
                            )   
                        })
                    }
                </div>
            }
        </div>
    )
}

export default MyResumes