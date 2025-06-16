import { useState, useEffect } from 'react'

function ShowUser ({allResumes, currProfileToDisplay, setCurrProfileToDisplay, setDisplayUser, fetchResumes}) {
    
    useEffect (() => {
        fetchResumes()
    }, [currProfileToDisplay])

    return (
        <div className = "flex flex-col justify-center items-center fixed top-0 right-0 h-screen w-screen bg-white/20 backdrop-blur">
            <div className = "rounded-2xl bg-black p-10 relative">
                <h1 className = "font-extrabold text-3xl">{currProfileToDisplay.name}</h1>
                <div>
                    <h1>{currProfileToDisplay.public_resumes.length} Public Resume{currProfileToDisplay.public_resumes.length != 1 &&"s"}{currProfileToDisplay.public_resumes.length > 0 && ":"}</h1>
                    <ol>
                        {currProfileToDisplay.public_resumes.map((resumeID) => {
                            const matchingResume = allResumes.find((element) => element._id === resumeID)
                            return <li key = {resumeID}>{matchingResume.name}</li>
                        })}
                    </ol>
                </div>
                <button 
                onClick = {() => {setDisplayUser(false); setCurrProfileToDisplay(null)}}
                className = "size-[10%] absolute right-4 top-4" id = "close"><img src = "/closewhite.svg" className = "size-full"/></button>
            </div>
            
        </div>
    )
}

export default ShowUser