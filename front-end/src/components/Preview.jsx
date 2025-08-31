function Preview ({resumeInView}) {
    return (
        <div
        className = "font-tinos shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] leading-[120%] px-[2%] font-['Times_New_Roman',serif] text-[1.125mm] min-[396px]:text-[1.725mm] md:text-[2.25mm] lg:text-[3mm] bg-white text-black flex flex-col w-[240px] min-h-[339px] lg:w-[148.75mm] md:w-[119mm] min-[396px]:w-[89.25mm] py-[4%] lg:min-h-[210.25mm] md:min-h-[173.25mm] min-[396px]:min-h-[126.25mm]"
        id = "resumeview"
        >
            <header className = "flex-col break-inside-avoid-page text-center flex flex-col">
                <h1 id = "username" className = "font-extrabold mb-[1.5%] text-[175%]">
                    {resumeInView.username.toUpperCase()}
                </h1>
                <div className = "flex break-inside-avoid-page items-center mb-[1%] text-[90%] justify-center flex-wrap ">
                    {resumeInView.city}{(resumeInView.city && resumeInView.state) && ", "}
                    {resumeInView.state}{(resumeInView.state && resumeInView.country) && ", "}
                    {resumeInView.country}{(resumeInView.country && resumeInView.pincode) && " - "}
                    {resumeInView.pincode}
                </div>
                <div className = "flex break-inside-avoid-page justify-center flex-wrap text-[85%] gap-2">
                    {resumeInView.phonenum !== "" && <p className = "bg-black flex items-center font-bold italic gap-[3px]"><label>Phone: {resumeInView.phonenum}</label><label>{(resumeInView.header_urls?.length > 0 || resumeInView.email || resumeInView.email2) && "  | "}</label></p>}
                    {resumeInView.email && <p>Email: <a className = "text-blue-900 font-bold italic" href = {`mailto:${resumeInView.email}`}>{resumeInView.email}</a>{resumeInView.header_urls?.length > 0 && " |"}</p>}
                    {resumeInView.email2 && <p>Alt Email: <a className = "text-blue-900 font-bold italic" href = {`mailto:${resumeInView.email2}`}>{resumeInView.email2}</a>{resumeInView.header_urls?.length > 0 && " |"}</p>}
                    {resumeInView.header_urls.map((header_url, headerindex) => {
                        return <div className = "flex" key = {headerindex}>
                            <p>{header_url.name}:</p>
                            <a href = {header_url.url} target = "_blank" className = "mx-[3px] text-blue-900 break-all font-bold italic">{header_url.url}</a>
                            {resumeInView.header_urls[headerindex+1] && "|"}
                        </div>
                    })}
                </div>
            </header>
            {resumeInView.resumesummary &&
            <section id = "summary" className = "border-t border-black mt-[2.5%]">
                <h1 className = "font-extrabold break-inside-avoid-page mb-[0.5%]">SUMMARY</h1>
                <p className = "pl-[1.5%] break-inside-avoid-page text-[90%]">{resumeInView.resumesummary}</p>
            </section>
            }

            {/* EDUCATION */}
            {resumeInView.education.length > 0 && <section id = "education" className = "border-t border-black mt-[2.5%]">
                <h1 className = "font-extrabold break-inside-avoid-page mb-[0.5%]">EDUCATION</h1>
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
                                    <header className = "flex justify-between items-start italic">
                                        <div className = "flex flex-col max-w-[70%]">
                                            <div className = "flex items-center flex-wrap gap-[0.5em]">
                                                <h1 className = "text-[110%]">{qfc.name}</h1>
                                            </div>
                                            <div className = "flex flex-col">
                                                {qfc.description && <p>{qfc.description}</p>}
                                            </div>
                                        </div>
                                        <div className = "flex flex-col items-end max-w-[30%]">
                                            {qfc.extras?.length > 0 &&
                                            (<div className = "flex flex-col items-end">
                                                {qfc.extras.map((extra, sssextraindex) => {
                                                    return <p key = {sssextraindex}>{extra}</p>
                                                })}
                                            </div>)
                                            }
                                            <div className = "flex">
                                                {/* Show start date if present */}
                                                {qfc.start && (
                                                    <>
                                                        {"("}
                                                        {new Date(qfc.start).toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                        })}
                                                        {/* Show dash and end/ongoing only if start exists */}
                                                        {(qfc.end || qfc.ongoing) && (
                                                            <>
                                                                {" - "}
                                                                {/* Show end date if not ongoing and end exists */}
                                                                {!qfc.ongoing && qfc.end && new Date(qfc.end).toLocaleDateString("en-IN", {
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                                {/* Show 'ongoing' only if ongoing is true */}
                                                                {qfc.ongoing && "Present"}
                                                            </>
                                                        )}
                                                        {")"}
                                                    </>
                                                )}
                                            </div>
                                            ({qfc.grades && qfc.grades})
                                        </div>
                                    </header>
                                </div>
                            })}
                        </section>
                    </section>
                })}
            </section>}


            {/* PROFESSIONAL EXPERIENCE */}
            {resumeInView.experience.length > 0 && <section id = "experience" className = "border-t border-black mt-[2.5%]">
                <h1 className = "font-extrabold break-inside-avoid-page mb-[1%]">EXPERIENCE</h1>
                {resumeInView.experience.map((org, org_index) => {
                    return <section key = {org_index} className = "pl-[1.5%] pb-[0.5%] text-[90%]">
                        <header className = "break-inside-avoid-page relative w-full flex items-center justify-between">
                            <div className = "flex items-center flex-wrap">
                                <h2 className = "flex items-center break-words font-bold">
                                    {org.organization.toUpperCase()}
                                </h2>
                                <div className = "flex flex-wrap ml-[3px] italic font-bold items-center">
                                    {org.urls?.map((ss_url, ssurlindex) => (
                                    <span className = "flex" key={ssurlindex}>
                                        <p>{ss_url.name}:</p>
                                        <a
                                        href={ss_url.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mx-[3px] text-blue-900 break-all"
                                        >
                                        {ss_url.url}
                                        </a>
                                        {ssurlindex < role.urls.length - 1 && "|"}
                                    </span>
                                    ))}
                                </div>
                            </div>
                            <div className = "italic flex flex-col">
                                ({org.extras?.length > 0 && org.extras.join(", ")})
                            </div>
                        </header>
                        <section className = "flex flex-col">
                            {org.roles.map((role, roleindex) => {
                                return <div key = {roleindex} className = "pb-[1%] break-inside-avoid-page">
                                    <header className = "flex justify-between italic">
                                        <div className = "flex flex-wrap items-center max-w-[70%]">
                                            <h1 className = "font-semibold mr-[3px]">{role.rolename} {"—"}</h1>
                                            <div className="italic">{role.extras?.length > 0 && role.extras.join(", ")}{role.extras?.length > 0 && role.urls?.length > 0 && " —"}</div>        
                                            <div className = "flex flex-wrap ml-[3px] italic font-bold items-center">
                                                {role.urls?.map((ss_url, ssurlindex) => (
                                                <span className = "flex" key={ssurlindex}>
                                                    <p>{ss_url.name}:</p>
                                                    <a
                                                    href={ss_url.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mx-[3px] text-blue-900 break-all"
                                                    >
                                                    {ss_url.url}
                                                    </a>
                                                    {ssurlindex < role.urls.length - 1 && "|"}
                                                </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className = "flex">
                                            {/* Show start date if present */}
                                            
                                            {role.start && (
                                                <>
                                                    {"("}
                                                    {new Date(role.start).toLocaleDateString("en-IN", {
                                                        year: "numeric",
                                                        month: "long"
                                                    })}
                                                    {/* Show dash and end/ongoing only if start exists */}
                                                    {(role.end || role.ongoing) && (
                                                        <>
                                                            {" - "}
                                                            {/* Show end date if not ongoing and end exists */}
                                                            {!role.ongoing && role.end && new Date(role.end).toLocaleDateString("en-IN", {
                                                                month: "long",
                                                                year: "numeric"
                                                            })}
                                                            {/* Show 'ongoing' only if ongoing is true */}
                                                            {role.ongoing && "Present"}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            {")"}
                                        </div>
                                    </header>
                                    <div className = "flex flex-col">
                                        <p className = "italic">{role.rolesummary}</p>
                                        <ul className = "flex pl-[1%] flex-col">
                                            {role.points.map((point, pointindex) => {
                                                return <li className = "break-inside-avoid-page" key = {pointindex}>• {point}</li>
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

                {resumeInView.projects.length > 0 && 
                <section id = "projects" className = "flex flex-col border-t border-black mt-[1.5%]">
                    <h1 className = "font-extrabold mb-[1%] break-inside-avoid-page">PROJECTS</h1>
                    {resumeInView.projects.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] break-inside-avoid-page pb-[1%] text-[90%]">
                            <header className = "relative w-full items-start flex justify-between">
                                <div className = "flex flex-wrap max-w-[75%]">    
                                    <h1 className = "text-nowrap mr-[3px] font-bold text-[110%]">
                                        {subsection.projectname} {" —"}
                                    </h1>
                                    {/* extras list */}
                                    <div className="italic mr-[3px] text-nowrap">{subsection.extras?.length > 0 && subsection.extras.join(", ")}{subsection.extras?.length > 0 && subsection.urls.length > 0 && " —"}</div>
                                    <div className = "flex italic text-nowrap font-bold items-center">
                                        {subsection.urls?.map((ss_url, ssurlindex) => (
                                        <span className = "flex" key={ssurlindex}>
                                            <p>{ss_url.name}:</p>
                                            <a
                                            href={ss_url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mx-[3px] text-blue-900 break-all"
                                            >
                                            {ss_url.name}
                                            </a>
                                            {ssurlindex < subsection.urls.length - 1 && "|"}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="italic justify-end w-[25%] flex ml-[3px]">
                                    {/* separator dash */}
                                    {"("}

                                    {/* dates */}
                                    {subsection.start && (
                                        <>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "long",
                                            year: "numeric",
                                        })}

                                        {(subsection.end || subsection.ongoing) && (
                                            <>
                                            {" - "}
                                            {/* Show end date if not ongoing and end exists */}
                                            {!subsection.ongoing && subsection.end &&
                                                new Date(subsection.end).toLocaleDateString("en-IN", {
                                                month: "long",
                                                year: "numeric",
                                                })}

                                            {/* Show 'Present' if ongoing is true */}
                                            {subsection.ongoing && "Present"}
                                            </>
                                        )}
                                        </>
                                    )}
                                    {")"}
                                </div>
                            </header>
                            {subsection.stack &&
                                <div className = "italic">
                                    <div>
                                        {subsection.stack.head && <b>{subsection.stack.head}:{"\t"}</b>}{subsection.stack.content && subsection.stack.content}
                                    </div>
                                </div>
                            }
                            {subsection.projectsummary && 
                                <p className = "italic">{subsection.projectsummary}</p>
                            }
                            {subsection.points && 
                                <ul className = "pl-[1%]">
                                    {subsection.points.map((sspoint, sspointindex) => {
                                        return <li className = "break-inside-avoid " key = {sspointindex}>• {sspoint}</li>
                                    })}
                                </ul>
                                
                            }
                        </section>
                        
                    })}
                </section>}


                {/* SKILLS */}

                {resumeInView.skills.length > 0 && <section id = "skills" className = "border-t border-black pb-[1%] mt-[2.5%] break-inside-avoid-page">
                    <h1 className = "font-extrabold mb-[1%]">SKILLS</h1>
                    {resumeInView.skills &&
                        <ul className = "pl-[1.5%] text-[90%] flex flex-col gap-[1px]">
                            {resumeInView.skills.map((minisection, minisectionindex) => {
                                return <li key = {minisectionindex} className = "">
                                    {minisection.head && <b>{minisection.head}:{"\t"}</b>}{minisection.content && minisection.content}
                                </li>
                            })}
                        </ul>
                    }
                </section>}


            {/* EXTRA SECTIONS */}
            {resumeInView.extraSections?.map((section, sectionindex) => {
                return <section key = {sectionindex} className = "border-t border-black mt-[1.5%] break-inside-avoid-page">
                    <h1 className = "font-extrabold break-inside-avoid-page">{section.sectionName.toUpperCase()}</h1>
                    {section.subsections?.map((subsection, subsectionindex) => {
                        return <section key = {subsectionindex} className = "pl-[1.5%] break-inside-avoid-page pb-[1%] text-[90%]">
                            <header className = "relative w-full items-start flex justify-between">
                                <div className = "flex flex-wrap max-w-[75%]">    
                                    <h1 className = "font-bold text-nowrap items-center text-[110%]">
                                        {subsection.title} {"—"}
                                    </h1>
                                    <div className="italic text-nowrap mx-[3px]">{subsection.extras?.length > 0 && subsection.extras.join(", ")}{subsection.extras?.length > 0 && " —"}</div>
                                    <div className = "flex italic font-bold items-center">
                                        {subsection.urls?.map((ss_url, ssurlindex) => (
                                        <span className = "flex" key={ssurlindex}>
                                            <p>{ss_url.name}:</p>
                                            <a
                                            href={ss_url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mx-[3px] text-blue-900"
                                            >
                                            {ss_url.name}
                                            </a>
                                            {ssurlindex < subsection.urls.length - 1 && "|"}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="italic justify-end w-[25%] flex ml-[3px]">
                                    {/* separator dash */}
                                    {"("}

                                    {/* dates */}
                                    {subsection.start && (
                                        <>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "long",
                                            year: "numeric",
                                        })}

                                        {(subsection.end || subsection.ongoing) && (
                                            <>
                                            {" - "}
                                            {/* Show end date if not ongoing and end exists */}
                                            {!subsection.ongoing && subsection.end &&
                                                new Date(subsection.end).toLocaleDateString("en-IN", {
                                                month: "long",
                                                year: "numeric",
                                                })}

                                            {/* Show 'Present' if ongoing is true */}
                                            {subsection.ongoing && "Present"}
                                            </>
                                        )}
                                        </>
                                    )}
                                    {")"}
                                </div>
                            

                            </header>
                            
                            {subsection.stack &&
                                <div className = "italic">
                                    <div className = "">
                                        {subsection.stack.head && <b>{subsection.stack.head}:{"\t"}</b>}{subsection.stack.content && subsection.stack.content}
                                    </div>
                                </div>
                            }
                            {subsection.projectsummary && 
                                <p className = "italic">{subsection.projectsummary}</p>
                            }
                            {subsection.points && 
                                <ul className = "pl-[1%]">
                                    {subsection.points.map((sspoint, sspointindex) => {
                                        return <li className = "break-inside-avoid " key = {sspointindex}>• {sspoint}</li>
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