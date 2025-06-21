import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'

function Profile ({smallScreen, loggedInUser, pfp, setShowLogin, updateUser, flashNameAlert, nameAlert, setNameAlert, setLoggedInUser}) {
    const [userToShow, setUserToShow] = useState(null)

    useEffect(() => {
        setUserToShow(loggedInUser)
    }, [loggedInUser])

    const [showUpload, setShowUpload] = useState(false)

    const [editName, setEditName] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [editPassword, setEditPassword] = useState(false)

    if (userToShow) {
        return (
            <div className = {`${!smallScreen ? "ml-60 mt-[25vh]" : "mt-[15vh]"} min-h-screen gap-10 flex flex-col items-center`}>
                <div className = "h-[1vh]">{nameAlert && <p className = "text-xs text-red-600">{nameAlert}</p>}</div>
                <div className = "flex w-full px-10 max-sm:flex-col items-center max-sm:gap-10">
                    <div className = "sm:w-[50%] flex items-center justify-center">
                        <div
                        onMouseOver = {()=> setShowUpload(true)}
                        onMouseLeave = {()=> setShowUpload(false)}
                        className = "relative flex flex-col items-center justify-center bg-violet-300 rounded-full h-[30vh] w-[30vh]">    
                            
                            <img src = {pfp} className ="w-full h-full object-cover rounded-full"/>
                            {showUpload && <div className = "absolute flex items-center justify-center w-full h-full rounded-full bg-black/30">
                                <img src = "/edit.svg"/>
                                <input
                                type="file"
                                className = "absolute h-full w-full rounded-full cursor-pointer opacity-0"
                                accept="image/*"
                                onChange={async (e) => {
                                const file = e.target.files[0]
                                const userUpdate = { profileimg: file };
                                updateUser(userToShow._id, userUpdate)
                            }} />
                            </div>}
                        </div>
                    </div>
                    <div className = "sm:w-[50%] flex flex-col gap-5">
                        <div className = "flex flex-col">
                            <label className = "font-bold text-neutral-500">
                                Name:
                            </label>
                            {editName ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const newName = event.target.elements.name.value
                                    const formData = {
                                        name: event.target.elements.name.value
                                    }
                                    if (formData.name === loggedInUser.name) {
                                        setNameAlert("No Changes made in Name")
                                        flashNameAlert()
                                        setEditName(false)
                                        return
                                    }
                                    updateUser(userToShow._id, formData)
                                    setEditName(false)
                                }} 
                                className = "flex items-center gap-2">
                                    <input 
                                    type = "text"
                                    name = "name" 
                                    autoFocus
                                    onChange={(event) => {
                                        const newName = event.target.value
                                        const copyLog = {...userToShow}
                                        copyLog.name = newName
                                        setUserToShow(copyLog)
                                    }}
                                    value = {userToShow.name}
                                    className = {`p-2 border border-black rounded-xl`}
                                    />
                                    <div className = "flex w-full justify-evenly">
                                        <button 
                                        type = "submit"
                                        className = "text-white bg-blue-900 py-2 px-3 rounded-xl"
                                        >
                                            Save
                                        </button>
                                        <button 
                                        type = "button"
                                        onClick = {() => setEditName(false)}
                                        className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                                :
                                <div className = "flex items-center gap-2">
                                    <p>{userToShow.name}</p>
                                    <button type = "button" onClick = {() => {setEditName(true)}}>
                                        <img src = "/editblack.svg" />
                                    </button>
                                </div>
                            }
                        </div>
                        <div className = "flex flex-col">
                            <label className = "font-bold text-neutral-500">
                                Email:
                            </label>
                            {editEmail ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const formEmail = event.target.elements.email.value
                                    const formData = {
                                        email: formEmail
                                    }
                                    if (formData.email === loggedInUser.email) {
                                        setNameAlert("No Changes made in Email")
                                        flashNameAlert()
                                        setEditEmail(false)
                                        return
                                    }
                                    updateUser(userToShow._id, formData)
                                    setEditEmail(false)
                                }} 
                                className = "flex items-center gap-2">
                                    <input 
                                    type = "text"
                                    name = "email" 
                                    autoFocus
                                    onChange={(event) => {
                                        const newEmail = event.target.value
                                        const copyLog = {...userToShow}
                                        copyLog.email = newEmail
                                        setUserToShow(copyLog)
                                    }}
                                    value = {userToShow.email}
                                    className = {`p-2 border border-black rounded-xl`}
                                    />
                                    <div className = "flex w-full justify-evenly">
                                        <button 
                                        type = "submit"
                                        className = "text-white bg-blue-900 py-2 px-3 rounded-xl"
                                        >
                                            Save
                                        </button>
                                        <button 
                                        type = "button"
                                        onClick = {() => setEditEmail(false)}
                                        className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                                :
                                <div className = "flex items-center gap-2">
                                    <p>{userToShow.email}</p>
                                    <button type = "button" onClick = {() => {setEditEmail(true)}}>
                                        <img src = "/editblack.svg" />
                                    </button>
                                </div>
                            }
                        </div>
                        <div className = "flex flex-col">
                            <label className = "font-bold text-neutral-500">
                                Password:
                            </label>
                            {editPassword ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const formPassword = event.target.elements.password.value
                                    const formNewPassword = event.target.elements.newPassword.value
                                    const formData = {
                                        password: formPassword,
                                        newPassword: formNewPassword 
                                    }
                                    if (formNewPassword.trim() != "" && formPassword.trim() != "") {  
                                        updateUser(userToShow._id, formData)
                                        setEditPassword(false)
                                    } else {
                                        setNameAlert("Please enter a valid Password")
                                        flashNameAlert()
                                    }
                                }} 
                                className = "flex flex-col items-start gap-3">
                                    <div className = "flex-col flex gap-2 w-full">
                                        <label>Enter Current Password: </label>
                                        <input 
                                        type = "password"
                                        name = "password" 
                                        autoFocus
                                        className = {`p-2 border border-black rounded-xl`}
                                        />
                                    </div>
                                    <div className = "flex gap-2 flex-col w-full">
                                        <label>Enter New Password: </label>
                                        <input 
                                        type = "password"
                                        name = "newPassword"
                                        className = {`p-2 border border-black rounded-xl`}
                                        />
                                    </div>
                                    <div className = "flex w-full justify-evenly">
                                        <button 
                                        type = "submit"
                                        className = "text-white bg-blue-900 py-2 px-3 rounded-xl"
                                        >
                                            Save
                                        </button>
                                        <button 
                                        type = "button"
                                        onClick = {() => setEditPassword(false)}
                                        className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                                :
                                <div className = "flex items-center gap-2">
                                    <p>**********</p>
                                    <button type = "button" onClick = {() => {setEditPassword(true)}}>
                                        <img src = "/editblack.svg" />
                                    </button>
                                </div>
                            }
                        </div>
                        <label className = "font-bold text-neutral-500">
                            Created At: {userToShow.createdAt ? 
                                new Date(userToShow.createdAt).toLocaleDateString("en-IN", ({
                                    month: "long",
                                    day: "2-digit",
                                    year: "numeric"
                                }))
                                :
                                "-"
                            }
                        </label>
                        <label className = "font-bold text-neutral-500">
                            Last Updated: {userToShow.updatedAt ? 
                                new Date(userToShow.updatedAt).toLocaleDateString("en-IN", ({
                                    month: "long",
                                    day: "2-digit",
                                    year: "numeric"
                                }))
                                :
                                "-"
                            }
                        </label>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className = {`${!smallScreen ? "ml-60 mt-[25vh]" : "mt-[15vh]"} min-h-screen gap-10 flex flex-col items-center`}>
                <h1 className = {`${!smallScreen ? "ml-60 mt-[25vh]" : "mt-[15vh]"} min-h-screen p-10 max-sm:text-sm max-sm:flex-col gap-2 font-extrabold text-2xl flex  items-center`}>
                    <button
                    onClick = {() => setShowLogin(true)}
                    className = "underline text-blue-900">LOG-IN</button>to build or view your resumes.
                </h1>
            </div>
        )
    }
}

export default Profile