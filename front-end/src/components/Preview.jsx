

function Preview ({resumeInView}) {
    return (
        <div
        className = "font-times leading-[18px] px-[5%] font-['Times_New_Roman',serif] text-[4px] sm:text-[8px] md:text-[12px] lg:text-[15px] bg-white text-black flex flex-col lg:w-[794px] md:w-[630px] sm:w-[420px] w-[210px] lg:min-h-[1123px] pb-[2%] md:min-h-[891px] sm:min-h-[594px] min-h-[297px]"
        id = "resumeview"
        >
            <header className = "flex-col break-inside-avoid-page text-center flex flex-col">
                <h1 id = "username" className = "font-extrabold mb-[7px] text-[175%]">
                    {resumeInView.username.toUpperCase()}
                </h1>
                <div className = "flex break-inside-avoid-page items-center mb-[3px] justify-center flex-wrap ">
                    {resumeInView.city}{resumeInView.state && ", "}
                    {resumeInView.state}{resumeInView.country && ", "}
                    {resumeInView.country}{resumeInView.pincode && " - "}
                    {resumeInView.pincode}
                </div>
                <div className = "flex break-inside-avoid-page justify-center flex-wrap text-[85%] gap-2">
                    {resumeInView.header_urls.map((header_url, headerindex) => {
                        return <div key = {headerindex}>
                            <a href = {header_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{header_url.name}</a>
                            {resumeInView.header_urls[headerindex+1] && " | "}
                        </div>
                    })}
                </div>
            </header>
            {resumeInView.summary &&
            <div>
                <h1 className = "font-bold break-inside-avoid-page border-b-[1.5px] pb-[4.5px] border-black whitespace-nowrap w-min text-[110%]">SUMMARY</h1>
                <p className = "pl-[1.5%] break-inside-avoid-page text-[90%]">{resumeInView.summary}</p>
            </div>
            }

            {/* EDUCATION */}
            <section id = "education" className = "pt-[1%]">
                <h1 className = "font-bold break-inside-avoid-page border-b-[1.5px] pb-[7.2px] border-black whitespace-nowrap w-min text-[110%]">EDUCATION</h1>
                {resumeInView.education.map((edu, education_index) => {
                    return <section key = {education_index} className = "pl-[1.5%] text-[90%]">
                        <header className = "relative break-inside-avoid-page w-full flex justify-between">
                            <div className = "flex gap-[5px]">
                                <h1 className = "flex items-center font-bold text-[110%]">
                                    {edu.institution}
                                </h1>
                            </div>
                        </header>
                        
                        <section className = "flex flex-col gap-[3px]">
                            {edu.qualifications.map((qfc, qfcindex) => {
                                return <div key = {qfcindex}>
                                    <header className = "break-inside-avoid-page flex justify-between italic">
                                        <div className = "flex flex-col max-w-[70%]">
                                            <h1>{qfc.name}</h1>
                                            {qfc.urls &&
                                                <div>
                                                    {qfc.urls.map((sss_url, sssurlindex) => {
                                                        return <div key = {sssurlindex} className = "flex">
                                                            <a href = {sss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{sss_url.name}</a>
                                                            {qfc.urls[sssurlindex+1] && " | "}
                                                        </div>
                                                    })}
                                                </div>
                                            }
                                            <div className = "flex  pl-[1%] flex-col">
                                                <p>{qfc.description}</p>
                                            </div>
                                        </div>
                                        
                                        <div className = "flex flex-col items-end max-w-[50%]">
                                            <div className = "flex">
                                                {new Date(qfc.start).toLocaleDateString("en-IN", {
                                                    year : "numeric",
                                                    month : "short",
                                                    day : "2-digit"
                                                })} {"-"} {!qfc.ongoing && qfc.end ? new Date(qfc.end).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric",
                                                    day: "2-digit"
                                                }) : "ongoing"}
                                            </div>
                                            {qfc.extras.length > 0 &&
                                            <div className = "flex flex-col items-end">
                                                {qfc.extras.map((extra, sssextraindex) => {
                                                    return <p key = {sssextraindex}>{extra}</p>
                                                })}
                                            </div>
                                            }
                                            {qfc.grades && qfc.grades}
                                        </div>
                                    </header>
                                </div>
                            })}
                        </section>
                    </section>
                })}
            </section>


            {/* PROFESSIONAL EXPERIENCE */}
            <section id = "experience" className = "pt-[1%]">
                <h1 className = "font-bold break-inside-avoid-page border-b-[1.5px] pb-[7.2px] border-black whitespace-nowrap w-min text-[110%]">PROFESSIONAL EXPERIENCE</h1>
                {resumeInView.experience.map((org, org_index) => {
                    return <section key = {org_index} className = "pl-[1.5%] mb-[7px] text-[90%]">
                        <header className = "break-inside-avoid-page relative w-full flex justify-between">
                            <div className = "flex gap-[5px]">
                                <h1 className = "flex items-center font-bold text-[110%]">
                                    {org.organization}
                                </h1>
                                <div className = "flex items-center">
                                    {org.urls.map((ss_url, ssurlindex) => {
                                        return <div key = {ssurlindex} className = "flex">
                                            <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{ss_url.name}</a>
                                            {org.urls[ssurlindex+1] && " | "}
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className = "italic flex flex-col">
                                {org.extras.length > 0 &&
                                <div className = "flex">
                                    {org.extras.map((extra, extraindex) => {
                                        return <p key = {extraindex}>{extra}</p>
                                    })}
                                </div>
                                }
                            </div>
                        </header>
                        <section className = "flex flex-col gap-[3px]">
                            {org.roles.map((role, roleindex) => {
                                return <div key = {roleindex} className = "mb-[5px]">
                                    <header className = "break-inside-avoid-page flex justify-between italic">
                                        <div className = "flex gap-[10px] max-w-[50%]">
                                            <h1>{role.rolename}</h1>
                                            {role.urls &&
                                                <div>
                                                    {role.urls.map((sss_url, sssurlindex) => {
                                                        return <div key = {sssurlindex} className = "flex">
                                                            <a href = {sss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{sss_url.name}</a>
                                                            {role.urls[sssurlindex+1] && " | "}
                                                        </div>
                                                    })}
                                                </div>
                                            }
                                        </div>
                                        <div className = "flex flex-col items-end max-w-[50%]">
                                            <div className = "flex">
                                                {new Date(role.start).toLocaleDateString("en-IN", {
                                                    year : "numeric",
                                                    month : "short"
                                                })} {"-"} {!role.ongoing && role.end ? new Date(role.end).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric"
                                                }) : "ongoing"}
                                            </div>
                                            {role.extras.length > 0 &&
                                            <div className = "flex flex-col items-end">
                                                {role.extras.map((extra, sssextraindex) => {
                                                    return <p key = {sssextraindex}>{extra}</p>
                                                })}
                                            </div>
                                            }
                                        </div>
                                    </header>
                                    <div className = "flex  pl-[1%] flex-col">
                                        <p className = "break-inside-avoid-page">{role.rolesummary}</p>
                                        <ul className = "flex flex-col">
                                            {role.points.map((point, pointindex) => {
                                                return <li className = "break-inside-avoid-page" key = {pointindex}>{"-"} {point}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            })}
                        </section>
                    </section>
                })}
                </section>

                {/* PROJECTS */}

                <section id = "projects" className = "pt-[1%] flex flex-col">
                    <h1 className = "font-bold break-inside-avoid-page border-b-[1.5px] pb-[7.2px] border-black whitespace-nowrap w-min text-[110%]">SELECTED PROJECTS</h1>
                    {resumeInView.projects.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] mb-[7px] text-[90%]">
                            <header className = "relative break-inside-avoid-page w-full flex justify-between">
                                <div className = "flex gap-[5px]">
                                    <h1 className = "flex items-center font-bold text-[110%]">
                                        {subsection.projectname}
                                    </h1>
                                    <div className = "flex items-center">
                                        {subsection.urls.map((ss_url, ssurlindex) => {
                                            return <div key = {ssurlindex} className = "flex">
                                                <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{ss_url.name}</a>
                                                {subsection.urls[ssurlindex+1] && " | "}
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className = "italic flex flex-col">
                                    {subsection.start &&
                                    <div>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "short",
                                            year : "numeric",
                                            day: "2-digit"
                                        })} {"-"} {!subsection.ongoing && subsection.end ? new Date(subsection.end).toLocaleDateString("en-IN", {
                                            month: "short",
                                            year: "numeric",
                                            day: "2-digit"
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
                            {subsection.stack &&
                                <div className = "italic break-inside-avoid-page">
                                    <div className = "flex">
                                        <h1 className = "font-bold">{subsection.stack.head}</h1>
                                        {subsection.stack.content && 
                                            <p>: {subsection.stack.content}</p>
                                        }
                                    </div>
                                </div>
                            }
                            {subsection.projectsummary && 
                                <p className = "break-inside-avoid">{subsection.projectsummary}</p>
                            }
                            {subsection.points && 
                                <ul className = "pl-[1%]">
                                    {subsection.points.map((sspoint, sspointindex) => {
                                        return <li className = "break-inside-avoid" key = {sspointindex}> {"-"} {sspoint}</li>
                                    })}
                                </ul>
                            }
                        </section>
                    })}
                </section>

                {/* SKILLS */}

                <section id = "skills" className = "pt-[1%]">
                    <h1 className = "font-bold break-inside-avoid border-b-[1.5px] pb-[7.2px] border-black whitespace-nowrap w-min text-[110%]">PROFESSIONAL SKILLS</h1>
                    {resumeInView.skills &&
                        <ul className = "pl-[1.5%] text-[90%] flex flex-col gap-[1px]">
                            {resumeInView.skills.map((minisection, minisectionindex) => {
                                return <li key = {minisectionindex} className = "flex break-inside-avoid flex-wrap">
                                    {minisection.head && <h1 className = "font-bold">{minisection.head}</h1>}
                                    {minisection.content && <p className = "mr-[4px]">:</p>}
                                    {minisection.content && <p>{minisection.content}</p>}
                                </li>
                            })}
                        </ul>
                    }
                </section>







            {/* EXTRA SECTIONS */}
            {resumeInView.extraSections.map((section, sectionindex) => {
                return <section key = {sectionindex} className = "pt-[2%]">
                    <h1 className = "font-bold break-inside-avoid border-b-[1.5px] pb-[7.2px] border-black whitespace-nowrap w-min text-[110%]">{section.sectionName.toUpperCase()}</h1>
                    {section.subsections.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] text-[90%]">
                            <header className = "relative break-inside-avoid-page w-full flex justify-between">
                                <div className = "flex gap-[5px] items-center">
                                    <h1 className = "flex items-center font-bold text-[110%]">
                                        {subsection.title}
                                    </h1>
                                    <div className = "flex items-center">
                                        {subsection.urls.map((ss_url, ssurlindex) => {
                                            return <div key = {ssurlindex} className = "flex">
                                                <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{ss_url.name}</a>
                                                {subsection.urls[ssurlindex+1] && " | "}
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className = "italic flex flex-col">
                                    {subsection.start &&
                                    <div>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "short",
                                            day: "2-digit",
                                            year : "numeric"
                                        })} {"-"} {!subsection.ongoing && subsection.end ? new Date(subsection.end).toLocaleDateString("en-IN", {
                                            month: "short",
                                            day: "2-digit",
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
                            {subsection.summary && 
                                <p className="break-inside-avoid">{subsection.summary}</p>
                            }
                            {subsection.points && 
                                <ul className = "pl-[1%]">
                                    {subsection.points.map((sspoint, sspointindex) => {
                                        return <li className="break-inside-avoid-page" key = {sspointindex}> {"-"} {sspoint}</li>
                                    })}
                                </ul>
                            }
                        </section>
                    })}
                </section>
            })}
        </div>
    )
}


export default Preview