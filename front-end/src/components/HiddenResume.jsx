function HiddenResume({ resumeInView }) {
    return (
        <div className="resume-root" id="resumeview">
            <header className="resume-header">
                <h1 id="username" className="resume-username">
                    {resumeInView.username.toUpperCase()}
                </h1>
                <div className="resume-location">
                    {resumeInView.city}{(resumeInView.city && resumeInView.state) && ", "}
                    {resumeInView.state}{(resumeInView.state && resumeInView.country) && ", "}
                    {resumeInView.country}{(resumeInView.country && resumeInView.pincode) && " - "}
                    {resumeInView.pincode}
                </div>
                <div className="resume-contact">
                    {resumeInView.phonenum !== "" && (
                        <p>
                            <label>{resumeInView.phonenum}</label>
                            <label>{(resumeInView.header_urls?.length > 0 || resumeInView.email || resumeInView.email2) && "  | "}</label>
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
                <section className="resume-section">
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
                                    <h2 className="resume-edu-title">{edu.institution}</h2>
                                </div>
                            </header>
                            <section className="resume-edu-qualifications">
                                {edu.qualifications?.sort((a, b) => {
                                const aEnd = a.end ? new Date(a.end) : (a.ongoing ? new Date() : null);
                                const bEnd = b.end ? new Date(b.end) : (b.ongoing ? new Date() : null);

                                if (aEnd && bEnd && aEnd.getTime() !== bEnd.getTime()) {
                                return bEnd - aEnd; // latest end first
                                }

                                const aStart = a.start ? new Date(a.start) : null;
                                const bStart = b.start ? new Date(b.start) : null;

                                if (aStart && bStart) return bStart - aStart;
                                return 0;
                            }).map((qfc, qfcindex) => (
                                    <div key={qfcindex}>
                                        <header className="resume-edu-qualification-header">
                                            <div className="resume-edu-qualification-main">
                                                <div className="resume-edu-qualification-row">
                                                    <h2 className="resume-edu-qualification-name">{qfc.name}</h2>
                                                </div>
                                                <div className="resume-edu-qualification-desc">
                                                    {qfc.description && <p>{qfc.description}</p>}
                                                </div>
                                            </div>
                                            <div className="resume-edu-qualification-dates">
                                                {qfc.extras.length > 0 && (
                                                    <div className="resume-edu-qualification-extras">
                                                        {qfc.extras.map((extra, sssextraindex) => {
                                                            return <p key={sssextraindex}>{extra}</p>
                                                        })}
                                                    </div>
                                                )}
                                                <div className = "date">
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
                    {resumeInView.experience?.map((org, org_index) => (
                        <section key={org_index} className="resume-exp-section">
                            <header className="resume-exp-header">
                                <div className="resume-exp-header-main">
                                    <h2 className="resume-exp-title">{org.organization.toUpperCase()}</h2>
                                    <div className = "resume-links">
                                        {org.urls?.length > 0 && "Links: "}
                                        {org.urls?.map((ss_url, ssurlindex) => (
                                        <span className = "resume-high-link" key={ssurlindex}>
                                            <a
                                            href={ss_url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resume-link"
                                            >
                                            {ss_url.name}
                                            </a>
                                            {ssurlindex < role.urls.length - 1 && "|"}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                <div className = "resume-exp-extras">
                                    ({org.extras?.length > 0 && org.extras.join(", ")})
                                </div>
                            </header>
                            <section className="resume-exp-roles">
                                {org.roles?.sort((a, b) => {
                                const aEnd = a.end ? new Date(a.end) : (a.ongoing ? new Date() : null);
                                const bEnd = b.end ? new Date(b.end) : (b.ongoing ? new Date() : null);

                                if (aEnd && bEnd && aEnd.getTime() !== bEnd.getTime()) {
                                return bEnd - aEnd; // latest end first
                                }

                                const aStart = a.start ? new Date(a.start) : null;
                                const bStart = b.start ? new Date(b.start) : null;

                                if (aStart && bStart) return bStart - aStart;
                                return 0;
                            }).map((role, roleindex) => (
                                    <div key={roleindex} className="resume-role-section">
                                        <header className="resume-role-header">
                                            <div className="resume-role-header-main">
                                                <h2 className="resume-role-title">{role.rolename} {"—"}</h2>
                                                <div className="resume-role-extras">{role.extras?.length > 0 && role.extras.join(", ")}{role.extras?.length > 0 && role.urls?.length > 0 && " —"}</div>    
                                                <div className = "resume-links">
                                                    {role.urls?.length > 0 && "Links: "}
                                                    {role.urls?.map((ss_url, ssurlindex) => (
                                                    <span className = "resume-high-link" key={ssurlindex}>
                                                        <a
                                                        href={ss_url.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="resume-link"
                                                        >
                                                        {ss_url.name}
                                                        </a>
                                                        {ssurlindex < role.urls.length - 1 && "|"}
                                                    </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className = "date">
                                            {/* Show start date if present */}
                                            
                                            {role.start && (
                                                <>
                                                    {"("}
                                                    {new Date(role.start).toLocaleDateString("en-IN", {
                                                        year: "numeric",
                                                        month: "short"
                                                    })}
                                                    {/* Show dash and end/ongoing only if start exists */}
                                                    {(role.end || role.ongoing) && (
                                                        <>
                                                            {" - "}
                                                            {/* Show end date if not ongoing and end exists */}
                                                            {!role.ongoing && role.end && new Date(role.end).toLocaleDateString("en-IN", {
                                                                month: "short",
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
                    {resumeInView.projects?.sort((a, b) => {
                                const aEnd = a.end ? new Date(a.end) : (a.ongoing ? new Date() : null);
                                const bEnd = b.end ? new Date(b.end) : (b.ongoing ? new Date() : null);

                                if (aEnd && bEnd && aEnd.getTime() !== bEnd.getTime()) {
                                return bEnd - aEnd; // latest end first
                                }

                                const aStart = a.start ? new Date(a.start) : null;
                                const bStart = b.start ? new Date(b.start) : null;

                                if (aStart && bStart) return bStart - aStart;
                                return 0;
                            }).map((subsection, subsectionindex) => (
                        <section key={subsectionindex} className="resume-proj-section">
                            <header className="resume-proj-header">
                                <div className="resume-proj-header-main">
                                    <h1 className = "resume-proj-title">
                                        {subsection.projectname} {" —"}
                                    </h1>
                                    <div className="resume-proj-extras">{subsection.extras?.length > 0 && subsection.extras.join(", ")}{subsection.extras?.length > 0 && subsection.urls.length > 0 && " —"}</div>
                                    <div className = "resume-links">
                                        {subsection.urls?.length > 0 && "Links: "}
                                        {subsection.urls?.map((ss_url, ssurlindex) => (
                                        <span className = "resume-high-link" key={ssurlindex}>
                                            <a
                                            href={ss_url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resume-link"
                                            >
                                            {ss_url.name}
                                            </a>
                                            {ssurlindex < subsection.urls.length - 1 && "|"}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="date">
                                    {/* separator dash */}
                                    {"("}

                                    {/* dates */}
                                    {subsection.start && (
                                        <>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "short",
                                            year: "numeric",
                                        })}

                                        {(subsection.end || subsection.ongoing) && (
                                            <>
                                            {" - "}
                                            {/* Show end date if not ongoing and end exists */}
                                            {!subsection.ongoing && subsection.end &&
                                                new Date(subsection.end).toLocaleDateString("en-IN", {
                                                month: "short",
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
                <section id="skills" className="resume-section">
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
                <section key={sectionindex} className="resume-section">
                    <h1 className="resume-section-header resume-section-header-mb">{section.sectionName.toUpperCase()}</h1>
                    {section.subsections?.sort((a, b) => {
                                const aEnd = a.end ? new Date(a.end) : (a.ongoing ? new Date() : null);
                                const bEnd = b.end ? new Date(b.end) : (b.ongoing ? new Date() : null);

                                if (aEnd && bEnd && aEnd.getTime() !== bEnd.getTime()) {
                                return bEnd - aEnd; // latest end first
                                }

                                const aStart = a.start ? new Date(a.start) : null;
                                const bStart = b.start ? new Date(b.start) : null;

                                if (aStart && bStart) return bStart - aStart;
                                return 0;
                            }).map((subsection, subsectionindex) => (
                        <section key={subsectionindex} className="resume-proj-section">
                            <header className="resume-proj-header">
                                <div className="resume-proj-header-main">
                                    <h1 className = "resume-proj-title">
                                        {subsection.title} {" —"}
                                    </h1>
                                    <div className="resume-proj-extras">{subsection.extras?.length > 0 && subsection.extras.join(", ")}{subsection.extras?.length > 0 && subsection.urls.length > 0 && " —"}</div>
                                    <div className = "resume-links">
                                        {subsection.urls?.length > 0 && "Links: "}
                                        {subsection.urls?.map((ss_url, ssurlindex) => (
                                        <span className = "resume-high-link" key={ssurlindex}>
                                            <a
                                            href={ss_url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resume-link"
                                            >
                                            {ss_url.name}
                                            </a>
                                            {ssurlindex < subsection.urls.length - 1 && "|"}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="date">
                                    {/* separator dash */}
                                    {"("}

                                    {/* dates */}
                                    {subsection.start && (
                                        <>
                                        {new Date(subsection.start).toLocaleDateString("en-IN", {
                                            month: "short",
                                            year: "numeric",
                                        })}

                                        {(subsection.end || subsection.ongoing) && (
                                            <>
                                            {" - "}
                                            {/* Show end date if not ongoing and end exists */}
                                            {!subsection.ongoing && subsection.end &&
                                                new Date(subsection.end).toLocaleDateString("en-IN", {
                                                month: "short",
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
            ))}
        </div>
    );
}

export default HiddenResume;