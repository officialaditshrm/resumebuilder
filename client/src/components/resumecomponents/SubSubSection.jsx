

function Subsubsection ({subsubsection}) {
    return (
        <div className = "flex flex-col gap-3 p-5 w-full">
            <div className = "subsubsectionhead flex flex-col gap-1 items-center w-full">
                <label className = "font-bold">Sub-Sub-Section Head</label>
                <textarea value = {subsubsection.head} className = "p-2 rounded-md w-full" required/>
            </div>
            <div className = "timeline flex w-full flex-col items-center">
                <div className = "flex flex-col gap-2 items-center justify-evenly w-full">
                    <div className = "flex items-center gap-2">
                        <label className = "font-bold">Start Date</label>
                        {subsubsection.start ? 
                            <input type = "month" value={new Date(subsubsection.start).toISOString().slice(0, 7)} className = "p-2 rounded-md"/>
                            :
                            <button
                            className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                                ADD START DATE
                            </button>
                        }
                    </div>
                    <div className = "flex items-center gap-2">
                        <label className = "font-bold">End Date</label>
                        {subsubsection.end ? 
                            <input type = "month" value={new Date(subsubsection.start).toISOString().slice(0, 7)} className = "p-2 rounded-md"/>
                            :
                            <button
                            className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                                ADD END DATE
                            </button>
                        }
                    </div>
                    <div className = "flex gap-2">
                        <input type = "checkbox" value = {subsubsection.ongoing}/>Ongoing
                    </div>
                </div>
            </div>
            <div className = "subsubsectionsummary flex flex-col gap-1 items-center w-full">
                <label className = "font-bold">Sub-Sub-Section Summary</label>
                {subsubsection.summary !== undefined ?
                    <textarea value = {subsubsection.summary} className = "p-2 rounded-md w-full"/>
                    :
                    <button
                    className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                        ADD Sub-Sub-Section SUMMARY
                    </button>
                }
            </div>
            <div className = "points flex flex-col gap-3">
                <label className = "font-bold ">Points:</label>
                {subsubsection.points && 
                    subsubsection.points.map((point, pointindex) => {
                        return <div key = {pointindex} className = "flex flex-col gap-3">
                            <textarea value = {point} className = "rounded-md p-2"/>
                        </div>
                    } )
                }
                <button
                className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                    ADD POINT
                </button>
            </div>
            <div className = "extras flex flex-col gap-3">
                <label className = "font-bold ">Extras:</label>
                <div className = "grid grid-cols-2 gap-3">
                    {subsubsection.extras && 
                        subsubsection.extras.map((extra, extraindex) => {
                            return <div key = {extraindex} className = "flex flex-col gap-3">
                                <textarea value = {extra} className = "rounded-md p-2"/>
                            </div>
                        } )
                    }
                    <button
                    className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                        ADD EXTRA TAG
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Subsubsection