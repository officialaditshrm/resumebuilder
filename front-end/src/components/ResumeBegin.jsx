function ResumeBegin ({untitledResume, setUntitledResume, createResume, setResumeBegin}) {

    return (
        <div className = "fixed z-50 top-0 left-0 h-screen w-screen bg-neutral-100/30 items-center flex flex-col justify-center backdrop-blur">
            <form
            onSubmit = {(event) => {
                event.preventDefault(); 
                createResume(untitledResume);
                setUntitledResume(null);
                setResumeBegin(false);
            }}
            className = "p-4 sm:p-8 min-w-[50%] max-sm:text-sm gap-8 shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] bg-neutral-100 rounded-xl flex flex-col">
                <div className = "flex flex-col gap-2">
                    <label className = "font-semibold">Resume Name:</label>
                    <input
                    autoFocus
                    type = "text"
                    name = "name"
                    className = "p-2 max-sm:p-1 rounded-lg shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
                    value = {untitledResume.name}
                    onChange = {(event) => {const updatedUR = {...untitledResume}; updatedUR.name = event.target.value; setUntitledResume(updatedUR)}}
                    />
                </div>
                <div className = "flex flex-col gap-2">
                    <label className = "font-semibold">Applicant Name:</label>
                    <input
                    type = "text"
                    name = "username"
                    className = "p-2 rounded-lg shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
                    value = {untitledResume.username}
                    onChange = {(event) => {const updatedUR = {...untitledResume}; updatedUR.username = event.target.value; setUntitledResume(updatedUR)}}
                    />
                </div>
                <div className = "flex items-center justify-center gap-2">
                    <button
                    type = "button"
                    onClick = {(event) => {event.preventDefault(); const updateUR = {...untitledResume}; updateUR.private = !untitledResume.private; setUntitledResume(updateUR)}}
                    className = {`w-[50px] shadow-[0_0_3px_1px_rgba(0,0,0,0.25)] rounded-full h-[30px] flex ${untitledResume.private ? "bg-green-400" : "bg-red-400"} items-center`}>
                        <div className = {`${untitledResume.private && "translate-x-[20px]"} rounded-full w-[26px] ml-[2px] h-[26px] bg-white shadow-[0_0_3px_1px_rgba(0,0,0,0.15)]`}></div>
                    </button>
                    <label className = "font-bold text-sm text-neutral-500">{untitledResume.private ? "PRIVATE" : "PUBLIC"}</label>
                </div>
                <div className = "flex justify-evenly text-sm">
                    <button
                    type = "button"
                    className = "px-2 rounded-md py-1 bg-neutral-800 text-white font-semibold" 
                    id = "cancelresumebegin" 
                    onClick={() => {setUntitledResume(null); setResumeBegin(false)}}>
                        CANCEL
                    </button>
                    <button
                    type = "submit"
                    className = "px-2 py-1 hover:cursor-pointer bg-blue-900 rounded-md text-white font-semibold" 
                    id = "cancelresumebegin"
                    >
                        BUILD
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResumeBegin