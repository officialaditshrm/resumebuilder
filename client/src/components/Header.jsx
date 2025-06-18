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
        <div className = "h-20 text-xs shadow-[0_0_5px_1px_rgba(0,0,0,0.1)] fixed z-10 top-3 right-5 left-5 bg-neutral-800 flex rounded-2xl fixed justify-evenly">
            <div className = "flex flex-1 px-10">
                <button
                onClick={handleHome}
                className = "flex flex-col items-center justify-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                    <img className = "h-2/5" src = "home.svg"/>
                    <label>Home</label>
                </button>
                <button
                onClick={handleShowUsers}
                className = "flex flex-col items-center justify-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                    <img className = "h-2/5" src = "community.svg"/>
                    <label>Community</label>
                </button>
                <button
                onClick={handleMyResumes}
                className = "flex flex-col items-center justify-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                    <img className = "h-2/5" src = "adddoc.svg"/>
                    <label>My Resumes</label>
                </button>
            </div>
            <div className = "flex justify-end px-10">
                {!token &&
                <button
                onClick = {() => setShowLogin(true)}
                className = "flex flex-col justify-center items-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                    <img className = "h-2/5" src = "login.svg"/>
                    <label>Login</label>
                </button>
                }
                {token &&
                    <button
                    onClick = {(event) => {event.preventDefault()}}
                    className = "flex flex-col justify-center items-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                        <img className = "h-2/5" src = "profile.svg"/>
                        <label>Profile</label>
                    </button>
                }
                {token &&   
                    <button
                    onClick = {() => {setToken(""); localStorage.removeItem("resumeBuilderToken"); setLoggedInUser(null); navigate("/")}}
                    className = "flex flex-col justify-center items-center gap-1 rounded-2xl hover:bg-neutral-100/10 px-10">
                        <img className = "h-2/5" src = "logout.svg"/>
                        <label>Logout</label>
                    </button>
                }
            </div>
        </div>
    )
}

export default Header