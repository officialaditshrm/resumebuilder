import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'

function Profile ({smallScreen, setPfp, darkMode, displayLoggedInUser, loggedInUser, url, pfp, setShowLogin, updateUser, flashNameAlert, nameAlert, setNameAlert, setLoggedInUser}) {
    const [userToShow, setUserToShow] = useState(null)

    const deletePfp = async (id)  => {
        try{
            const response = await fetch(`${url}/api/users/deletepfp/${id}`, {
                method : "DELETE"
            })
            if (!response.ok) {
                throw new Error ("Couldn't delete somehow")
            }
            setPfp(null)
            setNameAlert("Profile picture deleted")
            flashNameAlert()
        } catch(error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        setUserToShow(loggedInUser)
    }, [loggedInUser])

    const [showUpload, setShowUpload] = useState(false)

    const [editName, setEditName] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [editBio, setEditBio] = useState(false)

    if (userToShow) {
        return (
            <div className = {`${!smallScreen ? "ml-64 mt-[25vh]" : "mt-[10vh]"} p-5 min-h-screen gap-10 flex flex-col items-center`}>
                {nameAlert && <p className = "text-xs text-red-600">{nameAlert}</p>}
                <div className = "flex w-full px-10 max-sm:flex-col items-center max-sm:gap-10">
                    <div className = "sm:w-[50%] flex items-center justify-center flex-col gap-4">
                        <div
                        onMouseOver = {()=> setShowUpload(true)}
                        onMouseLeave = {()=> setShowUpload(false)}
                        className = "relative flex flex-col items-center justify-center bg-violet-300 rounded-full h-[30vh] w-[30vh]">    
                            
                            {pfp ?
                                <img src = {pfp} className ="w-full h-full object-cover rounded-full"/>
                                :
                                <img src = "/addphotoblack.svg" className = "w-[60%] h-[60%]" />
                            }
                            {showUpload && <div className = "absolute flex items-center justify-center w-full h-full rounded-full bg-black/30">
                                <img src = "/edit.svg"/>
                                <input
                                type="file"
                                className = "absolute h-full w-full rounded-full cursor-pointer opacity-0"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0]
                                    if (!file) return

                                    try {
                                    const compressedFile = await imageCompression(file, {
                                        maxSizeMB: 0.1, // Max size in MB (0.1MB = 100KB)
                                        maxWidthOrHeight: 500, // You can adjust if needed
                                        useWebWorker: true
                                    })

                                    const userUpdate = { profileimg: compressedFile }
                                    updateUser(userToShow._id, userUpdate)
                                    } catch (error) {
                                    console.error("Image compression failed:", error)
                                    }
                                }} />
                            </div>}
                        </div>
                        {pfp && 
                        <button
                        onClick = {() => {deletePfp(loggedInUser._id)}}
                        className = "font-bold hover:text-red-900 text-red-700 ">
                            DELETE IMAGE
                        </button>}
                    </div>
                    <div className = "sm:w-[50%] flex flex-col gap-5">
                        <div className = "flex flex-col w-full">
                            <label className = "font-bold text-neutral-500">
                                Name:
                            </label>
                            {editName ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const newName = event.target.elements.name.value
                                    const formData = {
                                        name: newName
                                    }
                                    if (formData.name === loggedInUser.name) {
                                        setNameAlert("No Changes made in Name")
                                        flashNameAlert()
                                        return
                                    }
                                    if (formData.name === "") {
                                        setNameAlert("Please add a name.")
                                        flashNameAlert()
                                        return
                                    }
                                    updateUser(userToShow._id, formData)
                                    setEditName(false)
                                }} 
                                className = "flex flex-col flex-wrap gap-2">
                                    <div className = "flex items-center max-sm:flex-col gap-2">
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
                                        className = {`p-2 border text-black border-black rounded-xl`}
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
                                            onClick = {() => {setUserToShow(loggedInUser); setNameAlert(null); setEditName(false)}}
                                            className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    {nameAlert && <p className = "text-xs text-red-600">{nameAlert}</p>}
                                </form>
                                :
                                <div className = "flex items-center gap-2">
                                    <p className = "break-all">{userToShow.name}</p>
                                    <button type = "button" onClick = {() => {setEditName(true)}}>
                                        <img src = {darkMode ? "edit.svg" : "/editblack.svg"}/>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className = "flex flex-col w-full">
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
                                        return
                                    }
                                    if (formData.email === "") {
                                        setNameAlert("Email cannot be empty")
                                        flashNameAlert()
                                        return
                                    }
                                    setEditEmail(false)
                                }} 
                                className = "flex flex-col flex-wrap gap-2">
                                    <div className = "flex items-center max-sm:flex-col gap-2">
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
                                        className = {`p-2 text-black border border-black rounded-xl`}
                                        />
                                        <div className = "flex sm:w-full gap-4 justify-evenly">
                                            <button 
                                            type = "submit"
                                            className = "text-white bg-blue-900 py-2 px-3 rounded-xl"
                                            >
                                                Save
                                            </button>
                                            <button 
                                            type = "button"
                                            onClick = {() => {setEditEmail(false); setNameAlert(null); setUserToShow(loggedInUser)}}
                                            className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    {nameAlert && <p className = "text-xs text-red-600">{nameAlert}</p>}
                                </form>
                                :
                                <div className = "flex items-center gap-2">
                                    <p>{userToShow.email}</p>
                                    <button type = "button" onClick = {() => {setEditEmail(true)}}>
                                        <img src = {darkMode ? "edit.svg" : "/editblack.svg"}/>
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
                                        className = {`p-2 border text-black border-black rounded-xl`}
                                        />
                                    </div>
                                    <div className = "flex gap-2 flex-col w-full">
                                        <label>Enter New Password: </label>
                                        <input 
                                        type = "password"
                                        name = "newPassword"
                                        className = {`p-2 text-black border border-black rounded-xl`}
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
                                        <img src = {darkMode ? "edit.svg" : "/editblack.svg"}/>
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
                <div className = "flex flex-col text-center w-full sm:px-16 px-8">
                    <label className = "font-bold w-full text-xl text-neutral-500">
                        BIO
                    </label>
                    {editBio ?
                        <form
                        onSubmit = {(event) => {
                            event.preventDefault()
                            const newBio = event.target.elements.bio.value
                            const formData = {
                                bio: newBio
                            }
                            if (formData.bio === loggedInUser.bio) {
                                setNameAlert("No Changes made in bio")
                                flashNameAlert()
                                return
                            }
                            if (formData.bio === "") {
                                formData.bio = " "
                            }
                            updateUser(userToShow._id, formData)
                            setEditBio(false)
                        }} 
                        className = "flex flex-col flex-wrap gap-2">
                            <div className = "flex w-full flex-wrap flex-col gap-2">
                                <textarea
                                type = "text"
                                name = "bio" 
                                autoFocus
                                onChange={(event) => {
                                    const newBio = event.target.value
                                    const copyLog = {...userToShow}
                                    copyLog.bio = newBio
                                    setUserToShow(copyLog)
                                }}
                                value = {userToShow.bio}
                                className = {`text-black p-2 w-full border border-black rounded-xl`}
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
                                    onClick = {() => {setEditBio(false); setUserToShow(loggedInUser); setNameAlert(null)}}
                                    className = "text-white bg-neutral-700 py-2 px-3 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            {nameAlert && <p className = "text-xs text-red-600">{nameAlert}</p>}
                        </form>
                        :
                        <div className = "flex w-full flex-col items-center text-sm text-neutral-500 gap-2">
                            {userToShow.bio ? <p className = "w-full break-words overflow-auto whitespace-normal">{userToShow.bio}</p> : <p className = "text-neutral-400 italic">No bio</p>}
                            <button type = "button" onClick = {() => {setEditBio(true)}}>
                                <img src = {darkMode ? "edit.svg" : "/editblack.svg"}/>
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className = {`${!smallScreen ? "ml-64 mt-[25vh]" : "mt-[20vh]"} min-h-screen gap-10 flex flex-col items-center`}>
                <h1 className = "font-bold gap-2 flex max-sm:flex-col max-sm:items-center">
                    <button
                    onClick = {() => setShowLogin(true)}
                    className = "underline text-blue-900">LOG-IN</button>to build or view your resumes.
                </h1>
            </div>
        )
    }
}

export default Profile