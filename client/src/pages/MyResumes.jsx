function MyResumes ({allResumes, loggedInUser}) {
    

    return (
        <div className = "pt-24 min-h-screen bg-blue-950 flex flex-col">
            <div className = "flex justify-center">
                <h1 className = "text-6xl font-extrabold">My Resumes</h1> 
                <button className = "border"><img className = "size-full" src = "adddoc.svg" /></button>
            </div>
        </div>
    )
}

export default MyResumes