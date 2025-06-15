import { useState, useEffect } from 'react'

function ShowUser ({currProfileToDisplay, publicResumes, listUsers, setDisplayUser, fetchResumes}) {
    
    const [userPublicResumes, setUserPublicResumes] = useState([])

    useEffect(() => {
        publicResumes.forEach(element => {
            const newListOfUserPublicResumes = publicResumes.filter(
                (element) => !element.private && element.user_id === currProfileToDisplay._id
            )
            setUserPublicResumes(newListOfUserPublicResumes)
        })
    }, [publicResumes, currProfileToDisplay])

    return (
        <div className = "flex flex-col justify-center items-center fixed top-0 right-0 h-screen w-screen bg-white/20 backdrop-blur">
            <div className = "rounded-2xl bg-black p-10 relative">
                <h1 className = "font-extrabold text-3xl">{currProfileToDisplay.name}</h1>
                <div>
                    <h1>{userPublicResumes.length} Public Resume{userPublicResumes.length != 1 &&"s"}{userPublicResumes.length > 0 && ":"}</h1>
                    <ol>
                        {userPublicResumes.map((resume) => (
                                <li key = {resume._id}>{resume.name}</li>
                            )
                        )}
                    </ol>
                </div>
                <button 
                onClick = {() => {setDisplayUser(false); listUsers(); fetchResumes()}}
                className = "size-[10%] absolute right-4 top-4" id = "close"><img src = "/closewhite.svg" className = "size-full"/></button>
            </div>
            
        </div>
    )
}

export default ShowUser