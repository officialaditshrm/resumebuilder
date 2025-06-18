import { useEffect, useState } from 'react'
import Url from './resumecomponents/Url.jsx'
import Section from './resumecomponents/Section.jsx'

function EditResume ({currResumeData}) {
    const [resumeDataCopy, setResumeDataCopy] = useState(currResumeData)

    // FUNCTIONS FOR SECTIONS
    const addSection = (array) => {
        const updatedSections = [...array, {
        }]
        setResumeDataCopy((prevstate) => ({
            ...prevstate,
            sections : updatedSections
        }))
    }

    // FUNCTIONS FOR HEADER URLS
    const addHeaderUrl = (array) => {
        const updatedUrls = [...array, {
            name : "",
            url : ""
        }]
        setResumeDataCopy((prevState) => ({
            ...prevState,
            header_urls: updatedUrls
        }))
    }

    const removeHeaderUrl = (array, index) => {
        const updatedUrls = [...array]
        updatedUrls.splice(index, 1)
        setResumeDataCopy((prevState) => ({
            ...prevState,
            header_urls: updatedUrls
        }))
    }

    // FUNCTIONS FOR RESUME-SUMMARY
    const addResumeSummary = () => {
        setResumeDataCopy((prevState) => ({
            ...prevState,
            summary: ""
        }))
    }
    const removeResumeSummary = () => {
        setResumeDataCopy((prevState) => ({
            ...prevState,
            summary: undefined
        }))
    }

    return (
        <div className = "w-full rounded-md text-black p-5 flex flex-col items-center gap-20">
            <form className = "text-[16px] p-10 text-lg rounded-xl flex flex-col gap-5 w-full" onSubmit = {(event) => event.preventDefault()}>
                <div className = "flex flex-col gap-5">
                    <div className = "flex w-full justify-evenly items-start">
                        <div id = "resumename" className = "flex flex-1 gap-2 items-start justify-center">
                            <label className = "font-bold">RESUME NAME:</label>
                            <textarea className = "p-2 rounded-md flex-1 border border-black" required name = "name" value = {resumeDataCopy.name} placeholder = "Web Developer Resume"/>
                        </div>
                        <div id = "username" className = "flex flex-1 gap-2 justify-center items-center">
                            <label className = "font-bold">APPLICANT NAME:</label>
                            <input className = "p-2 rounded-md border border-black" type = "text" required value = {resumeDataCopy.username} name = "username" placeholder = "John Doe"/>
                        </div>
                    </div>
                    <div id = "headerurls" className = "flex flex-col gap-2">
                        <h1 className = "font-bold">HEADER URLs:</h1>
                        <div className = "grid grid-cols-2 gap-4 px-4">
                            {resumeDataCopy.header_urls &&
                            resumeDataCopy.header_urls.map((header_url, header_url_index) => {
                                return <div key = {header_url_index} className = "relative p-5 bg-black/20 rounded-lg">
                                    <Url url = {header_url} resumeDataCopy = {resumeDataCopy} />
                                    <button
                                    onClick = {() => removeHeaderUrl(resumeDataCopy.header_urls, header_url_index)}
                                    className = "top-3 right-3 absolute"><img src = "/close.svg" /></button>
                                </div>
                            })
                            }
                            <button
                            onClick = {() => addHeaderUrl(resumeDataCopy.header_urls)}
                            className = "headerurladd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>ADD URL</button>
                        </div>
                    </div>
                    <div id = "resumesummary" className = "flex flex-col gap-2">
                        <h1 className = "font-bold">RESUME SUMMARY:</h1>
                        {resumeDataCopy.summary !== undefined ?
                            <>
                            <textarea value = {resumeDataCopy.summary} className = "mx-4 p-2 rounded-md"/>
                            <button
                            onClick = {() => removeResumeSummary()}
                            className = "mx-4 rounded-lg p-3 bg-black text-white font-extrabold flex items-center justify-center"><img src = "/closewhite.svg" />REMOVE RESUME SUMMARY</button>
                            </>
                            :
                            <button
                            onClick = {() => addResumeSummary()}
                            className = "mx-4 rounded-lg p-3 bg-black text-white font-extrabold flex items-center justify-center"><img src = "/edit.svg" />ADD RESUME SUMMARY</button>
                        }
                    </div>
                    <div id = "sections" className = "flex flex-col gap-4">
                        <h1 className = "font-extrabold text-4xl">SECTIONS:</h1>
                        <div className = "flex flex-col gap-20">
                            {resumeDataCopy.sections.map((section, section_index) => {
                                return <div key = {section_index} className = "relative p-5  rounded-2xl bg-black/40">
                                    <Section section = {section} setResumeDataCopy = {setResumeDataCopy} resumeDataCopy = {resumeDataCopy} section_index = {section_index}/>
                                    <button
                                    className = "top-3 right-3 absolute"><img src = "/close.svg" /></button>
                                </div>
                            })}
                        </div>
                        <button
                        onClick = {() => addSection(resumeDataCopy.sections)}
                        className = "headerurladd flex gap-3 items-center bg-black text-white justify-center p-2 rounded-lg font-extrabold"><img src = "/edit.svg"/>
                            ADD SECTION
                        </button>
                    </div>
                </div>
                <button
                className = "px-3 py-2 text-black flex gap-1 items-center font-bold bg-white rounded-xl">
                    <img src = "/saveblack.svg" />SAVE
                </button>
            </form>


            



            {resumeDataCopy && 
                <div 
                className = "shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] font-times text-[4px] sm:text-[8px] md:text-[12px] lg:text-[16px] bg-white text-black flex flex-col lg:w-[840px] md:w-[630px] sm:w-[420px] w-[210px] lg:min-h-[1188px] md:min-h-[891px] sm:min-h-[594px] min-h-[297px]"
                id = "resumeview"
                >
                    <header className = "flex-col mx-[3%] border-b-[1px] pt-[3%] pb-[1%] border-black text-center flex flex-col">
                        <h1 id = "username" className = "font-extrabold text-[175%]">
                            {resumeDataCopy.username.toUpperCase()}
                        </h1>
                        <div className = "flex items-center justify-center flex-wrap ">
                            {resumeDataCopy.city}{resumeDataCopy.state && ", "}
                            {resumeDataCopy.state}{resumeDataCopy.country && ", "}
                            {resumeDataCopy.country}{resumeDataCopy.pincode && " - "}
                            {resumeDataCopy.pincode}
                        </div>
                        <div className = "flex justify-center flex-wrap text-[90%] gap-2">
                            {resumeDataCopy.header_urls.map((header_url, headerindex) => {
                                return <div key = {headerindex}>
                                    <a href = {header_url.url} target = "_blank" className = "underline">{header_url.name}</a>
                                    {resumeDataCopy.header_urls[headerindex+1] && " | "}
                                </div>
                            })}
                        </div>
                    </header>
                    {resumeDataCopy.summary &&
                    <div>
                        <h1 className = "font-bold underline text-[110%]">SUMMARY</h1>
                        <p className = "pl-[3%] text-[90%] pt-[1.2%]">{resumeDataCopy.summary}</p>
                    </div>
                    }
                    {resumeDataCopy.sections.map((section, sectionindex) => {
                        return <section key = {sectionindex} className = "mx-[3%] pt-[1%]">
                            <h1 className = "font-bold underline text-[110%]">{section.head.toUpperCase()}</h1>
                            {section.subsections.map((subsection, subsectionindex) => {
                                return <section key = {subsectionindex} className = "pl-[3%] text-[90%] pt-[1.2%]">
                                    <header className = "relative w-full flex justify-between">
                                        <div className = "flex gap-[5px]">
                                            <h1 className = "flex items-center font-bold text-[110%]">
                                                {subsection.head}
                                            </h1>
                                            <div className = "flex items-center">
                                                {subsection.urls.map((ss_url, ssurlindex) => {
                                                    return <div key = {ssurlindex} className = "flex">
                                                        <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "underline">{ss_url.name}</a>
                                                        {subsection.urls[ssurlindex+1] && " | "}
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                        <div className = "italic flex flex-col">
                                            {subsection.start &&
                                            <div>
                                                {new Date(subsection.start).toLocaleDateString("en-IN", {
                                                    month: "long",
                                                    year : "numeric"
                                                })} {"-"} {subsection.end ? new Date(subsection.end).toLocaleDateString("en-IN", {
                                                    month: "long",
                                                    year: "numeric"
                                                }) : "ongoing"}
                                            </div>
                                            }
                                            {subsection.extras.length > 0 &&
                                            <div className = "flex">
                                                {subsection.extras.map((extra, extraindex) => {
                                                    return <p key = {extraindex}>{extra}</p>
                                                })}
                                            </div>
                                            }
                                        </div>
                                    </header>
                                    
                                    <section className = "flex flex-col gap-[3px]">
                                        {subsection.subsubsections.map((subsubsection, subsubsectionindex) => {
                                            return <div key = {subsubsectionindex}>
                                                <header className = "flex justify-between italic">
                                                    <div className = "flex gap-[10px] max-w-[50%]">
                                                        <h1>{subsubsection.head}</h1>
                                                        {subsubsection.urls &&
                                                            <div>
                                                                {subsubsection.urls.map((sss_url, sssurlindex) => {
                                                                    return <div key = {sssurlindex} className = "flex">
                                                                        <a href = {sss_url.url} target = "_blank" className = "underline">{sss_url.name}</a>
                                                                        {subsubsection.urls[sssurlindex+1] && " | "}
                                                                    </div>
                                                                })}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className = "flex flex-col items-end max-w-[50%]">
                                                        <div className = "flex">
                                                            {new Date(subsubsection.start).toLocaleDateString("en-IN", {
                                                                year : "numeric",
                                                                month : "long"
                                                            })} {"-"} {subsubsection.end ? subsubsection.end : "ongoing"}
                                                        </div>
                                                        {subsubsection.extras.length > 0 &&
                                                        <div className = "flex flex-col items-end">
                                                            {subsubsection.extras.map((extra, sssextraindex) => {
                                                                return <p key = {sssextraindex}>{extra}</p>
                                                            })}
                                                        </div>
                                                        }
                                                    </div>
                                                </header>
                                                <div className = "pl-[2%] flex flex-col">
                                                    <p>{subsubsection.summary}</p>
                                                    <ul className = "flex flex-col">
                                                        {subsubsection.points.map((point, pointindex) => {
                                                            return <li key = {pointindex}>{"-"} {point}</li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        })}
                                    </section>
                                    {subsection.minisections &&
                                        <div className = "pl-[1%] italic">
                                            {subsection.minisections.map((minisection, minisectionindex) => {
                                                return <div key = {minisectionindex} className = "flex">
                                                    <h1 className = "font-bold">{minisection.head}</h1>
                                                    {minisection.content && 
                                                        <p>: {minisection.content}</p>
                                                    }
                                                </div>
                                            })}
                                        </div>
                                    }
                                    {subsection.summary && 
                                        <p className = "pl-[1%]">{subsection.summary}</p>
                                    }
                                    {subsection.points && 
                                        <ul className = "pl-[1%]">
                                            {subsection.points.map((sspoint, sspointindex) => {
                                                return <li key = {sspointindex}> {"-"} {sspoint}</li>
                                            })}
                                        </ul>
                                    }
                                </section>
                            })}
                            {section.minisections &&
                                <ul className = "pl-[3%] text-[90%] flex flex-col gap-[1px] pt-[1%]">
                                    {section.minisections.map((minisection, minisectionindex) => {
                                        return <li key = {minisectionindex} className = "flex flex-wrap">
                                            {minisection.head && <h1 className = "font-bold">{minisection.head}</h1>}
                                            {minisection.content && <p className = "mr-[4px]">:</p>}
                                            {minisection.content && <p>{minisection.content}</p>}
                                        </li>
                                    })}
                                </ul>
                            }
                        </section>
                    })}
                </div>
                }
        </div>
    )
}

export default EditResume

