import { useNavigate } from "react-router-dom";

function Header ({token, setToken, fetchResumes, listUsers, setLoggedInUser, setShowLogin}) {
    const navigate = useNavigate()

    const handleHome = () => {
        navigate("/")
    }
    
    const handleShowUsers = () => {
        listUsers()
        fetchResumes()
        navigate("/listusers")
    }

    const handleMyResumes = () => {
        fetchResumes()
        navigate("/myresumes")
    }
    
    return (
        <div className = "fixed backdrop-blur-md top-3 right-5 left-5 flex rounded-2xl h-20">
            <div className = "top-[3px] right-[3px] bottom-[3px] left-[3px] bg-white/50 flex rounded-2xl fixed text-black justify-evenly">
                <div className = "flex flex-1 px-10">
                    <button
                    onClick={handleHome}
                    className = "flex flex-col items-center justify-center rounded-2xl hover:bg-neutral-950/10 px-10">
                        <img className = "h-1/2" src = "homeblack.svg"/>
                        <label className = "text-sm">Home</label>
                    </button>
                    <button
                    onClick={handleShowUsers}
                    className = "flex flex-col items-center justify-center rounded-2xl hover:bg-neutral-950/10 px-10">
                        <img className = "h-1/2" src = "communityblack.svg"/>
                        <label className = "text-sm">Community</label>
                    </button>
                    <button
                    onClick={handleMyResumes}
                    className = "flex flex-col items-center justify-center rounded-2xl hover:bg-neutral-950/10 px-10">
                        <img className = "h-1/2" src = "adddocblack.svg"/>
                        <label className = "text-sm">My Resumes</label>
                    </button>
                </div>
                <div className = "flex justify-end px-10">
                    {!token &&
                    <button
                    onClick = {() => setShowLogin(true)}
                    className = "flex flex-col justify-center items-center rounded-2xl hover:bg-neutral-950/10 px-10">
                        <img className = "h-1/2" src = "loginblack.svg"/>
                        <label className = "text-sm">Login</label>
                    </button>
                    }
                    {token &&
                        <button
                        onClick = {(event) => {event.preventDefault()}}
                        className = "flex flex-col justify-center items-center rounded-2xl hover:bg-neutral-950/10 px-10">
                            <img className = "h-1/2" src = "profileblack.svg"/>
                            <label className = "text-sm">Profile</label>
                        </button>
                    }
                    {token &&   
                        <button
                        onClick = {() => {setToken(""); localStorage.removeItem("resumeBuilderToken"); setLoggedInUser(null)}}
                        className = "flex flex-col justify-center items-center rounded-2xl hover:bg-neutral-950/10 px-10">
                            <img className = "h-1/2" src = "logoutblack.svg"/>
                            <label className = "text-sm">Logout</label>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header