import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

import Resume from '../components/Resume.jsx'

function MyResumes ({postResume, updateResume, fetchResumes, currResumeData, setCurrResumeData, displayResume, allResumes, loggedInUser}) {
    
    const [showResume, setShowResume] = useState(false) 

    useEffect(() => {
        fetchResumes()
    }, [])

    const openResume = (resumeID) => {
        displayResume(resumeID)
        setShowResume(true)
    }

    return (
        <div className = "relative pt-28 min-h-screen bg-neutral-200 items-center gap-10 flex flex-col"> 
            {showResume ? 
                <Resume updateResume = {updateResume} currResumeData = {currResumeData} setCurrResumeData = {setCurrResumeData} setShowResume = {setShowResume} showResume = {showResume} />
                :
                <div className = "w-3/5 flex flex-col items-center gap-5">
                    <div className = "flex relative w-full justify-center relative items-center">
                        <h1 className = "text-6xl font-extrabold">My Resumes</h1> 
                        {loggedInUser &&
                            <button className = "absolute right-0 h-full"><img  className = "size-full" src = "adddoc.svg" alt = "Create New"/></button>}
                    </div>
                    {loggedInUser ? (
                        allResumes && allResumes.length > 0 ? (
                            allResumes
                                .filter(resume => resume.user_id === loggedInUser)
                                .map((resume, resumeindex) => (
                                    <div
                                        key={resumeindex}
                                        className="p-10 bg-neutral-100/10 w-full flex gap-10 flex-col items-center rounded-2xl"
                                    >
                                        <button
                                            onClick={() => openResume(resume._id)}
                                            className="hover:underline text-3xl font-bold"
                                        >
                                            {resume.name}
                                        </button>
                                        <div className="w-full text-center">
                                            <p className="text-sm">
                                                Last Updated:{" "}
                                                {new Date(resume.updatedAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <section className="text-3xl font-bold">You have built no resumes yet!</section>
                        )
                    ) : (
                        <section className="text-3xl font-bold">Login to see or build!</section>
                    )}
                </div>
            }
        </div>
    )
}

export default MyResumes