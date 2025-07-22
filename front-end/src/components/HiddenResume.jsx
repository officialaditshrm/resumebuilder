
function HiddenResume({ resumeInView }) {
    return (
        <div className="resume-root" id="resumeview">
            <header className="resume-header">
                <h1 id="username" className="resume-username">
                    {resumeInView.username.toUpperCase()}
                </h1>
                <div className="resume-location">
                    {resumeInView.city}{resumeInView.city && resumeInView.state && ", "}
                    {resumeInView.state}{resumeInView.state && resumeInView.country && ", "}
                    {resumeInView.country}{resumeInView.country && resumeInView.pincode && " - "}
                    {resumeInView.pincode}
                </div>
                <div className="resume-contact">
                    {resumeInView.phonenum !== "" && (
                        <p>
                            {resumeInView.phonenum}
                            {(resumeInView.header_urls?.length > 0 || resumeInView.email || resumeInView.email2) && "  | "}
                        </p>
                    )}
                    {resumeInView.email && (
                        <p>
                            <a className="resume-link" href={`mailto:${resumeInView.email}`}>{resumeInView.email}</a>
                            {resumeInView.header_urls?.length > 0 && " |"}
                        </p>
                    )}
                    {resumeInView.email2 && (
                        <p>
                            <a className="resume-link" href={`mailto:${resumeInView.email2}`}>{resumeInView.email2}</a>
                            {resumeInView.header_urls?.length > 0 && " |"}
                        </p>
                    )}
                    {resumeInView.header_urls.map((header_url, headerindex) => (
                        <div key={headerindex} className="resume-contact-link">
                            <a href={header_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{header_url.name}</a>
                            {resumeInView.header_urls[headerindex + 1] && "  |"}
                        </div>
                    ))}
                </div>
            </header>
            {resumeInView.resumesummary && (
                <section className = "resume-section">
                    <h1 className="resume-section-header resume-section-header-mb">SUMMARY</h1>
                    <p className="resume-summary">{resumeInView.resumesummary}</p>
                </section>
            )}

            {/* EDUCATION */}
            {resumeInView.education.length > 0 && (
                <section id="education" className="resume-section">
                    <h1 className="resume-section-header resume-section-header-mb">EDUCATION</h1>
                    {resumeInView.education.map((edu, education_index) => (
                        <section key={education_index} className="resume-edu-section">
                            <header className="resume-edu-header">
                                <div className="resume-edu-header-left">
                                    <h1 className="resume-edu-title">{edu.institution}</h1>
                                </div>
                            </header>
                            <section className="resume-edu-qualifications">
                                {edu.qualifications.map((qfc, qfcindex) => (
                                    <div key={qfcindex}>
                                        <header className="resume-edu-qualification-header">
                                            <div className="resume-edu-qualification-main">
                                                <div className="resume-edu-qualification-row">
                                                    <h1 className="resume-edu-qualification-name">{qfc.name}</h1>
                                                    {qfc.urls && (
                                                        <div className="resume-edu-qualification-links">
                                                            {qfc.urls.map((sss_url, sssurlindex) => (
                                                                <div key={sssurlindex} className="resume-edu-qualification-link">
                                                                    <a href={sss_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{sss_url.name}</a>
                                                                    {qfc.urls[sssurlindex + 1] && " | "}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="resume-edu-qualification-desc">
                                                    {qfc.description && <p>({qfc.description})</p>}
                                                </div>
                                            </div>
                                            <div className="resume-edu-qualification-dates">
                                                <div>
                                                    {qfc.start && (
                                                        <>
                                                            {new Date(qfc.start).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
                                                            {(qfc.end || qfc.ongoing) && (
                                                                <>
                                                                    {" - "}
                                                                    {!qfc.ongoing && qfc.end && new Date(qfc.end).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                                                    {qfc.ongoing && "Present"}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {qfc.extras.length > 0 && (
                                                    <div className="resume-edu-qualification-extras">
                                                        {qfc.extras.map((extra, sssextraindex) => (
                                                            <p key={sssextraindex}>{extra}</p>
                                                        ))}
                                                    </div>
                                                )}
                                                {qfc.grades && <span className="resume-edu-qualification-grades">{qfc.grades}</span>}
                                            </div>
                                        </header>
                                    </div>
                                ))}
                            </section>
                        </section>
                    ))}
                </section>
            )}

            {/* PROFESSIONAL EXPERIENCE */}
            {resumeInView.experience.length > 0 && (
                <section id="experience" className="resume-section">
                    <h1 className="resume-section-header resume-section-header-mb">EXPERIENCE</h1>
                    {resumeInView.experience.map((org, org_index) => (
                        <section key={org_index} className="resume-exp-section">
                            <header className="resume-exp-header">
                                <div className="resume-exp-header-main">
                                    <h1 className="resume-exp-title">{org.organization.toUpperCase()}</h1>
                                    <div className="resume-exp-links">
                                        {org.urls.map((ss_url, ssurlindex) => (
                                            <div key={ssurlindex} className="resume-exp-link">
                                                <a href={ss_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{ss_url.name}</a>
                                                {org.urls[ssurlindex + 1] && " | "}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="resume-exp-extras">
                                    {org.extras.length > 0 && (
                                        <div className="resume-exp-extras-list">
                                            {org.extras.map((extra, extraindex) => (
                                                <p key={extraindex}>{extra}{org.extras[extraindex + 1] && ","}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </header>
                            <section className="resume-exp-roles">
                                {org.roles.map((role, roleindex) => (
                                    <div key={roleindex} className="resume-role-section">
                                        <header className="resume-role-header">
                                            <div className="resume-role-header-main">
                                                <h1 className="resume-role-title">{role.rolename}</h1>
                                                {role.urls && (
                                                    <div className="resume-role-links">
                                                        {role.urls.map((sss_url, sssurlindex) => (
                                                            <div key={sssurlindex} className="resume-role-link">
                                                                <a href={sss_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{sss_url.name}</a>
                                                                {role.urls[sssurlindex + 1] && " | "}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="resume-role-dates">
                                                <div>
                                                    {role.start && (
                                                        <>
                                                            {new Date(role.start).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
                                                            {(role.end || role.ongoing) && (
                                                                <>
                                                                    {" - "}
                                                                    {!role.ongoing && role.end && new Date(role.end).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                                                    {role.ongoing && "Present"}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    {role.extras.length > 0 && ","}
                                                </div>
                                                {role.extras.length > 0 && (
                                                    <div className="resume-role-extras-list">
                                                        {role.extras.map((extra, sssextraindex) => (
                                                            <p key={sssextraindex}>{extra}{role.extras[sssextraindex + 1] && ","}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </header>
                                        <div className="resume-role-summary">
                                            <p className="resume-italic">{role.rolesummary}</p>
                                            <ul className="resume-points">
                                                {role.points.map((point, pointindex) => (
                                                    <li key={pointindex}>• {point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </section>
                    ))}
                </section>
            )}

            {/* PROJECTS */}
            {resumeInView.projects.length > 0 && (
                <section id="projects" className="resume-section resume-section-mt">
                    <h1 className="resume-section-header resume-section-header-mb">PROJECTS</h1>
                    {resumeInView.projects.map((subsection, subsectionindex) => (
                        <section key={subsectionindex} className="resume-proj-section">
                            <header className="resume-proj-header">
                                <div className="resume-proj-header-main">
                                    <h1 className="resume-proj-title">{subsection.projectname}</h1>
                                    <div className="resume-proj-links">
                                        {subsection.urls.map((ss_url, ssurlindex) => (
                                            <div key={ssurlindex} className="resume-proj-link">
                                                <a href={ss_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{ss_url.name}</a>
                                                {subsection.urls[ssurlindex + 1] && " | "}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="resume-proj-dates">
                                    {subsection.start && (
                                        <div>
                                            {new Date(subsection.start).toLocaleDateString("en-IN", { month: "long", year: "numeric", day: "2-digit" })}
                                            {(subsection.end || subsection.ongoing) && (
                                                <>
                                                    {" - "}
                                                    {!subsection.ongoing && subsection.end && new Date(subsection.end).toLocaleDateString("en-IN", { month: "long", year: "numeric", day: "2-digit" })}
                                                    {subsection.ongoing && "Present"}
                                                </>
                                            )}
                                            {subsection.extras.length > 0 && ","}
                                        </div>
                                    )}
                                    {subsection.extras.length > 0 && (
                                        <div className="resume-proj-extras">
                                            {subsection.extras.map((extra, extraindex) => (
                                                <p key={extraindex}>{extra}{subsection.extras[extraindex + 1] && ","}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </header>
                            {subsection.stack && (
                                <div className="resume-italic">
                                    <div>
                                        {subsection.stack.head && <b>{subsection.stack.head}:{"\t"}</b>}
                                        {subsection.stack.content && subsection.stack.content}
                                    </div>
                                </div>
                            )}
                            {subsection.projectsummary && <p className="resume-italic">{subsection.projectsummary}</p>}
                            {subsection.points && (
                                <ul className="resume-points">
                                    {subsection.points.map((sspoint, sspointindex) => (
                                        <li key={sspointindex}>• {sspoint}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </section>
            )}

            {/* SKILLS */}
            {resumeInView.skills.length > 0 && (
                <section id="skills" className="resume-skills-section">
                    <h1 className="resume-section-header resume-section-header-mb">SKILLS</h1>
                    {resumeInView.skills && (
                        <ul className="resume-skills-list">
                            {resumeInView.skills.map((minisection, minisectionindex) => (
                                <li key={minisectionindex}>
                                    {minisection.head && <b>{minisection.head}:{"\t"}</b>}
                                    {minisection.content && minisection.content}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {/* EXTRA SECTIONS */}
            {resumeInView.extraSections.map((section, sectionindex) => (
                <section key={sectionindex} className="resume-extra-section">
                    <h1 className="resume-section-header resume-section-header-mb">{section.sectionName.toUpperCase()}</h1>
                    {section.subsections.map((subsection, subsectionindex) => (
                        <section key={subsectionindex} className="resume-extra-section-content">
                            <header className="resume-extra-section-header">
                                <div className="resume-extra-section-title-inner">
                                    <h1 className="resume-extra-section-title-text">{subsection.title}</h1>
                                    <div className="resume-extra-section-links">
                                        {subsection.urls.map((ss_url, ssurlindex) => (
                                            <div key={ssurlindex} className="resume-extra-section-link">
                                                <a href={ss_url.url} target="_blank" rel="noopener noreferrer" className="resume-link">{ss_url.name}</a>
                                                {subsection.urls[ssurlindex + 1] && " | "}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="resume-extra-section-dates">
                                    {subsection.start && (
                                        <div>
                                            {new Date(subsection.start).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                            {(subsection.end || subsection.ongoing) && (
                                                <>
                                                    {" - "}
                                                    {!subsection.ongoing && subsection.end && new Date(subsection.end).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                                                    {subsection.ongoing && "Present"}
                                                </>
                                            )}
                                            {subsection.extras.length > 0 && ","}
                                        </div>
                                    )}
                                    {subsection.extras.length > 0 && (
                                        <div className="resume-extra-section-extras">
                                            {subsection.extras.map((extra, extraindex) => (
                                                <p key={extraindex}>{extra}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </header>
                            {subsection.summary && <p className="resume-extra-section-summary">{subsection.summary}</p>}
                            {subsection.points && (
                                <ul className="resume-points">
                                    {subsection.points.map((sspoint, sspointindex) => (
                                        <li className="break-inside-avoid-page" key={sspointindex}>• {sspoint}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </section>
            ))}
        </div>
    );
}

export default HiddenResume;