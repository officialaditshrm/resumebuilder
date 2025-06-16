import ShowUser from '../components/ShowUser.jsx'

import { useState, useEffect } from 'react'

function ListUsers ({users, url, allResumes, listUsers, fetchResumes}) {
    const [displayUser, setDisplayUser] = useState(false)
    const [currProfileToDisplay, setCurrProfileToDisplay] = useState(null)

    
    useEffect(() => {
        listUsers()
    }, [])

    const showUser = async (userID) => {
        try {
            const response = await fetch(`${url}/api/users/${userID}`, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if (!response.ok) {
                throw new Error("Faild to fetch user")
            }
            
            const usertodisplay = await response.json()
            
            setCurrProfileToDisplay(usertodisplay.data)
            setDisplayUser(true)
        } catch(error) {
            setDisplayUser(false)
            alert(error.message)
        }
    }
    
    return (
        <div className = "pt-24 min-h-screen flex flex-col items-center">
            <div className = "w-3/5 flex flex-col gap-6 items-center">
                <h1 className = "text-6xl font-extrabold">Users</h1>
                {users.map((user) => {
                    return (
                        <div
                        key = {user._id}
                        className = {`bg-white/10 gap-4 rounded-md w-full flex flex-col items-center p-6`}>
                            <div className = "w-full flex justify-between">
                                <h1 className = "font-extrabold text-2xl">{user.name}</h1>
                                <p>{user.email}</p>
                                <p>{user._id}</p>
                            </div>
                            {user.public_resumes &&
                            <p>
                                {user.public_resumes.length}
                            </p>
                            }
                            <button 
                            className = "rounded-md border px-10 py-4"
                            onClick = {() => showUser(user._id)}>
                                View Profile
                            </button>
                        </div>
                    )
                })}
                {displayUser && <ShowUser allResumes = {allResumes} listUsers = {listUsers} fetchResumes = {fetchResumes} setDisplayUser = {setDisplayUser} currProfileToDisplay = {currProfileToDisplay} setCurrProfileToDisplay = {setCurrProfileToDisplay}/>}
            </div>
        </div>
    )
}

export default ListUsers