import { useState, useEffect } from 'react'

function Resume ({showResume, setShowResume, currResumeData, setCurrResumeData}) {
    
    useEffect(() => {
        console.log(currResumeData)
    }, [currResumeData])

    return (
        <div
        style={{ overflowY: "auto" }} // Allow scrolling
        className = "">
            <div className = "relative backdrop-blur p-10 gap-10 flex flex-col items-center bg-white/10 rounded-2xl mb-10">
                
                {currResumeData &&
                <h1 className = "font-extrabold text-3xl">
                    {currResumeData.name}
                </h1>
                }
                
                <button 
                onClick = {() => {setShowResume(false)}}
                className = "absolute right-4 top-4">
                    <img src = "/closewhite.svg" className = "w-10 h-10" />
                </button>
                <button className = "bg-white text-black font-bold px-3 py-2 rounded-2xl">EDIT RESUME</button>



                {/* HERE IS THE RESUME */}
                {currResumeData && <div 
                className = "text-[4px] sm:text-[8px] md:text-[12px] lg:text-[16px] bg-white text-black flex p-6 flex-col lg:w-[840px] md:w-[630px] sm:w-[420px] w-[210px] lg:h-[1188px] md:h-[891px] sm:h-[594px] h-[297px] overflow-y-auto"
                id = "resumeview"
                >
                    <header className = "flex-col border-b-2 pb-3 border-black text-center flex flex-col">
                        <h1 id = "username" className = "font-bold text-[150%]">
                            {currResumeData.username}
                        </h1>
                        <div className = "flex items-center justify-center text-[70%] flex-wrap gap-4">
                            {currResumeData.city}{currResumeData.state && ", "}
                            {currResumeData.state}{currResumeData.country && ", "}
                            {currResumeData.country}{currResumeData.pincode && " - "}
                            {currResumeData.pincode}
                        </div>
                        <div className = "flex justify-center flex-wrap text-[65%] gap-2">
                            {currResumeData.header_urls.map((header_url, index) => {
                                return <div>
                                    <a key = {index} href = {header_url.url} target = "_blank" className = "underline">{header_url.name}</a>
                                    {currResumeData.header_urls[index+1] && " | "}
                                </div>
                            })}
                        </div>
                    </header>

                    {currResumeData.sections.map((section, sectionindex) => {
                        return <section key = {sectionindex}>
                            <h1 className = "font-bold underline text-[100%]">{section.head}</h1>
                            {section.subsections.map((subsection, subsectionindex) => {
                                return <section key = {subsectionindex} className = "pl-[5%]">
                                    <header className = "relative w-full flex justify-between ">
                                        <div className = "flex gap-[2px]">
                                            <h1 className = "text-[75%] flex items-center font-bold">
                                                {subsection.head}
                                            </h1>
                                            <div className = "flex items-center text-[60%]">
                                                {"( "}{subsection.urls.map((ss_url, ssurlindex) => {
                                                        return <div className = "flex">
                                                            <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "underline">{ss_url.name}</a>
                                                            {subsection.urls[ssurlindex+1] && " | "}
                                                        </div>
                                                    })}{" )"}
                                            </div>
                                        </div>
                                        <div className = "text-[60%]">
                                            {subsection.start} {"to"} {subsection.end ? subsection.end : "ongoing"}
                                        </div>
                                    </header>
                                    
                                    {subsection.subsubsections.map((subsubsection) => {
                                        return <div className = "pl-[3%]">
                                            <header>
                                                <div className = "flex items-center">
                                                    <h1 className = "flex items-center">{subsubsection.head}</h1>
                                                    <div className = "flex items-center text-[60%]">
                                                        {"( "}{subsubsection.urls.map((sss_url, sssurlindex) => {
                                                                return <div className = "flex">
                                                                    <a key = {sssurlindex} href = {sss_url.url} target = "_blank" className = "underline">{sss_url.name}</a>
                                                                    {subsubsection.urls[sssurlindex+1] && " | "}
                                                                </div>
                                                            })}{" )"}
                                                    </div>
                                                </div>
                                            </header>
                                        </div>
                                    })}

                                </section>
                            })}
                        </section>
                    })}
                    


                </div>}


            </div>
        </div>
    )
}

export default Resume