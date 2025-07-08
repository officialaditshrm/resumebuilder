import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing({loggedInUser, allResumes, fetchUsers, allUsers, darkMode}) {
    const navigate = useNavigate()


    useEffect (() => {
        fetchUsers()
    }, [])



    return (

        <div className = {`md:ml-72 sm:mt-[20vh] mt-[10vh] min-h-screen flex px-4 pt-4 sm:px-8 md:px-12 gap-8 flex-col items-center`}>
            <div className = "flex flex-col gap-8 items-center">
                <img className = "w-3/5 sm:w-2/5" src = {darkMode ? "logotransparentdark.png" : "/logotransparent.png"}/>

                <div className = "bg-[url('/wallpaper.jpg')] flex flex-col gap-4 rounded-xl  w-full p-8 text-white bg-cover">
                    <h1 className = "font-extrabold text-xl sm:text-2xl text-center">Welcome to Resolute!</h1>
                    <ul className = "flex flex-col max-sm:text-sm gap-2">
                        <li>Build multiple resumes</li>
                        <li>Share with the community</li>
                        <li>Get your ATS Score</li>
                        <li>Fit the job-description</li>
                        <li>Get AI-based suggestions</li>
                        <li>Free Resume Exports</li>
                    </ul>
                </div>
            </div>
            <div className = "text-center flex flex-col items-center gap-4">
                <h1 className = "font-bold text-xl sm:text-2xl">
                    Our Community
                </h1>
                <div className = "flex flex-col gap-2 italic">
                    <div className = "flex gap-2 flex-wrap">
                        <p>Current User-count:</p><p className = "text-green-600">{allUsers?.length}</p>
                    </div>
                    <div className = "flex gap-2 flex-wrap">
                        <p>Current Public-Resume Count:</p><p className = "text-green-600">{allResumes?.filter((resume) => resume.private === false).length}</p>
                    </div>
                </div>
            </div>
            <button onClick = {() => navigate('/myresumes')} className = "bg-green-600 hover:bg-green-700 text-white p-2 font-bold shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)] rounded-md">
                Get Started!
            </button>
        </div>
    )
}

export default Landing