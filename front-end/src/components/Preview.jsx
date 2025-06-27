function Preview ({resumeInView}) {
    return (
        <div
        className = "font-times shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] leading-[120%] px-[4%] font-['Times_New_Roman',serif] text-[4.5px] min-[396px]:text-[6.9px] md:text-[9px] lg:text-[12px] bg-white text-black flex flex-col w-[240px] min-h-[339px] lg:w-[595px] md:w-[476px] min-[396px]:w-[357px] py-[5%] lg:min-h-[841px] md:min-h-[693px] min-[396px]:min-h-[505px]"
        id = "resumeview"
        >
            <header className = "flex-col break-inside-avoid-page text-center flex flex-col">
                <h1 id = "username" className = "font-extrabold mb-[1%] text-[175%]">
                    {resumeInView.username.toUpperCase()}
                </h1>
                <div className = "flex break-inside-avoid-page items-center mb-[1%] justify-center flex-wrap ">
                    {resumeInView.city}{resumeInView.state && ", "}
                    {resumeInView.state}{resumeInView.country && ", "}
                    {resumeInView.country}{resumeInView.pincode && " - "}
                    {resumeInView.pincode}
                </div>
                <div className = "flex break-inside-avoid-page justify-center flex-wrap text-[85%] gap-[1%]">
                    {resumeInView.phonenum !== "" && <p className = "flex items-center gap-[1px]"><label className = "bg-black">{resumeInView.phonenum}</label>{(resumeInView.email || resumeInView.header_urls?.length > 0) && " | "}</p>}
                    {resumeInView.email && <p><a className = "text-blue-900 font-bold italic" href = {`mailto:${resumeInView.email}`}>{resumeInView.email}</a>{resumeInView.header_urls.length > 0 && " |"}</p>}
                    {resumeInView.header_urls.map((header_url, headerindex) => {
                        return <div key = {headerindex} className = "flex gap-[1px]">
                            <a href = {header_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{header_url.name}</a>
                            {resumeInView.header_urls[headerindex+1] && " | "}
                        </div>
                    })}
                </div>
            </header>
            {resumeInView.summary &&
            <div>
                <h1 className = "font-bold break-inside-avoid-page underline text-[110%]">SUMMARY</h1>
                <p className = "pl-[1.5%] break-inside-avoid-page text-[90%]">{resumeInView.summary}</p>
            </div>
            }

            {/* EDUCATION */}
            {resumeInView.education.length > 0 && <section id = "education" className = "pt-[1%] border-t mt-[1%] border-black">
                <h1 className = "font-extrabold text-center text-[90%] break-inside-avoid-page mb-[1%]">EDUCATION</h1>
                {resumeInView.education.map((edu, education_index) => {
                    return <section key = {education_index} className = "pl-[1.5%] break-inside-avoid-page text-[90%]">
                        <header className = "relative w-full flex justify-between">
                            <div className = "flex gap-[5px]">
                                <h1 className = "flex items-center font-bold text-[110%]">
                                    {edu.institution}
                                </h1>
                            </div>
                        </header>
                        
                        <section className = "flex flex-col gap-[3px]">
                            {edu.qualifications.map((qfc, qfcindex) => {
                                return <div key = {qfcindex}>
                                    <header className = "flex justify-between italic">
                                        <div className = "flex flex-col w-[70%]">
                                            <div className = "flex gap-[15px]">
                                                <h1 className = "text-[110%]">{qfc.name}</h1>
                                                {qfc.urls &&
                                                    <div className = "flex flex-wrap mt-[1.5%] items-center gap-[3px]">
                                                        {qfc.urls.map((sss_url, sssurlindex) => {
                                                            return <div key = {sssurlindex} className = "flex items-center gap-[3px]">
                                                                <a href = {sss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{sss_url.name}</a>
                                                                {qfc.urls[sssurlindex+1] && " | "}
                                                            </div>
                                                        })}
                                                    </div>
                                                }
                                            </div>
                                            <div className = "flex flex-col">
                                                {qfc.description && <p>({qfc.description})</p>}
                                            </div>
                                        </div>
                                        
                                        <div className = "flex flex-col items-end max-w-[50%]">
                                            <div className = "flex">
                                                {new Date(qfc.start).toLocaleDateString("en-IN", {
                                                    year : "numeric",
                                                    month : "short"
                                                })} {"-"} {!qfc.ongoing && qfc.end ? new Date(qfc.end).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric"
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
            </section>}


            {/* PROFESSIONAL EXPERIENCE */}
            {resumeInView.experience.length > 0 && <section id = "experience" className = "pt-[1%] border-t mt-[1%]  border-black">
                <h1 className = "font-extrabold text-center break-inside-avoid-page text-[90%] mb-[1%]">PROFESSIONAL EXPERIENCE</h1>
                {resumeInView.experience.map((org, org_index) => {
                    return <section key = {org_index} className = "pl-[1.5%] pb-[1%] text-[90%]">
                        <header className = "break-inside-avoid-page relative w-full flex items-start justify-between">
                            <div className = "flex gap-[15px]">
                                <h1 className = "flex items-center font-bold">
                                    {org.organization.toUpperCase()}
                                </h1>
                                <div className = "flex flex-wrap mt-[1.5%] items-center gap-[3px]">
                                    {org.urls.map((ss_url, ssurlindex) => {
                                        return <div key = {ssurlindex} className = "flex items-center gap-[3px]">
                                            <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{ss_url.name}</a>
                                            {org.urls[ssurlindex+1] && " | "}
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className = "italic flex flex-col max-w-[50%]">
                                {org.extras.length > 0 &&
                                <div className = "flex gap-[5px] flex-wrap justify-end">
                                    {org.extras.map((extra, extraindex) => {
                                        return <p key = {extraindex}>{extra}{org.extras[extraindex+1] && ","}</p>
                                    })}
                                </div>
                                }
                            </div>
                        </header>
                        <section className = "flex flex-col">
                            {org.roles.map((role, roleindex) => {
                                return <div key = {roleindex} className = "pb-[1%] break-inside-avoid-page">
                                    <header className = "flex justify-between italic">
                                        <div className = "flex items-center gap-[15px] max-w-[60%]">
                                            <h1 className = "font-semibold">{role.rolename}</h1>
                                            {role.urls &&
                                                <div className = "flex flex-wrap mt-[1.5%] items-center gap-[3px]">
                                                    {role.urls.map((sss_url, sssurlindex) => {
                                                        return <div key = {sssurlindex} className = "flex items-center gap-[3px]">
                                                            <a href = {sss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{sss_url.name}</a>
                                                            {role.urls[sssurlindex+1] && " | "}
                                                        </div>
                                                    })}
                                                </div>
                                            }
                                        </div>
                                        <div className = "flex gap-[5px] justify-end max-w-[50%]">
                                            <div className = "flex">
                                                {new Date(role.start).toLocaleDateString("en-IN", {
                                                    year : "numeric",
                                                    month : "short"
                                                })} {"-"} {!role.ongoing && role.end ? new Date(role.end).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    year: "numeric"
                                                }) : "ongoing"}
                                                {role.extras.length > 0 && ","}
                                            </div>
                                            {role.extras.length > 0 &&
                                            <div className = "flex gap-[2px] justify-end">
                                                {role.extras.map((extra, sssextraindex) => {
                                                    return <p key = {sssextraindex}>{extra}{role.extras[sssextraindex + 1] && ","}</p>
                                                })}
                                            </div>
                                            }
                                        </div>
                                    </header>
                                    <div className = "flex flex-col">
                                        <p className = "italic">{role.rolesummary}</p>
                                        <ul className = "flex pl-[1%] flex-col">
                                            {role.points.map((point, pointindex) => {
                                                return <li className = "break-inside-avoid-page flex gap-[2px]" key = {pointindex}><div>{"-"}</div> {point}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            })}
                        </section>
                    </section>
                })}
                </section>}

                {/* PROJECTS */}

                {resumeInView.projects.length > 0 && <section id = "projects" className = "pt-[1%] flex flex-col mt-[1%]  border-t border-black">
                    <h1 className = "font-extrabold text-center break-inside-avoid-page text-[90%] mb-[1%]">SELECTED PROJECTS</h1>
                    {resumeInView.projects.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] pb-[1%] break-inside-avoid-page text-[90%]">
                            <header className = "relative w-full items-start flex justify-between">
                                <div className = "flex gap-[15px]">
                                    <h1 className = "flex items-center font-bold text-[110%]">
                                        {subsection.projectname}
                                    </h1>
                                    <div className = "flex items-center mt-[1.5%] flex-wrap gap-[3px]">
                                        {subsection.urls.map((ss_url, ssurlindex) => {
                                            return <div key = {ssurlindex} className = "flex items-center gap-[3px]">
                                                <a key = {ssurlindex} href = {ss_url.url} target = "_blank" className = "text-blue-900 break-all font-bold italic">{ss_url.name}</a>
                                                {subsection.urls[ssurlindex+1] && " | "}
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className = "italic flex gap-[5px] justify-end max-w-[50%] flex-wrap">
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
                                        {subsection.extras.length > 0 && ","}
                                    </div>
                                    }
                                    {subsection.extras.length > 0 &&
                                    <div className = "flex gap-[5px]">
                                        {subsection.extras.map((extra, extraindex) => {
                                            return <p key = {extraindex}>{extra}{subsection.extras[extraindex+1] && ","}</p>
                                        })}
                                    </div>
                                    }
                                </div>
                            </header>
                            {subsection.stack &&
                                <div className = "italic">
                                    <div className = "flex">
                                        <h1 className = "font-bold">{subsection.stack.head}</h1>
                                        {subsection.stack.content && 
                                            <p>: {subsection.stack.content}</p>
                                        }
                                    </div>
                                </div>
                            }
                            {subsection.projectsummary && 
                                <p className = "italic">{subsection.projectsummary}</p>
                            }
                            {subsection.points && 
                                <ul className = "pl-[1%]">
                                    {subsection.points.map((sspoint, sspointindex) => {
                                        return <li className = "break-inside-avoid flex gap-[2px]" key = {sspointindex}> <div>{"-"}</div> {sspoint}</li>
                                    })}
                                </ul>
                            }
                        </section>
                    })}
                </section>}

                {/* SKILLS */}

                {resumeInView.skills.length > 0 && <section id = "skills" className = "pt-[1%] border-t mt-[1%] border-black">
                    <h1 className = "font-extrabold text-center break-inside-avoid-page text-[90%] mb-[1%]">PROFESSIONAL SKILLS</h1>
                    {resumeInView.skills &&
                        <ul className = "pl-[1.5%] text-[90%] flex flex-col gap-[1px]">
                            {resumeInView.skills.map((minisection, minisectionindex) => {
                                return <li key = {minisectionindex} className = "flex flex-wrap">
                                    {minisection.head && <b>{minisection.head}:</b>}
                                    {minisection.content && minisection.content}
                                </li>
                            })}
                        </ul>
                    }
                </section>}







            {/* EXTRA SECTIONS */}
            {resumeInView.extraSections.map((section, sectionindex) => {
                return <section key = {sectionindex} className = "pt-[1%] mt-[1%] break-inside-avoid-page border-t border-black">
                    <h1 className = "font-extrabold text-center break-inside-avoid-page mb-[1%]">{section.sectionName.toUpperCase()}</h1>
                    {section.subsections.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] pb-[1%] text-[90%]">
                            <header className = "relative w-full flex justify-between">
                                <div className = "flex gap-[15px] items-center">
                                    <h1 className = "flex items-center font-bold text-[110%]">
                                        {subsection.title}
                                    </h1>
                                    <div className = "flex items-center mt-[1.5%] flex-wrap gap-[3px]">
                                        {subsection.urls.map((ss_url, ssurlindex) => {
                                            return <div key = {ssurlindex} className = "flex items-center gap-[3px]">
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
                                            year : "numeric"
                                        })} {"-"} {!subsection.ongoing && subsection.end ? new Date(subsection.end).toLocaleDateString("en-IN", {
                                            month: "short",
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
                                <p className = "italic">{subsection.summary}</p>
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