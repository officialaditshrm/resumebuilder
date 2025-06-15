import ShowUser from './ShowUser.jsx'

import { useState, useEffect } from 'react'

function ListUsers ({users, url, setShowUserList, listUsers}) {
    const [displayUser, setDisplayUser] = useState(false)
    const [currProfileToDisplay, setCurrProfileToDisplay] = useState(null)
    const [publicResumes, setPublicResumes] = useState([])

    const fetchResumes = async () => {
        try{
            const response = await fetch(`${url}/api/resumes`)
            if (!response.ok) {
                throw new Error("Could not list resumes")
            }
            console.log(response)
            const jsonresponse = await response.json()
            console.log(jsonresponse.data)
            setPublicResumes(jsonresponse.data)
        } catch(error) {
            alert(error)
        }
    }
    useEffect(() => {
        fetchResumes()
    }, [])

    const showUser = async (userID) => {
        try {
            const response = await fetch(`${url}/api/users/${userID}`, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Faild to fetch user")
            }
            
            const usertodisplay = await response.json()
            
            console.log(usertodisplay.data)
            setCurrProfileToDisplay(usertodisplay.data)
            setDisplayUser(true)
        } catch(error) {
            setDisplayUser(false)
            alert(error.message)
        }
    }
    
    return (
        <div className = "bg-white/10 w-3/5 flex flex-col gap-4 items-center">
            {users.map((user) => {
                return (
                    <div 
                    key = {user._id}
                    className = {`rounded-md `}>
                        <h1>{user.name}</h1>
                        <p>{user.email}</p>
                        <button 
                        className = "rounded-md border px-10 py-4"
                        onClick = {() => showUser(user._id)}>
                            View Profile
                        </button>
                    </div>
                )
            })}
            {displayUser && <ShowUser listUsers = {listUsers} fetchResumes = {fetchResumes} setDisplayUser = {setDisplayUser} publicResumes = {publicResumes} currProfileToDisplay = {currProfileToDisplay} />}
        </div>
    )
}

export default ListUsers