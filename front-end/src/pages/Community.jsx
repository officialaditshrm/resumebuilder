import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


function Community ({url, darkMode, allResumes, fetchResumes, setCurrResumeData, particularUser, setParticularUser, loggedInUser, currResumeData}) {
    const [allUsers, setAllUsers] = useState(null)

    
    useEffect(() => {
        if (!allUsers) return
        allUsers.forEach(user => {
            if (user.profileimg) {
                fetchparticularpfp(user)
            }
        })
    }, [allUsers])
    
    useEffect(() => {
    if (!allResumes || !allUsers) return;

    // Build a map of userId -> public resume count
    const publicCounts = {};

    allResumes.forEach(resume => {
        if (!resume.private) {
            publicCounts[resume.user_id] = (publicCounts[resume.user_id] || 0) + 1;
        }
    });

    // Update users with the public resume count
    const updatedUsers = allUsers.map(user => ({
        ...user,
        publiccount: publicCounts[user._id] || 0
    }));

    setAllUsers(updatedUsers);
}, [allResumes]);


    useEffect(() => {
        // setParticularUser(null)
        fetchResumes()
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
        const response = await fetch(`${url}/api/users`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if (!response.ok) {
            throw new Error("Could not fetch users")
        }
        const actualresponse = await response.json()
        setAllUsers(actualresponse.data)
        } catch(error) {
        console.error(error.message)
        }
    }

    const fetchparticularpfp = async (user) => {
        try {
            const response = await fetch(`${url}/pfpimages/${user.profileimg}`, {
                method: "GET",
            })
            if (!response.ok) {
                throw new Error("Error Fetching particular PFP")
            }

            const blob = await response.blob()
            const src = (URL.createObjectURL(blob))
            
            setAllUsers(prev => 
                prev.map(u => 
                    u._id === user._id ? { ...u, profilesrc: src } : u
                )
            )

            } catch(error) {
                console.log(error.message)
                return(null)
            }
    }
    return (
        <div className = {`md:ml-72 md:mt-[25vh] ${loggedInUser ? 'mt-[10vh]' : 'mt-[20vh]'} min-h-screen flex flex-col items-center`}>
            <h1 className = "font-extrabold text-3xl max-sm:text-xl">Community</h1>
            <div id = "listofusers" className = "flex flex-col items-center p-10 gap-4 sm:gap-8 max-sm:p-5 w-full">
                {allUsers && allUsers.map((user, index) => {
                    return <div
                    onClick = {() => {setParticularUser(user)}}
                    key = {index} className = "rounded-2xl bg-zinc-200 dark:bg-zinc-800 hover:bg-neutral-300 flex w-full shadow-[0_2px_5px_1px_rgba(0,0,0,0.15)] cursor-pointer max-sm:flex-col">
                        <div className = "flex items-center justify-center p-5 sm:w-min">
                            <div className = "w-[20vh] h-[20vh] rounded-full bg-violet-300 flex items-center justify-center">
                                {user.profileimg ? 
                                    (user.profilesrc &&  <img src = {user.profilesrc} className = "object-cover w-full h-full rounded-full"/>)
                                    :
                                    <img src = "/profileblack.svg" className = "w-[70%] h-[70%]" />
                                }
                            </div>
                        </div>
                        <div className = "px-5 pb-5 sm:pt-5 gap-4 flex flex-col overflow-hidden max-sm:text-center max-sm:items-center">
                            <h1
                            className = "font-bold break-all line-clamp-1 text-xl sm:text-2xl">
                                {user.name.toUpperCase()}
                            </h1>
                            <div>
                                {user.bio ? <p className = "italic line-clamp-4 overflow-hidden text-sm break-all">{user.bio}</p> : <p className = "italic font-bold text-neutral-500">No bio</p>}
                            </div>
                            {user.publiccount ? <p className = "italic text-neutral-500 font-bold">{user.publiccount} public resume{user.publiccount > 1 && "s"}</p> : <p className = "italic text-neutral-500 font-bold">No public Resume</p>}
                        </div>
                    </div> 
                })}
            </div>
            {particularUser && <ParticularUser darkMode = {darkMode} setParticularUser={setParticularUser} setCurrResumeData={setCurrResumeData} loggedInUser = {loggedInUser} currResumeData = {currResumeData} allResumes={allResumes} particularUser={particularUser}/>}
        </div>
    )
}

export default Community

function ParticularUser ({particularUser, setParticularUser, darkMode, loggedInUser, setCurrResumeData, allResumes, currResumeData}) {
    const [userPublicResumes, setUserPublicResumes] = useState([])
    useEffect(() => {
        if (!allResumes || !particularUser) return;

        const publicResumes = allResumes.filter(
            resume => resume.user_id === particularUser._id && !resume.private
        );

        setUserPublicResumes(publicResumes)
    }, [])
    return (
        <div className = "fixed z-20 dark:bg-neutral-900/50 bg-neutral-100/50 backdrop-blur top-0 left-0 h-screen w-screen">
            <div className = {`absolute top-0 left-0 right-0 bottom-0 md:ml-64 flex items-center justify-center md:p-10 sm:p-6 lg:p-16 p-5`}>
                <div className = "relative rounded-2xl w-full mt-[10vh] bg-zinc-100 dark:bg-zinc-800 max-sm:flex-col flex shadow-[0_0_3px_1px_rgba(0,0,0,0.15)] sm:p-10 p-5">
                    <button onClick = {() => {setParticularUser(null); setUserPublicResumes([])}} className = 'absolute top-1 right-1 sm:top-2 sm:right-2 w-[30px] h-[30px]'><img src = {darkMode ? "/closewhite.svg" : "/close.svg"} /></button>
                    <div className = "flex items-center justify-center p-5 sm:w-min">
                        <div className = "w-[20vh] h-[20vh] rounded-full bg-violet-300 flex items-center justify-center">
                            {particularUser.profileimg ? 
                                (particularUser.profilesrc &&  <img src = {particularUser.profilesrc} className = "object-cover w-full h-full rounded-full"/>)
                                :
                                <img src = "/profileblack.svg" className = "w-[70%] h-[70%]" />
                            }
                        </div>
                    </div>
                    <div className = "max-sm:px-1 px-5 pb-5 sm:pt-5 gap-5 flex overflow-hidden flex-col max-sm:items-center">
                        <h1
                        className = "font-bold overflow-y-auto break-all line-clamp-1 text-xl sm:text-2xl">
                            {particularUser.name.toUpperCase()}
                        </h1>
                        <div className = "max-h-[13vh] overflow-hidden overflow-y-auto text-xs italic">
                            <h1 className = "font-bold text-neutral-500">Bio</h1>
                            {particularUser.bio ? <p className = "break-all">{particularUser.bio}</p> : <p className = "italic text-neutral-500">No bio</p>}
                        </div>
                        <div className = "w-full text-xs font-semibold p-2">
                            <h1 className = "text-neutral-500">Public Resumes:</h1>
                            <div className = "flex flex-col gap-2  overflow-hidden max-h-[15vh] overflow-y-auto">
                                {userPublicResumes && (userPublicResumes.length > 0 ? userPublicResumes.map((resume, index) => {
                                    return <Link key = {index} onClick = {() => {setParticularUser(null); setUserPublicResumes([]); setCurrResumeData(resume)}} to = "/resume" className = "hover:underline break-all cursor-pointer">{resume.name}</Link>
                                    })
                                    :
                                    "~"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}