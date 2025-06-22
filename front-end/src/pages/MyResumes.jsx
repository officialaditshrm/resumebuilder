import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyResumes ({buildResume, setShowLogin, smallScreen, allResumes, loggedInUser, fetchResumes, setCurrResumeData, createResume, currResumeData, deleteResume}) {
    const navigate = useNavigate()
    const [showDeleteWarning, setShowDeleteWarning] = useState(false)


    useEffect (() => {
        fetchResumes()
    }, [])

    

    if (loggedInUser) {
        return (
            <div className = {`${!smallScreen ? "ml-64 mt-[25vh]" : "mt-[10vh]"} min-h-screen flex flex-col items-center`}>
                <div className = "flex max-[540px]:flex-col max-[540px]:gap-6 items-center justify-evenly w-full">   
                    <h1 className = "text-3xl font-extrabold max-sm:text-2xl">YOUR RESUMES</h1>
                    <button
                    onClick = {() => buildResume()}
                    className = "flex items-center gap-1 bg-blue-900 text-white max-sm:text-xs font-bold px-3 py-2 rounded-md">
                        <img src = "/edit.svg"/>
                        BUILD NEW
                    </button>
                </div>
                <div className = {`flex flex-col gap-10 items-center md:px-10 py-10 w-full`}>
                    {allResumes && loggedInUser && allResumes
                    .filter(oneresume => oneresume.user_id === loggedInUser._id)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((resume, index) => {
                        return <div key = {index} className = {`max-md:flex-col p-3 flex w-4/5 bg-zinc-200 dark:bg-zinc-800 shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)] rounded-xl`}>
                            <div className = "flex flex-1 flex-col gap-5 p-2">
                                <div className = {`flex flex-1 justify-center md:items-center gap-2 sm:gap-5 flex-col text-wrap`}>
                                    <h1 className = "font-bold text-sm sm:text-xl break-all line-clamp-1 md:max-w-[70%]">{resume.name.toUpperCase()}</h1>
                                    <label className = "max-md:text-xs text-neutral-500 line-clamp-1 break-all">{resume.username}</label>
                                </div>
                                <div className = {`max-lg:flex-col text-xs sm:text-sm gap-2 flex flex-1 items-center justify-evenly w-full`}>
                                    <label className = "text-neutral-500">Created at: {new Date(resume.createdAt).toLocaleDateString("en-IN", ({
                                        month: "long",
                                        day : "2-digit",
                                        year : "numeric"
                                    }))}
                                    </label>
                                    <label className = "text-neutral-500">Last updated: {new Date(resume.updatedAt).toLocaleDateString("en-IN", ({
                                        month: "long",
                                        day : "2-digit",
                                        year : "numeric"
                                    }))}
                                    </label>
                                </div>
                            </div>
                            <div className = {`flex max-sm:flex-col max-sm:text-xs max-md:flex-row flex-col gap-2 sm:gap-5 p-5 md:border-l h-full items-center justify-center dark:border-zinc-100/30 border-zinc-900/30`}>
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
    else {
        return (
            <h1 className = {`${!smallScreen ? "ml-64 mt-[25vh]" : "mt-[20vh]"} min-h-screen p-5 sm:p-10 max-sm:flex-col max-sm:items-cene max-sm:text-sm gap-2 font-extrabold text-2xl flex items-start`}>
                <button
                onClick = {() => setShowLogin(true)}
                className = "underline text-blue-900">LOG-IN
                </button>
                to build or view your resumes.
            </h1>
        )
    }
}

export default MyResumes


function DeleteWarning ({deleteResume, setShowDeleteWarning, navigate, id}) {
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