import SubSubSection from "./SubSubSection.jsx"
import TinySection from "./TinySection.jsx"

function SubSection ({subsection}) {
    return (
        <div className = "flex flex-col gap-3 p-5 w-full">
            <div className = "subsectionhead flex flex-col gap-1 items-center w-full">
                <label className = "font-bold">Sub-Section Head</label>
                <textarea value = {subsection.head} className = "p-2 rounded-md w-full" required/>
            </div>
            <div className = "timeline flex w-full flex-col items-center">
                <div className = "flex gap-2 items-center justify-evenly w-full">
                    <div className = "flex items-center gap-2">
                        <label className = "font-bold">Start Date</label>
                        {subsection.start ? 
                            <input type = "month" value={new Date(subsection.start).toISOString().slice(0, 7)} className = "p-2 rounded-md"/>
                            :
                            <button
                            className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                                ADD START DATE
                            </button>
                        }
                    </div>
                    <div className = "flex items-center gap-2">
                        <label className = "font-bold">End Date</label>
                        {subsection.end ? 
                            <input type = "month" value={new Date(subsection.start).toISOString().slice(0, 7)} className = "p-2 rounded-md"/>
                            :
                            <button
                            className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                                ADD END DATE
                            </button>
                        }
                    </div>
                    <div className = "flex gap-2">
                        <input type = "checkbox" />Ongoing
                    </div>
                </div>
            </div>
            <div className = "subsectionsummary flex flex-col gap-1 items-center w-full">
                <label className = "font-bold">Sub-Section Summary</label>
                {subsection.summary !== undefined ?
                    <textarea value = {subsection.summary} className = "p-2 rounded-md w-full"/>
                    :
                    <button
                    className = "flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                        ADD SUB-SECTION SUMMARY
                    </button>
                }
            </div>
            <div className = "subsubsections flex flex-col  w-full gap-2">
                <label className = "font-bold">Sub-Sub-Sections:</label>
                <div className = "gap-2 grid grid-cols-2">
                    {subsection.subsubsections.map((subsubsection, subsubsection_index) => {
                        return <div key = {subsubsection_index} className = "bg-white/40 p-5 rounded-lg w-full">
                            <SubSubSection subsubsection = {subsubsection}/>
                        </div>
                    })}
                    <button
                    className = "headerurladd flex gap-3 items-center bg-white text-black justify-center p-2 rounded-lg font-extrabold"><img src = "/editblack.svg"/>
                        ADD SUB-SUB-SECTION
                    </button>
                </div>
            </div>
            <div className = "tinysections flex flex-col  w-full gap-2">
                <label className = "font-bold">Tiny-Sections:</label>
                <div className = "grid gap-4 grid-cols-2">
                    {subsection.minisections.map((tinysection, tinysection_index) => {
                        return <div key = {tinysection_index} className = "bg-white/40 p-5 rounded-lg w-full">
                            <TinySection tinysection = {tinysection}/>
                        </div>
                    })}
                    <button
                    className = "tinysectionadd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold">
                        <img src = "/edit.svg"/>
                        ADD TINY-SECTION
                    </button>
                </div>
            </div>
            <div className = "points flex flex-col gap-3">
                <label className = "font-bold ">Points:</label>
                {subsection.points && 
                    subsection.points.map((point, pointindex) => {
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
                <div className = "grid grid-cols-3 gap-3">
                    {subsection.extras && 
                        subsection.extras.map((extra, extraindex) => {
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

export default SubSection