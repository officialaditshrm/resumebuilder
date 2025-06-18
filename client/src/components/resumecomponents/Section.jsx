import SubSection from "./SubSection.jsx"
import MiniSection from './MiniSection.jsx'

function Section ({section, setResumeDataCopy, resumeDataCopy, section_index}) {

    const addSectionSummary = () => {
        const sectionsarraycopy = [...resumeDataCopy.sections]
        const sectioncopy = {...section}
        sectioncopy.summary = ""
        sectionsarraycopy.splice(section_index, 1, sectioncopy)
        setResumeDataCopy((prevstate) => ({
            ...prevstate,
            sections : sectionsarraycopy
        }))
    }

    const updateSectionHead = (event) => {
        const sectioncopy = {...section}
        sectioncopy.head = event.target.value
        const sectionsarraycopy = [...resumeDataCopy.sections]
        sectionsarraycopy.splice(section_index, 1, sectioncopy)
        setResumeDataCopy((prevstate) => ({
            ...prevstate,
            sections : sectionsarraycopy
        }))
    }
    
    const updateSectionSummary = (event) => {
        const sectioncopy = {...section}
        sectioncopy.summary = event.target.value
        const sectionsarraycopy = [...resumeDataCopy.sections]
        sectionsarraycopy.splice(section_index, 1, sectioncopy)
        setResumeDataCopy((prevstate) => ({
            ...prevstate,
            sections : sectionsarraycopy
        }))
    }

    return (
        <div className = "p-5 flex gap-3 flex-col items-center">
            <h1 className = "font-extrabold text-4xl">SECTION-{section_index + 1}</h1>
            <div className = "sectionhead flex items-center w-full gap-2">
                <label className = "font-bold">Section-Head:</label>
                <input required onChange = {(event) => updateSectionHead(event)} type = "text" className = "p-2 rounded-md flex-1" value = {section.head}/>
            </div>
            <div className = "sectionsummary flex flex-col items-center w-full gap-2">
                <label className = "font-bold">Section-Summary:</label>
                {section.summary !== undefined ?
                    <textarea
                    onChange = {(event) => updateSectionSummary(event)}
                    className = "p-2 rounded-md w-full" value = {section.summary}/>
                    :
                    <button
                    onClick = {() => addSectionSummary()}
                    className = "headerurladd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>ADD SECTION SUMMARY</button>
                }
            </div>
            <div className = "subsections flex flex-col  w-full gap-2">
                <label className = "font-bold">Sub-Sections:</label>
                <div className = "flex gap-4 flex-col">
                    {section.subsections.map((subsection, subsection_index) => {
                        return <div key = {subsection_index} className = "bg-white/40 p-5 rounded-lg w-full">
                            <SubSection subsection = {subsection}/>
                        </div>
                    })}
                    <button
                        className = "subsectionadd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>ADD SUB-SECTION
                    </button>
                </div>
            </div>
            <div className = "minisections flex flex-col  w-full gap-2">
                <label className = "font-bold">Mini-Sections:</label>
                <div className = "grid gap-4 grid-cols-2">
                    {section.minisections.map((minisection, minisection_index) => {
                        return <div key = {minisection_index} className = "bg-white/40 p-5 rounded-lg w-full">
                            <MiniSection minisection = {minisection}/>
                        </div>
                    })}
                    <button
                        className = "minisectionadd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>ADD MINI-SECTION
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Section