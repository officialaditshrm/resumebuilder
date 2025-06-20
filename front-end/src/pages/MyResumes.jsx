import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyResumes ({allResumes, loggedInUser, fetchResumes, setCurrResumeData, createResume, currResumeData, deleteResume}) {
    const navigate = useNavigate()
    const [showDeleteWarning, setShowDeleteWarning] = useState(false)


    useEffect (() => {
        fetchResumes()
    }, [])

    const buildResume = () => {
        const untitledresume = {
            name : "Untitled" + new Date().toLocaleString(),
            private : true,
            user_id : loggedInUser._id,
            username : loggedInUser.name
        }
        createResume(untitledresume)
    }


    return (
        <div className = "mt-[25vh] flex flex-col items-center ml-[20vw]">
            <div className = "flex items-center justify-evenly w-full">   
                <h1 className = "text-3xl font-extrabold">YOUR RESUMES</h1>
                <button
                onClick = {() => buildResume()}
                className = "flex items-center gap-1 text-white font-bold bg-neutral-800 px-3 py-2 rounded-md">
                    <img src = "/edit.svg"/>
                    BUILD NEW
                </button>
            </div>
            <div className = "flex flex-col gap-10 items-center p-10 w-full">
                {allResumes && loggedInUser && allResumes
                .filter(oneresume => oneresume.user_id === loggedInUser._id)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((resume, index) => {
                    return <div key = {index} className = "flex w-4/5 bg-neutral-200 shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)] rounded-xl">
                        <div className = "flex flex-1 flex-col p-2">
                            <div className = "flex flex-1 justify-center items-center gap-5">
                                <h1 className = "font-bold text-xl">{resume.name.toUpperCase()}</h1>
                                <label className = "text-neutral-500">{resume.username}</label>
                            </div>
                            <div className = "text-sm font-bold flex flex-1 items-center justify-evenly w-full">
                                <label className = "text-neutral-500">CREATED AT: {new Date(resume.createdAt).toLocaleDateString("en-IN", ({
                                    month: "long",
                                    day : "2-digit",
                                    year : "numeric"
                                }))}
                                </label>
                                <label className = "text-neutral-500">LAST UPDATED: {new Date(resume.updatedAt).toLocaleDateString("en-IN", ({
                                    month: "long",
                                    day : "2-digit",
                                    year : "numeric"
                                }))}
                                </label>
                            </div>
                        </div>
                        <div className = "flex flex-col gap-5 p-5 border-l h-full items-center justify-center border-neutral-950/30">
                            <label className = "text-neutral-500 font-bold">{resume.private ? "PRIVATE" : "PUBLIC"}</label>
                            <button
                            onClick = {() => {navigate("/resume"); setCurrResumeData(resume)}}
                            className = "text-white font-bold bg-green-900 flex justify-center px-3 py-1 rounded-md">VIEW</button>
                            <button
                            onClick = {() => {setCurrResumeData(resume); setShowDeleteWarning(true)}}
                            className = "text-white font-bold bg-red-900 flex justify-center px-3 py-1 rounded-md">DELETE</button>
                        </div>
                    </div>
                }
                )}
            </div>
            {showDeleteWarning &&
                <DeleteWarning navigate = {navigate} deleteResume = {deleteResume} id = {currResumeData._id} setShowDeleteWarning = {setShowDeleteWarning}/>
            }
        </div>
    )
}

export default MyResumes


function DeleteWarning ({deleteResume, setShowDeleteWarning, id}) {
    return (
        <div className = "bg-neutral-100/50 backdrop-blur-sm fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center">
            <div className = "rounded-xl flex flex-col gap-8 bg-neutral-100 p-10 shadow-[0_0_10px_1px_rgba(0,0,0,0.25)]">
                <p className = "text-xl">Are you sure you want to delete this Resume?</p>
                <div className = "w-full flex justify-evenly items-center">
                    <button
                    onClick = {() => {deleteResume(id); setShowDeleteWarning(false); navigate("/")}}
                    className = "rounded-md bg-red-600 text-white px-3 py-2 font-bold">DELETE</button>
                    <button
                    onClick = {() => {setShowDeleteWarning(false)}}
                    className = "rounded-md bg-neutral-600 text-white px-3 py-2 font-bold">CANCEL</button>
                </div>
            </div>
        </div>
    )
}