import { useState, useEffect } from 'react'
import EditResume from './EditResume.jsx'

function Resume ({showResume, updateResume, setShowResume, currResumeData, setCurrResumeData}) {
    const [editResume, setEditResume] = useState(false)
    const [showWarning, setShowWarning]  = useState(false)

    useEffect(() => {
        console.log(currResumeData)
    }, [currResumeData])


    return (
        <div className = "w-full">
            {showWarning &&
                <Warning setShowWarning={setShowWarning} setEditResume={setEditResume}/>
            }
            {currResumeData &&
                <div className = "relative backdrop-blur rounded-2xl mb-10 w-full">
                    {!editResume ?
                    <div className = "flex gap-10 flex-col p-10 items-center">
                        <div className = "flex items-center flex-col">
                            <h1 className = "font-extrabold text-3xl">
                                {currResumeData.name}
                            </h1>
                            <div className = "text-neutral-400 text-xl">
                                {
                                currResumeData.private ?
                                    "(Private)"
                                    :
                                    "(Public)"
                                }
                            </div>
                        </div>
                        <div>
                            <button
                            onClick = {() => {setEditResume(true)}}
                            className = "bg-white px-3 py-2 rounded-md flex items-center font-bold text-black gap-2">
                                <img src = "/editblack.svg" /> EDIT RESUME
                            </button>
                        </div>
                        <button 
                        onClick = {() => {setShowResume(false); setCurrResumeData(null)}}
                        className = "absolute left-8 top-4 bg-white px-3 py-2 rounded-md flex text-black font-black">
                            <img src = "/leftarrowblack.svg" />GO BACK
                        </button>
                        

                        {/* HERE IS THE RESUME */}
                        {currResumeData && 
                        <div 
                        className = "font-times text-[4px] sm:text-[8px] md:text-[12px] lg:text-[16px] bg-white text-black flex flex-col lg:w-[840px] md:w-[630px] sm:w-[420px] w-[210px] lg:min-h-[1188px] md:min-h-[891px] sm:min-h-[594px] min-h-[297px]"
                        id = "resumeview"
                        >
                            <header className = "flex-col mx-[3%] border-b-[2px] pt-[3%] pb-[1%] border-black text-center flex flex-col">
                                <h1 id = "username" className = "font-extrabold text-[175%]">
                                    {currResumeData.username.toUpperCase()}
                                </h1>
                                <div className = "flex items-center justify-center flex-wrap ">
                                    {currResumeData.city}{currResumeData.state && ", "}
                                    {currResumeData.state}{currResumeData.country && ", "}
                                    {currResumeData.country}{currResumeData.pincode && " - "}
                                    {currResumeData.pincode}
                                </div>
                                <div className = "flex justify-center flex-wrap text-[90%] gap-2">
                                    {currResumeData.header_urls.map((header_url, headerindex) => {
                                        return <div key = {headerindex}>
                                            <a href = {header_url.url} target = "_blank" className = "underline">{header_url.name}</a>
                                            {currResumeData.header_urls[headerindex+1] && " | "}
                                        </div>
                                    })}
                                </div>
                            </header>
                            {currResumeData.summary &&
                            <div>
                                <h1 className = "font-bold underline text-[110%]">SUMMARY</h1>
                                <p className = "pl-[3%] text-[90%] pt-[1.2%]">{currResumeData.summary}</p>
                            </div>
                            }
                            {currResumeData.sections.map((section, sectionindex) => {
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
                    :
                    <div className = "relative flex flex-col gap-10 text-white items-center p-10">
                        <button 
                        onClick = {() => setShowWarning(true)}
                        className = "absolute left-4 top-4 px-3 py-2 bg-black font-bold rounded-md flex gap-1">
                            <img src = "/closewhite.svg" /> DISCARD
                        </button>
                        
                        <h1 className = "font-extrabold text-black text-4xl">
                            Edit Resume
                        </h1>
                        <EditResume updateResume = {updateResume} currResumeData = {currResumeData} />
                    </div>}
                </div>
            }
        </div>
    )
}

export default Resume

function Warning ({setShowWarning, setEditResume}) {
    return (
        <div className = "z-40 top-0 left-0 backdrop-blur h-screen fixed w-screen bg-white/30 flex flex-col items-center justify-center">
            <div className = "bg-white p-10 rounded-xl text-black flex flex-col gap-5">
                <p>File not saved yet. Do you want to discard the progress?</p>
                <div className = "flex justify-evenly">
                    <button 
                    onClick = {() => {setShowWarning(false)}}
                    className = "px-3 py-2 bg-neutral-200 font-bold">
                        Cancel
                    </button>
                    <button 
                    onClick = {() => {setShowWarning(false); setEditResume(false)}}
                    className = "px-3 py-2 bg-red-500 text-white font-bold">
                        Discard
                    </button>
                </div>
            </div>
        </div>
    )
}