import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Resume ({currResumeData, setCurrResumeData, loggedInUser, updateResume, deleteResume, fetchResumes}) {
    const [showDeleteWarning, setShowDeleteWarning] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        !currResumeData && navigate("/")
    }, [])

    return(
        <div className = "mt-[25vh] ml-[20vw] items-center flex flex-col">
            {currResumeData &&
                <div className = "w-full flex flex-col items-center gap-10">
                    <div className = "w-full relative flex justify-center items-center">
                        <h1 className = "font-extrabold text-3xl">{currResumeData.name}</h1>
                        {loggedInUser && loggedInUser._id === currResumeData.user_id &&
                            <div className = "absolute left-20  flex items-center justify-center gap-2">
                                <button
                                onClick = {() => {const resumeCopy = {...currResumeData}; resumeCopy.private = !currResumeData.private; updateResume(currResumeData._id, resumeCopy); fetchResumes(); setCurrResumeData(resumeCopy)}}
                                className = {`w-[50px] shadow-[0_0_3px_1px_rgba(0,0,0,0.25)] rounded-full h-[30px] flex ${currResumeData.private ? "bg-green-400" : "bg-red-400"} items-center`}>
                                    <div className = {`${currResumeData.private && "translate-x-[20px]"} rounded-full w-[26px] ml-[2px] h-[26px] bg-white shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]`}></div>
                                </button>
                                <label className = "font-bold text-sm text-neutral-500">{currResumeData.private ? "PRIVATE" : "PUBLIC"}</label>
                            </div>
                        }
                        {loggedInUser && loggedInUser._id === currResumeData.user_id &&
                            <button
                            className = "absolute right-20 text-white py-2 px-3 font-extrabold flex gap-1 rounded-md bg-blue-900">
                                <img src = "/edit.svg"/>
                                EDIT RESUME
                            </button>
                        }
                    </div>
                    <label className = "text-sm text-neutral-500 font-extrabold">{currResumeData._id}</label>
                    {loggedInUser && loggedInUser._id === currResumeData.user_id &&
                        <button
                        onClick = {() => setShowDeleteWarning(true)}
                        className = "text-white py-2 px-3 font-extrabold flex gap-1 rounded-md bg-red-900">
                            DELETE RESUME
                        </button>
                    }
                </div>
            }
            {showDeleteWarning &&
                <DeleteWarning navigate = {navigate} deleteResume = {deleteResume} id = {currResumeData._id} setShowDeleteWarning = {setShowDeleteWarning}/>
            }
        </div>
    )
}

export default Resume


function DeleteWarning ({deleteResume, setShowDeleteWarning, id}) {
    return (
        <div className = "bg-neutral-100/50 backdrop-blur-sm fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center">
            <div className = "rounded-xl flex flex-col gap-8 bg-neutral-100 p-10 shadow-[0_0_10px_1px_rgba(0,0,0,0.25)]">
                <p className = "text-xl">Are you sure you want to delete this Resume?</p>
                <div className = "w-full flex justify-evenly items-center">
                    <button
                    onClick = {() => {deleteResume(id); navigate("/"); setShowDeleteWarning(false);}}
                    className = "rounded-md bg-red-600 text-white px-3 py-2 font-bold">DELETE</button>
                    <button
                    onClick = {() => {setShowDeleteWarning(false)}}
                    className = "rounded-md bg-neutral-600 text-white px-3 py-2 font-bold">CANCEL</button>
                </div>
            </div>
        </div>
    )
}