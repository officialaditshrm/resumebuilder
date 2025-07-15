import React from "react";
// MagicCreateButton: Calls backend to generate a resume and updates resumeToEdit
function MagicCreateButton({ jobDescription, setResumeToEdit, url }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleMagicCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${url}/api/analyze-resume/generate-resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription })
            });
            if (!res.ok) throw new Error("Failed to generate resume");
            const data = await res.json();
            setResumeToEdit(prev => ({
                ...data,
                name: prev.name,
                username: prev.username,
                user_id: prev.user_id
            }));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center my-2">
            <button
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
                style={{ fontSize: "1.1rem" }}
                onClick={handleMagicCreate}
                disabled={loading || !jobDescription.trim()}
            >
                {loading ? "Creating..." : "✨ Magic Create Resume ✨"}
            </button>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
    );
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Preview2 from '../components/Preview2.jsx'

function EditResume({setCurrResumeData, url, setJobDescription, jobDescription, showAllSuggestions, aiError, aiLoading, aiResult, setShowAllSuggestions, handleAIAnalysis, currResumeData, darkMode, updateResume}) {
    const [resumeToEdit, setResumeToEdit] = useState(null)
    const navigate = useNavigate()

    const [headerEdit, setHeaderEdit] = useState(false)
    const [educationEdit, setEducationEdit] = useState(false)
    const [experienceEdit, setExperienceEdit] = useState(false)
    const [projectsEdit, setProjectsEdit] = useState(false)
    const [skillsEdit, setSkillsEdit] = useState(false)
    const [extraSectionsEdit, setExtraSectionsEdit] = useState(false)


    useEffect(() => {
        if (!currResumeData) {
            navigate("/")
        }
        setResumeToEdit({...currResumeData})
    }, [])


    if (resumeToEdit) {
        return (
            <div className = "mt-[25vh] flex gap-8 flex-col min-h-screen sm:p-10 p-5 max-md:[20vh] md:ml-72">
                <h1 className = "text-4xl font-extrabold text-center">Edit Resume</h1>
                <form
                onSubmit = {(event) => {
                    event.preventDefault()
                    updateResume(currResumeData._id, resumeToEdit)
                    navigate("/")
                }}
                className = "flex flex-col gap-4">
                    {/* META */}
                    <div id = "meta" className = "flex relative overflow-y-auto flex-col gap-4 dark:bg-zinc-700 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                        <h1 className = "font-extrabold text-2xl">Meta Info</h1>
                        <div className = "grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                            <div className = "flex flex-col w-full gap-1 items-start">
                                <label className = "font-bold">Resume Name</label>
                                <input
                                required
                                className = "p-2 text-black w-full rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                                type = "text" value = {resumeToEdit.name} onChange = {(event) => {
                                    const newrn = event.target.value
                                    setResumeToEdit((prev) => 
                                    ({
                                        ...prev,
                                        name: newrn
                                    })
                                    )
                                }}/>
                            </div>
                            <div className = "flex flex-col w-full gap-1 items-start">
                                <label className = "font-bold">Applicant Name</label>
                                <input
                                required
                                className = "p-2 text-black w-full rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                                type = "text" value = {resumeToEdit.username} onChange = {(event) => {
                                    const newrn = event.target.value
                                    setResumeToEdit((prev) => 
                                    ({
                                        ...prev,
                                        username: newrn
                                    })
                                    )
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className = "grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <button
                        type = "button"
                        onClick = {() => setHeaderEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Header Details
                        </button>
                        <button
                        type= "button"
                        onClick = {() => setEducationEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Education Details
                        </button>
                        <button
                        type = "button"
                        onClick = {() => setExperienceEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Experience Details
                        </button>
                        <button
                        type = "button"
                        onClick = {() => setProjectsEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Project Details
                        </button>
                        <button
                        type = "button"
                        onClick = {() => setSkillsEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Skills Details
                        </button>
                        <button
                        type = "button"
                        onClick = {() => setExtraSectionsEdit(true)}
                        className = "p-8 bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-200 flex flex-col items-center text-zinc-100 dark:text-zinc-950 font-bold rounded-md">
                            <img src = {darkMode ? "/editblack.svg" : "/edit.svg"}/>
                            Edit Extra Sections
                        </button>
                    </div>
                    <button
                    className = "flex items-center p-2 text-white font-bold rounded-md bg-blue-700 shadow-[0_2px_3px_1px_rgba(0,0,0,0.15)] justify-center gap-2"
                    type = "submit">
                        <img src = "/save.svg" />SAVE
                    </button>
                    <button
                    onClick = {() => {setCurrResumeData(null); navigate("/")}}
                    className = "flex items-center p-2 text-black font-bold rounded-md bg-zinc-400 shadow-[0_2px_3px_1px_rgba(0,0,0,0.15)] justify-center gap-2"
                    type = "button">
                        <img src = "/close.svg" />CANCEL
                    </button>
                    {headerEdit && <HeaderDetails resumeToEdit={resumeToEdit} setHeaderEdit={setHeaderEdit} setResumeToEdit={setResumeToEdit}/>}
                    {educationEdit && <EducationDetails resumeToEdit={resumeToEdit} setEducationEdit={setEducationEdit} setResumeToEdit={setResumeToEdit}/>}
                    {experienceEdit && <ExperienceDetails resumeToEdit={resumeToEdit} setExperienceEdit={setExperienceEdit} setResumeToEdit={setResumeToEdit} />}
                    {projectsEdit && <ProjectDetails resumeToEdit={resumeToEdit} setProjectsEdit={setProjectsEdit} setResumeToEdit={setResumeToEdit} />}
                    {skillsEdit && <SkillsDetails resumeToEdit={resumeToEdit} setSkillsEdit={setSkillsEdit} setResumeToEdit={setResumeToEdit} />}
                    {extraSectionsEdit && <ExtraSectionDetails resumeToEdit={resumeToEdit} setExtraSectionsEdit={setExtraSectionsEdit} setResumeToEdit={setResumeToEdit} />}
                </form>
                <div className = "flex w-full flex-col items-center gap-4">
                    <h1 className = "font-extrabold text-2xl">Preview</h1>
                    <Preview2 resumeInView={resumeToEdit}/>
                </div>

                
                



                {/* ATS Analysis Section */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl shadow p-4 max-sm:p-2 flex flex-col gap-3 border border-blue-200">
                    <h2 className="font-bold text-lg dark:text-blue-200 text-blue-900">ATS & AI Resume Analysis</h2>
                    <textarea
                        className="w-full border p-2 text-black rounded mb-2 text-sm"
                        rows={3}
                        placeholder="Paste job description or title here..."
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                    />
                    <button
                        className="bg-blue-700 text-white px-4 py-2 rounded font-bold disabled:opacity-60"
                        onClick={() => handleAIAnalysis(resumeToEdit)}
                        disabled={aiLoading || !jobDescription.trim()}
                    >
                        {aiLoading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                    {/* Magic Create Button */}
                    <MagicCreateButton url = {url} jobDescription={jobDescription} setResumeToEdit={setResumeToEdit} />
                    {aiError && <div className="text-red-600 text-sm">{aiError}</div>}
                    {aiResult && (
                        <div className="mt-2 text-sm max-sm:text-xs flex flex-col gap-3 items-center w-full">
                            {aiResult.score !== undefined && (
                                <div className="flex flex-col items-center mb-2 w-full">
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                            <circle
                                                cx="50" cy="50" r="45" fill="none"
                                                stroke="#2563eb"
                                                strokeWidth="10"
                                                strokeDasharray={2 * Math.PI * 45}
                                                strokeDashoffset={2 * Math.PI * 45 * (1 - aiResult.score / 100)}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 0.7s' }}
                                            />
                                            <text x="50" y="56" textAnchor="middle" fontSize="2.2em" fontWeight="bold" fill="#2563eb">{aiResult.score}</text>
                                        </svg>
                                    </div>
                                    <div className="font-bold text-lg mt-1">ATS Score</div>
                                </div>
                            )}
                            {/* Individual Category Scores */}
                            {aiResult.individual_category_score && aiResult.individual_category_score.length > 0 && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700">
                                    <b>Category Breakdown:</b>
                                    <ul className="list-disc pl-5">
                                        {aiResult.individual_category_score.map((cat, i) => (
                                            <li key={i} className="mb-1">
                                                <span className="font-bold">{cat.category}:</span> <span className="text-blue-700">{cat.score}</span>
                                                <br />
                                                <span className="text-gray-700 dark:text-gray-300">{cat.short_explanation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {aiResult.summary && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700">
                                    <b>AI Summary:</b>
                                    <div className="whitespace-pre-line">{aiResult.summary}</div>
                                </div>
                            )}
                            {aiResult.missingKeywords && aiResult.missingKeywords.length > 0 && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700">
                                    <b>Missing/Weak Keywords:</b> {aiResult.missingKeywords.join(', ')}
                                </div>
                            )}
                            {aiResult.rewrites && aiResult.rewrites.length > 0 && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700">
                                    <b>Suggested Rewrites:</b>
                                    <ul className="list-disc pl-5">
                                        {aiResult.rewrites.map((rw, i) => (
                                            <li key={i}>
                                                <span className="text-red-600">Old:</span> {rw.old}<br />
                                                <span className="text-green-700">New:</span> {rw.new}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {aiResult.suggestions && aiResult.suggestions.length > 0 && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700">
                                    <b>Suggestions:</b>
                                    <ul className="list-disc pl-5">
                                        {aiResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                            {aiResult.raw && (
                                <div className="w-full bg-white/70 dark:bg-zinc-900/70 rounded p-2 border border-blue-100 dark:border-zinc-700 text-xs text-gray-500 whitespace-pre-wrap">
                                    {aiResult.raw}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <div className = "mt-[25vh] min-h-screen sm:p-10 p-5 max-sm:[20vh] sm:ml-72">
                No resume data here
            </div>
        )
    }
}

export default EditResume



function HeaderDetails ({resumeToEdit, setHeaderEdit, setResumeToEdit}) {
    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            {/* HEADER DETAILS */}
            <div className = "max-h-[90%] min-w-[40%] max-sm:w-[90%] max-sm:pt-12 max-sm:p-2 overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setHeaderEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <h1 className = "font-extrabold text-2xl">Header Details</h1>
                <div className = "flex flex-col gap-2 p-4 max-sm:p-2 rounded-md">
                    <h2 className = "font-bold text-xl">Location</h2>
                    <div className = "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">City</label>
                            <input
                            className = "p-2 w-full text-black rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.city} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    city: newrn
                                })
                                )
                            }}/>
                        </div>
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">State</label>
                            <input
                            className = "p-2 w-full text-black rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.state} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    state: newrn
                                })
                                )
                            }}/>
                        </div>
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">Country</label>
                            <input
                            className = "p-2 w-full text-black rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.country} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    country: newrn
                                })
                                )
                            }}/>
                        </div>
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">Pincode</label>
                            <input
                            className = "p-2 w-full text-black rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.pincode} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    pincode: newrn
                                })
                                )
                            }}/>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-col gap-2 p-4 max-sm:p-2 rounded-md">
                    <h2 className = "font-bold text-xl">Contact Details</h2>
                    <div className = "grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">Phone</label>
                            <input
                            className = "p-2 text-black w-full rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.phonenum} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    phonenum: newrn
                                })
                                )
                            }}/>
                        </div>
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">Email</label>
                            <input
                            className = "p-2 text-black w-full rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.email} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    email: newrn
                                })
                                )
                            }}/>
                        </div>
                        <div className = "flex flex-col gap-1 items-start">
                            <label className = "font-semibold">Alternative Email</label>
                            <input
                            className = "p-2 text-black w-full rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                            type = "text" value = {resumeToEdit.email2} onChange = {(event) => {
                                const newrn = event.target.value
                                setResumeToEdit((prev) => 
                                ({
                                    ...prev,
                                    email2: newrn
                                })
                                )
                            }}/>
                        </div>
                        
                    </div>
                    <div className = "flex flex-col gap-2 w-full">
                        <h3 className = "text-xl max-sm:text-sm font-bold">URLs</h3>
                        <div className = "grid sm:grid-cols-2 grid-cols-1 gap-2">
                            {resumeToEdit.header_urls?.map((link, linkindex) => {
                                return <div key = {linkindex} className = "flex flex-col p-2 bg-sky-400/50 rounded-md gap-2">
                                    <input
                                    onChange = {(event) => {
                                        const newrn = event.target.value
                                        const copy = {...resumeToEdit}
                                        copy.header_urls[linkindex].name = newrn
                                        setResumeToEdit(copy)
                                    }}
                                    className = "p-2  rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Name of Link" type = "text" value = {link.name}/>
                                    <textarea 
                                    onChange = {(event) => {
                                        const newrn = event.target.value
                                        const copy = {...resumeToEdit}
                                        copy.header_urls[linkindex].url = newrn
                                        setResumeToEdit(copy)
                                    }}
                                    placeholder = "https://thishereisgonnabeyoururl.com/hehehe" type = "text" className = "text-black p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" value = {link.url} />
                                    <button
                                    type = "button"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        copy.header_urls.splice(linkindex, 1)
                                        setResumeToEdit(copy)
                                    }}
                                    className = "p-2 bg-red-700 p-1 font-bold text-white rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                        Remove URL
                                    </button>
                                </div>
                            })}
                            <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                const newarr = [...copy.header_urls, { name: "", url: ""}]
                                copy.header_urls = newarr
                                setResumeToEdit(copy)
                            }}
                            className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                <img src = "edit.svg" />ADD URL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function EducationDetails ({resumeToEdit, setResumeToEdit, setEducationEdit}) {
    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            {/* EDUCATION DETAILS */}
            <div className = "max-h-[90%] max-sm:text-sm min-w-[60%] max-sm:w-[90%] max-sm:p-2 overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setEducationEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <h1 className = "font-extrabold max-sm:text-lg text-2xl">Education Details</h1>
                <div className = "flex flex-col gap-4">
                    <h1 className = "font-bold sm:text-xl">Institutions</h1>
                    <div className = "flex flex-col gap-4">
                        {resumeToEdit?.education.map((edu, eduindex) => {
                            return <div key = {eduindex} className = "relative max-sm:pt-6 max-sm:p-2 p-8 gap-4 flex flex-col bg-zinc-800 dark:bg-zinc-100 shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)] text-zinc-100 dark:text-zinc-950 rounded-md">
                                <button
                                type = "button"
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.education.splice(eduindex, 1)
                                    setResumeToEdit(copy)
                                }}
                                className = "absolute top-2 right-2 bg-red-700 rounded-full">
                                    <img src = "/closewhite.svg" />
                                </button>
                                <div className = "flex flex-col gap-1 items-start">
                                    <label className = "font-semibold">Institution Name</label>
                                    <input
                                    className = "p-2 max-sm:p-1 w-full text-black rounded-md border border-black/20 shadow-[0_1px_1px_1px_rgba(0,0,0,0.15)]"
                                    onChange = {(event) => {
                                        const newrn = event.target.value
                                        const copy = {...resumeToEdit}
                                        copy.education[eduindex].institution = newrn
                                        setResumeToEdit(copy)
                                    }}
                                    type = "text" value = {edu.institution}/>
                                </div>
                                <h1 className = "font-semibold sm:text-xl">Qualifications</h1>
                                <div className = "flex flex-col gap-4">
                                    {edu.qualifications?.map((qual, qindex) => {
                                        return <div key = {qindex} className = "relative rounded-md  dark:text-zinc-100 text-zinc-950 flex flex-col gap-2 p-8 max-sm:p-4 max-sm:pt-10 dark:bg-zinc-950/70 bg-zinc-100/70">
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                copy.education[eduindex].qualifications.splice(qindex, 1)
                                                setResumeToEdit(copy)
                                            }}
                                            className = "absolute top-2 right-2 bg-red-700 rounded-full">
                                                <img src = "/closewhite.svg" />
                                            </button>
                                            <input
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.education[eduindex].qualifications[qindex].name = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            value = {qual.name}
                                            placeholder = "Qualification Name (Bachelors in Arts)"
                                            className = "p-2 w-full text-black rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)] border-black/20"
                                            />
                                            <textarea
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.education[eduindex].qualifications[qindex].description = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            value = {qual.description}
                                            placeholder = "Short Description (Specialization in Protesting at J.N.U)"
                                            className = "p-2 w-full text-black rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)] border-black/20"
                                            />
                                            <div className = 'flex flex-col gap-3'>
                                                <div className = "flex flex-col gap-1">
                                                    <label className = "font-bold">Start</label>
                                                    <input type = "month"
                                                    onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.education[eduindex].qualifications[qindex].start = event.target.value
                                                        setResumeToEdit(copy)
                                                    }}
                                                    value = {qual.start && new Date(qual.start).toISOString().slice(0,7)} className = "shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)] p-2 rounded-md text-black"/>
                                                </div>
                                                {!qual.ongoing &&
                                                    <div className = "flex flex-col gap-1">
                                                    <label className = "font-bold">End</label>
                                                    <input
                                                    onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.education[eduindex].qualifications[qindex].end = event.target.value
                                                        setResumeToEdit(copy)
                                                    }}
                                                    type = "month" value = {qual.end && new Date(qual.end).toISOString().slice(0,7)} className = "shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)] p-2 rounded-md text-black"/>
                                                </div>}
                                                <div className = "flex gap-2 items-center">
                                                    <input type = "checkbox" checked = {qual.ongoing} onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.education[eduindex].qualifications[qindex].ongoing = event.target.checked
                                                        setResumeToEdit(copy)
                                                    }}/>
                                                    <label>Ongoing</label>
                                                </div>
                                            </div>
                                            <input
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.education[eduindex].qualifications[qindex].grades = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            placeholder = "Grades (GPA: 7.00)" type = "text" value = {qual.grades} className = "p-2 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]"/>
                                            {qual.extras && <h1 className = "font-bold text-xl">Extras</h1>}
                                            
                                            <div className = 'flex flex-col gap-2'>
                                                {qual.extras?.map((extra, extraindex) => {
                                                    return <div key = {extraindex} className = "flex max-sm:flex-col gap-1 w-full items-center">
                                                        <input 
                                                        placeholder = "Distance Learning Programme"
                                                        className = "p-2 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" type = "text" value = {extra} onChange = {(event) => {
                                                        const newrn = event.target.value
                                                        const copy = {...resumeToEdit}
                                                        copy.education[eduindex].qualifications[qindex].extras[extraindex] = newrn
                                                        setResumeToEdit(copy)
                                                    }}/>
                                                    <button
                                                    type = "button"
                                                    onClick = {() => {
                                                        const copy = {...resumeToEdit}
                                                        copy.education[eduindex].qualifications[qindex].extras.splice(extraindex, 1)
                                                        setResumeToEdit(copy)
                                                    }}
                                                    className = "rounded-full bg-zinc-500 w-[20px] h-[20px]"><img src = "/closewhite.svg" /></button>
                                                    </div>
                                                })}
                                                <button
                                                type = "button"
                                                onClick = {() => {
                                                    const copy = {...resumeToEdit}
                                                    const newarray = [...copy.education[eduindex].qualifications[qindex].extras, ""]
                                                    copy.education[eduindex].qualifications[qindex].extras = newarray
                                                    setResumeToEdit(copy)
                                                }}
                                                className = "p-2 rounded-md bg-blue-700 text-white font-bold">ADD EXTRA</button>
                                            </div>
                                        </div>
                                    })}
                                    <button
                                    type = "button"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        const newarray = [...copy.education[eduindex].qualifications, {name : "", start: new Date(), end: new Date(), grades: "", ongoing: false, extras: []}]
                                        copy.education[eduindex].qualifications = newarray
                                        setResumeToEdit(copy)
                                    }}
                                    className = "p-2 bg-blue-700 text-white font-bold rounded-md">ADD QUALIFICATION</button>
                                </div>
                            </div>
                        })}
                        <button
                        type = "button"
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            const newarray = [...copy.education, {institution: "", qualifications: []}]
                            copy.education = newarray
                            setResumeToEdit(copy)
                        }}
                        className = "p-2 bg-blue-700 text-white font-bold rounded-md">+ ADD INSTITUTION</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


function ExperienceDetails ({resumeToEdit, setResumeToEdit, setExperienceEdit}) {

    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            {/* PROFESSIOINAL EXPERIENCE DETAILS */}
            <div className = "max-h-[90%] min-w-[60%] max-sm:w-[90%] max-sm:p-2 max-sm:text-sm max-sm:pt-12 overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setExperienceEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <h1 className = "font-extrabold max-sm:text-lg text-2xl">Professional Experience Details</h1>
                <div className = "flex flex-col gap-4 items-center">
                    <h2 className = "font-bold sm:text-xl">Organizations</h2>
                    {resumeToEdit.experience?.map((org, orgindex) => {
                        return <div key = {orgindex} className = "flex gap-2 relative flex-col text-zinc-950 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-950 max-sm:p-4 max-sm:pt-10 p-8 rounded-md w-full">
                            <h1 className = "font-extrabold text-center">Organization Number {orgindex + 1}</h1>
                            <input
                            type = "text"
                            onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.experience[orgindex].organization = event.target.value
                                setResumeToEdit(copy)
                            }}
                            value = {org.organization}
                            className = "text-black p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]"
                            placeholder = "Organization Name (Hewlett Packer Pvt Ltd)"
                            />
                            <div className = "flex flex-col gap-2">
                                <h3 className = "text-xl font-bold">Extras about the Organization</h3>
                                <div className = "grid sm:grid-cols-2 gap-2">
                                    {org.extras?.map((extra, extraindex) => {
                                        return <div key = {extraindex} className = "flex p-2 bg-sky-400/50 rounded-md gap-2">
                                            <input
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.experience[orgindex].extras[extraindex] = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 w-4/5 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Location, Incubated Under, etc." type = "text" value = {extra}/>
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                copy.experience[orgindex].extras.splice(extraindex, 1)
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 bg-white p-1 rounded-full shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                <img src = "/close.svg"/>
                                            </button>
                                        </div>
                                    })}
                                    <button
                                    type = "button"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        const newarr = [...copy.experience[orgindex].extras, ""]
                                        copy.experience[orgindex].extras = newarr
                                        setResumeToEdit(copy)
                                    }}
                                    className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                        <img src = "edit.svg" />ADD EXTRA
                                    </button>
                                </div>
                            </div>
                            <div className = "flex flex-col gap-2">
                                <h3 className = "text-xl font-bold">Roles</h3>
                                <div className = "flex flex-col gap-4">
                                    {org.roles?.map((role, roleindex) => {
                                        return <div key = {roleindex} className = "p-4 max-sm:p-2 relative rounded-md flex flex-col gap-4 bg-sky-400/50">
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                copy.experience[orgindex].roles.splice(roleindex, 1)
                                                setResumeToEdit(copy)
                                            }}
                                            className = "absolute top-2 right-2 rounded-full bg-red-700"><img src = "/closewhite.svg" /></button>
                                            <h1 className = "font-extrabold text-center">Role Number {roleindex + 1}</h1>
                                            <input
                                            type = "text"
                                            value = {role.rolename}
                                            onChange = {(event) => {
                                                const copy = {...resumeToEdit}
                                                copy.experience[orgindex].roles[roleindex].rolename = event.target.value
                                                setResumeToEdit(copy)
                                            }}
                                            
                                            placeholder = "Role Name (Front-End Engineer)"
                                            className = "p-2 text-black rounded-md w-full shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"/>

                                            <div className = "grid sm:grid-cols-2 gap-2">
                                                <div className = "flex flex-col gap-2">
                                                    <label className = "font-bold">Start</label>
                                                    <input
                                                    onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.experience[orgindex].roles[roleindex].start = event.target.value
                                                        setResumeToEdit(copy)
                                                    }}
                                                    type = "month" value = {role.start && new Date(role.start).toISOString().slice(0, 7)} className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                                </div>
                                                {!role.ongoing &&
                                                    <div className = "flex flex-col gap-2">
                                                    <label className= "font-bold">End</label>
                                                    <input
                                                    onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.experience[orgindex].roles[roleindex].end = event.target.value
                                                        setResumeToEdit(copy)
                                                    }}
                                                    type = "month" value = {role.end && new Date(role.end).toISOString().slice(0, 7)} className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                                </div>}
                                                <div className = "flex p-2 font-bold rounded-md items-center justify-center gap-2">
                                                    <input
                                                    onChange = {() => {
                                                        const copy = {...resumeToEdit}
                                                        copy.experience[orgindex].roles[roleindex].ongoing ? copy.experience[orgindex].roles[roleindex].ongoing = false : copy.experience[orgindex].roles[roleindex].ongoing = true
                                                        setResumeToEdit(copy)
                                                    }}
                                                    type = "checkbox" checked = {role.ongoing} />
                                                    Ongoing
                                                </div>
                                            </div>

                                            <div className = "flex flex-col gap-2">
                                                <h2 className = "font-bold">Role Summary</h2>
                                                <textarea
                                                value = {role.rolesummary}
                                                onChange = {(event) => {
                                                    const copy = {...resumeToEdit}
                                                    copy.experience[orgindex].roles[roleindex].rolesummary = event.target.value
                                                    setResumeToEdit(copy)
                                                }}
                                                placeholder = "Short Role Summary"
                                                className = "p-2 bg-sky-100 min-h-[80px] text-black rounded-md w-full shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"/>
                                            </div>
                                            <div className = "flex flex-col gap-2">
                                                <h3 className = "text-xl max-sm:text-sm font-bold">Points</h3>
                                                {role.points?.map((point, pointindex) => {
                                                    return <div key = {pointindex} className = "flex items-center gap-2">
                                                        <textarea
                                                        value = {point}
                                                        onChange = {(event) => {
                                                            const copy = {...resumeToEdit}
                                                            copy.experience[orgindex].roles[roleindex].points[pointindex] = event.target.value
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "p-2 w-full rounded-md text-black"
                                                        key = {pointindex}/>
                                                        <button
                                                        type = "button"
                                                        onClick = {() => {
                                                            const copy = {...resumeToEdit}
                                                            copy.experience[orgindex].roles[roleindex].points.splice(pointindex, 1)
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "rounded-full bg-red-500"
                                                        >
                                                            <img src = "/closewhite.svg"/>
                                                        </button>
                                                    </div>
                                                })}
                                                <button
                                                type = "button"
                                                onClick = {() => {
                                                    const copy = {...resumeToEdit}
                                                    const newarr = [...copy.experience[orgindex].roles[roleindex].points, ""]
                                                    copy.experience[orgindex].roles[roleindex].points = newarr
                                                    setResumeToEdit(copy)
                                                }}
                                                className = "p-2 text-white bg-blue-700 font-bold flex items-center justify-center rounded-md shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                                >
                                                    <img src = "/edit.svg" />ADD POINT
                                                </button>
                                            </div>
                                            <div className = "flex flex-col gap-2">
                                                <h3 className = "text-xl max-sm:text-sm font-bold">Extras about the role</h3>
                                                <div className = "grid sm:grid-cols-2 gap-2">
                                                    {role.extras?.map((extra, extraindex) => {
                                                        return <div key = {extraindex} className = "flex p-2 bg-sky-400/50 rounded-md gap-2">
                                                            <input
                                                            onChange = {(event) => {
                                                                const newrn = event.target.value
                                                                const copy = {...resumeToEdit}
                                                                copy.experience[orgindex].roles[roleindex].extras[extraindex] = newrn
                                                                setResumeToEdit(copy)
                                                            }}
                                                            className = "p-2 w-4/5 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Part-Time" type = "text" value = {extra}/>
                                                            <button
                                                            type = "button"
                                                            onClick = {() => {
                                                                const copy = {...resumeToEdit}
                                                                copy.experience[orgindex].roles[roleindex].extras.splice(extraindex, 1)
                                                                setResumeToEdit(copy)
                                                            }}
                                                            className = "p-2 bg-white p-1 rounded-full shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                                <img src = "/close.svg"/>
                                                            </button>
                                                        </div>
                                                    })}
                                                    <button
                                                    type = "button"
                                                    onClick = {() => {
                                                        const copy = {...resumeToEdit}
                                                        const newarr = [...copy.experience[orgindex].roles[roleindex].extras, ""]
                                                        copy.experience[orgindex].roles[roleindex].extras = newarr
                                                        setResumeToEdit(copy)
                                                    }}
                                                    className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                        <img src = "edit.svg" />ADD EXTRA
                                                    </button>
                                                </div>
                                            </div>
                                            <div className = "flex flex-col gap-2 ">
                                                <h3 className = "text-xl max-sm:text-sm font-bold">URLs</h3>
                                                <div className = "grid sm:grid-cols-2 grid-cols-1 gap-2">
                                                    {role.urls?.map((link, linkindex) => {
                                                        return <div key = {linkindex} className = "flex flex-col p-2 bg-sky-400/50 rounded-md gap-2">
                                                            <input
                                                            onChange = {(event) => {
                                                                const newrn = event.target.value
                                                                const copy = {...resumeToEdit}
                                                                copy.experience[orgindex].roles[roleindex].urls[linkindex].name = newrn
                                                                setResumeToEdit(copy)
                                                            }}
                                                            className = "p-2  rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Name of Link" type = "text" value = {link.name}/>
                                                            <textarea 
                                                            onChange = {(event) => {
                                                                const newrn = event.target.value
                                                                const copy = {...resumeToEdit}
                                                                copy.experience[orgindex].roles[roleindex].urls[linkindex].url = newrn
                                                                setResumeToEdit(copy)
                                                            }}
                                                            placeholder = "https://thishereisgonnabeyoururl.com/hehehe" type = "text" className = "text-black p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" value = {link.url} />
                                                            <button
                                                            type = "button"
                                                            onClick = {() => {
                                                                const copy = {...resumeToEdit}
                                                                copy.experience[orgindex].roles[roleindex].urls.splice(linkindex, 1)
                                                                setResumeToEdit(copy)
                                                            }}
                                                            className = "p-2 bg-red-700 p-1 font-bold text-white rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                                Remove URL
                                                            </button>
                                                        </div>
                                                    })}
                                                    <button
                                                    type = "button"
                                                    onClick = {() => {
                                                        const copy = {...resumeToEdit}
                                                        const newarr = [...copy.experience[orgindex].roles[roleindex].urls, {}]
                                                        copy.experience[orgindex].roles[roleindex].urls = newarr
                                                        setResumeToEdit(copy)
                                                    }}
                                                    className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                        <img src = "edit.svg" />ADD URL
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    })}
                                    <button
                                    type = "button"
                                    className = "p-2 flex items-center justify-center text-white font-bold rounded-md bg-blue-700 shadow-[0_2px_3px_1px_rgba(0,0,0,0.15)]"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        const newarr = [...copy.experience[orgindex].roles, {rolename : "", rolesummary: "", start: new Date(), end: new Date(), ongoing: false, points: [], extras: [], urls: []}]
                                        copy.experience[orgindex].roles = newarr
                                        setResumeToEdit(copy)
                                    }}>
                                        <img src = "/edit.svg" />ADD ROLE
                                    </button>
                                </div>
                            </div>
                            <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                copy.experience.splice(orgindex, 1)
                                setResumeToEdit(copy)
                            }}
                            className = "bg-red-700 rounded-full absolute right-2 top-2 shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                <img src = "/closewhite.svg" />
                            </button>
                        </div>
                    })}
                    <button
                    type = "button"
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        const newarr = [...copy.experience, { organization : "", urls : [], extras: [], roles: []}]
                        copy.experience = newarr
                        setResumeToEdit(copy)
                    }}
                    className = "font-bold text-white bg-blue-700 p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]"
                    >
                        ADD ORGANIZATION
                    </button>
                </div>
            </div>
        </div>
    )
}


function ProjectDetails ({setResumeToEdit, resumeToEdit, setProjectsEdit}) {
    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            {/* PROJECTS DETAILS */}
            <div className = "max-h-[90%] max-sm:w-[90%] min-w-[60%] max-sm:p-2 max-sm:pt-12 max-sm:text-sm overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setProjectsEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <h1 className = "font-extrabold max-sm:text-lg text-2xl">Project Details</h1>
                <div className = "flex flex-col gap-8">
                    {resumeToEdit.projects?.map((project, index) => {
                        return <div key = {index} className = "relative max-sm:p-2 flex flex-col gap-4 p-4 bg-zinc-100 rounded-md dark:bg-zinc-950 ">
                            <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                copy.projects.splice(index, 1)
                                setResumeToEdit(copy)
                            }}
                            className = "absolute top-2 right-2 rounded-full bg-red-700">
                                <img src = "/closewhite.svg" />
                            </button>
                            <h2 className= "text-center font-extrabold text-xl">Project Number {index+1}</h2>
                            <input
                            value = {project.projectname}
                            onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.projects[index].projectname = event.target.value
                                setResumeToEdit(copy)
                            }}
                            type = "text" placeholder = "Justin Bieber Stalker drone" className = "w-full p-2 text-black shadow-[0_2px_5px_1px_rgba(0,0,0,0.15)] rounded-md"/>
                            <div className = "flex flex-col gap-2">
                                <h1 className = "font-bold">Project Summary</h1>
                                <textarea
                                value = {project.projectsummary}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].projectsummary = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                placeholder = "Short Project Summary"
                                className = "p-2 bg-sky-100 min-h-[80px] text-black rounded-md w-full shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"/>
                            </div>
                            <div className = "flex flex-col gap-2 bg-sky-400/50 p-4 rounded-md">
                                <h2 className = "font-bold">Add Technologies Used</h2>
                                <div className = "flex flex-col gap-1">
                                    <label>Head</label>
                                    <input type = "text" value = {project.stack.head} onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.projects[index].stack.head = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    className= "p-2 rounded-md text-black shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                    placeholder = "Tech Stack"/>
                                </div>
                                <div className = "flex flex-col gap-1">
                                    <label>Content</label>
                                    <textarea type = "text" value = {project.stack.content} onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.projects[index].stack.content = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    className= "p-2 w-full text-black rounded-md shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                    placeholder = "React.js, MongoDB, Express.js, Node.js, Git, Framer Motion"/>
                                </div>
                            </div>
                            <div className = "flex flex-col gap-2">
                                <h3 className = "text-xl font-bold">Points</h3>
                                {project.points?.map((point, pointindex) => {
                                    return <div key = {pointindex} className = "flex items-center gap-2">
                                        <textarea
                                        value = {point}
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.projects[index].points[pointindex] = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        className = "p-2 w-full rounded-md text-black"
                                        key = {pointindex}/>
                                        <button
                                        type = "button"
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.projects[index].points.splice(pointindex, 1)
                                            setResumeToEdit(copy)
                                        }}
                                        className = "rounded-full bg-red-500"
                                        >
                                            <img src = "/closewhite.svg"/>
                                        </button>
                                    </div>
                                })}
                                <button
                                type = "button"
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.projects[index].points, ""]
                                    copy.projects[index].points = newarr
                                    setResumeToEdit(copy)
                                }}
                                className = "p-2 text-white bg-blue-700 font-bold flex items-center justify-center rounded-md shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                >
                                    <img src = "/edit.svg" />ADD POINT
                                </button>
                            </div>
                            <div className = "flex flex-col gap-2">
                                <h3 className = "text-xl font-bold">URLs</h3>
                                <div className = "grid sm:grid-cols-2 grid-cols-1 gap-2">
                                    {project.urls?.map((link, linkindex) => {
                                        return <div key = {linkindex} className = "flex flex-col p-2 bg-sky-400/50 rounded-md gap-2">
                                            <input
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.projects[index].urls[linkindex].name = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Name of Link" type = "text" value = {link.name}/>
                                            <textarea 
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.projects[index].urls[linkindex].url = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            placeholder = "https://thishereisgonnabeyoururl.com/hehehe" type = "text" className = "text-black p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" value = {link.url} />
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                copy.projects[index].urls.splice(linkindex, 1)
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 bg-red-700 p-1 font-bold text-white rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                Remove URL
                                            </button>
                                        </div>
                                    })}
                                    <button
                                    type = "button"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        const newarr = [...copy.projects[index].urls, {}]
                                        copy.projects[index].urls = newarr
                                        setResumeToEdit(copy)
                                    }}
                                    className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                        <img src = "edit.svg" />ADD URL
                                    </button>
                                </div>
                            </div>
                            <div className = "grid sm:grid-cols-2 gap-2">
                                <div className = "flex flex-col gap-2">
                                    <label className = "font-bold">Start</label>
                                    <input
                                    onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.projects[index].start = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    type = "date" value = {project.start && new Date(project.start).toISOString().slice(0, 10)} className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                </div>
                                {!project.ongoing &&
                                    <div className = "flex flex-col gap-2">
                                    <label className= "font-bold">End</label>
                                    <input
                                    onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.projects[index].end = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    type = "date" value = {project.end && new Date(project.end).toISOString().slice(0, 10)} className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                </div>}
                                <div className = "flex p-2 font-bold rounded-md items-center justify-center gap-2">
                                    <input
                                    onChange = {() => {
                                        const copy = {...resumeToEdit}
                                        copy.projects[index].ongoing ? copy.projects[index].ongoing = false : copy.projects[index].ongoing = true
                                        setResumeToEdit(copy)
                                    }}
                                    type = "checkbox" checked = {project.ongoing} />
                                    Ongoing
                                </div>
                            </div>
                            <div className = "flex flex-col gap-2">
                                <h3 className = "text-xl font-bold">Extras about the Project</h3>
                                <div className = "grid sm:grid-cols-2 gap-2">
                                    {project.extras?.map((extra, extraindex) => {
                                        return <div key = {extraindex} className = "flex p-2 bg-sky-400/50 rounded-md gap-2">
                                            <input
                                            onChange = {(event) => {
                                                const newrn = event.target.value
                                                const copy = {...resumeToEdit}
                                                copy.projects[index].extras[extraindex] = newrn
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 w-4/5 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Part-Time" type = "text" value = {extra}/>
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                copy.projects[index].extras.splice(extraindex, 1)
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 bg-white p-1 rounded-full shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                <img src = "/close.svg"/>
                                            </button>
                                        </div>
                                    })}
                                    <button
                                    type = "button"
                                    onClick = {() => {
                                        const copy = {...resumeToEdit}
                                        const newarr = [...copy.projects[index].extras, ""]
                                        copy.projects[index].extras = newarr
                                        setResumeToEdit(copy)
                                    }}
                                    className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                        <img src = "edit.svg" />ADD EXTRA
                                    </button>
                                </div>
                            </div>
                        </div>
                    })}
                    <button
                    type = "button"
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        copy.projects = [...copy.projects, {projectname: "", projectsummary: "", start: new Date(), stack: {}, end: new Date(), urls: [], points: [], extras: []}]
                        setResumeToEdit(copy)
                    }}
                    className = "bg-blue-700 p-2 rounded-md text-white font-bold flex items-center justify-center"
                    >
                        <img src = "/edit.svg" />ADD PROJECT
                    </button>
                </div>
            </div>
        </div>
    )
}

function SkillsDetails ({resumeToEdit, setResumeToEdit, setSkillsEdit}) {
    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            <div className = "max-h-[90%] max-sm:w-[90%] min-w-[60%] max-sm:p-2 max-sm:text-sm max-sm:pt-12 overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setSkillsEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <div className = "flex flex-col gap-6">
                    <h1 className = "font-bold max-sm:text-lg text-2xl">Skills Details</h1>
                    {resumeToEdit.skills.map((skill, skillindex) => {
                    return <div key = {skillindex} className = "relative flex flex-col gap-2 bg-sky-400/50 p-4 rounded-md">
                        <h2 className = "font-bold text-center">Skillset Number {skillindex + 1}</h2>
                        <div className = "flex flex-col gap-1">
                            <label>Type of Skills</label>
                            <input type = "text" value = {skill.head} onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.skills[skillindex].head = event.target.value
                                setResumeToEdit(copy)
                            }}
                            className= "p-2 rounded-md text-black shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                            placeholder = "Eg. Frameworks & Tools... or... Programming Languages"/>
                        </div>
                        <div className = "flex flex-col gap-1">
                            <label>Names of the Skills</label>
                            <textarea type = "text" value = {skill.content} onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.skills[skillindex].content = event.target.value
                                setResumeToEdit(copy)
                            }}
                            className= "p-2 w-full text-black rounded-md shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                            placeholder = "React.js, MongoDB, Express.js, Node.js, Git, Framer Motion"/>
                        </div>
                        <button
                        type = "button"
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            copy.skills.splice(skillindex, 1)
                            setResumeToEdit(copy)
                        }}
                        className = "bg-red-700 absolute top-2 right-2 rounded-full">
                            <img src = "/closewhite.svg"/>
                        </button>
                    </div>
                    })}
                    <button
                    type = "button"
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        copy.skills = [...copy.skills, {head: "", content: ""}]
                        setResumeToEdit(copy)
                    }}
                    className = "bg-blue-700 text-white font-bold flex items-center gap-2 items-center justify-center p-2 rounded-md">
                        <img src = "/edit.svg" />ADD SKILLSET                        
                    </button>
                </div>
                    
            </div>
        </div>
    )
}


function ExtraSectionDetails ({setResumeToEdit, resumeToEdit, setExtraSectionsEdit}) {
    return (
        <div className = "fixed top-0 left-0 z-50 h-screen flex flex-col items-center justify-center w-screen bg-zinc-100/30 dark:bg-zinc-950/30 backdrop-blur">
            <div className = "max-h-[90%] max-sm:w-[90%] min-w-[60%] max-sm:text-sm max-sm:p-2 max-sm:pt-12 overflow-hidden relative overflow-y-auto dark:bg-zinc-700 flex flex-col gap-4 bg-zinc-200 p-5 rounded-xl shadow-[0_2px_5px_1px_rgba(0,0,0,0.25)]">
                <button
                onClick={() => setExtraSectionsEdit(false)}
                type = "button"
                className = "absolute top-3 right-3 py-1 px-2 rounded-md text-blue-700 font-bold">
                    DONE
                </button>
                <h1 className = "font-extrabold max-sm:text-lg text-2xl">Extra Sections</h1>
                <div className = "flex flex-col gap-4">
                    {resumeToEdit.extraSections?.map((section, sectionindex) => {
                        return <div key = {sectionindex} className = "relative flex p-4 max-sm:p-2 max-sm:pt-8 rounded-md gap-6 flex-col bg-zinc-100 dark:bg-zinc-950">
                            <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                copy.extraSections.splice(sectionindex, 1)
                                setResumeToEdit(copy)
                            }}
                            className = "absolute top-2 right-2 rounded-full bg-red-700">
                                <img src = "/closewhite.svg" />
                            </button>
                            <h1 className = "text-center sm:text-xl font-extrabold">Section Number {sectionindex + 1}</h1>
                            <div className = "flex flex-col gap-2">
                                <label className = "font-semibold">Enter New Section Title</label>
                                <input placeholder = "Certifications, Achievements, Extra-Curriculars, etc." type = "text" value = {section.sectionName} className = "p-2 rounded-md text-black shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.extraSections[sectionindex].sectionName = event.target.value
                                    setResumeToEdit(copy)
                                }} />
                            </div>
                            <div className = "flex flex-col items-start gap-4">
                                <h1 className= "font-bold text-xl">Subsections</h1>
                                {section.subsections?.map((project, index) => {
                                    return <div key = {index} className = "relative flex flex-col w-full gap-4 p-4 max-sm:p-2 max-sm:pt-8 bg-sky-400/50 rounded-md">
                                        <button
                                        type = "button"
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections.splice(index, 1)
                                            setResumeToEdit(copy)
                                        }}
                                        className = "absolute top-2 right-2 rounded-full bg-red-700">
                                            <img src = "/closewhite.svg" />
                                        </button>
                                        <h2 className= "text-center font-extrabold">Subsection Number {index+1}</h2>
                                        <input
                                        value = {project.title}
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].title = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        type = "text" placeholder = "Justin Bieber Stalker drone" className = "w-full p-2 text-black shadow-[0_2px_5px_1px_rgba(0,0,0,0.15)] rounded-md"/>
                                        <div className = "flex flex-col gap-2">
                                            <h1 className = "font-bold">Subsection Summary</h1>
                                            <textarea
                                            value = {project.summary}
                                            onChange = {(event) => {
                                                const copy = {...resumeToEdit}
                                                copy.extraSections[sectionindex].subsections[index].summary = event.target.value
                                                setResumeToEdit(copy)
                                            }}
                                            placeholder = "Short Project Summary"
                                            className = "p-2 bg-sky-100 min-h-[80px] text-black rounded-md w-full shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"/>
                                        </div>
                                        
                                        <div className = "flex flex-col gap-2">
                                            <h3 className = "text-xl font-bold">Points</h3>
                                            {project.points?.map((point, pointindex) => {
                                                return <div key = {pointindex} className = "flex items-center gap-2">
                                                    <textarea
                                                    value = {point}
                                                    onChange = {(event) => {
                                                        const copy = {...resumeToEdit}
                                                        copy.extraSections[sectionindex].subsections[index].points[pointindex] = event.target.value
                                                        setResumeToEdit(copy)
                                                    }}
                                                    className = "p-2 w-full rounded-md text-black"
                                                    key = {pointindex}/>
                                                    <button
                                                    type = "button"
                                                    onClick = {() => {
                                                        const copy = {...resumeToEdit}
                                                        copy.extraSections[sectionindex].subsections[index].points.splice(pointindex, 1)
                                                        setResumeToEdit(copy)
                                                    }}
                                                    className = "rounded-full bg-red-500"
                                                    >
                                                        <img src = "/closewhite.svg"/>
                                                    </button>
                                                </div>
                                            })}
                                            <button
                                            type = "button"
                                            onClick = {() => {
                                                const copy = {...resumeToEdit}
                                                const newarr = [...copy.extraSections[sectionindex].subsections[index].points, ""]
                                                copy.extraSections[sectionindex].subsections[index].points = newarr
                                                setResumeToEdit(copy)
                                            }}
                                            className = "p-2 text-white bg-blue-700 font-bold flex items-center justify-center rounded-md shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)]"
                                            >
                                                <img src = "/edit.svg" />ADD POINT
                                            </button>
                                        </div>
                                        <div className = "flex flex-col gap-2">
                                            <h3 className = "text-xl font-bold">URLs</h3>
                                            <div className = "grid sm:grid-cols-2 grid-cols-1 gap-2">
                                                {project.urls?.map((link, linkindex) => {
                                                    return <div key = {linkindex} className = "flex flex-col p-2 bg-sky-400/50 rounded-md gap-2">
                                                        <input
                                                        onChange = {(event) => {
                                                            const newrn = event.target.value
                                                            const copy = {...resumeToEdit}
                                                            copy.extraSections[sectionindex].subsections[index].urls[linkindex].name = newrn
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "p-2 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Name of Link" type = "text" value = {link.name}/>
                                                        <textarea 
                                                        onChange = {(event) => {
                                                            const newrn = event.target.value
                                                            const copy = {...resumeToEdit}
                                                            copy.extraSections[sectionindex].subsections[index].urls[linkindex].url = newrn
                                                            setResumeToEdit(copy)
                                                        }}
                                                        placeholder = "https://thishereisgonnabeyoururl.com/hehehe" type = "text" className = "text-black p-2 rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" value = {link.url} />
                                                        <button
                                                        type = "button"
                                                        onClick = {() => {
                                                            const copy = {...resumeToEdit}
                                                            copy.extraSections[sectionindex].subsections[index].urls.splice(linkindex, 1)
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "p-2 bg-red-700 p-1 font-bold text-white rounded-md shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                            Remove URL
                                                        </button>
                                                    </div>
                                                })}
                                                <button
                                                type = "button"
                                                onClick = {() => {
                                                    const copy = {...resumeToEdit}
                                                    const newarr = [...copy.extraSections[sectionindex].subsections[index].urls, {}]
                                                    copy.extraSections[sectionindex].subsections[index].urls = newarr
                                                    setResumeToEdit(copy)
                                                }}
                                                className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                    <img src = "edit.svg" />ADD URL
                                                </button>
                                            </div>
                                        </div>
                                        <div className = "grid sm:grid-cols-2 gap-2">
                                            <div className = "flex flex-col gap-2">
                                                <label className = "font-bold">Start</label>
                                                <input
                                                onChange = {(event) => {
                                                    const copy = {...resumeToEdit}
                                                    copy.extraSections[sectionindex].subsections[index].start = event.target.value
                                                    setResumeToEdit(copy)
                                                }}
                                                type = "month" 
                                                value={project.start && new Date(project.start).toISOString().slice(0, 7)} 
                                                className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                            </div>
                                            {!project.ongoing &&
                                                <div className = "flex flex-col gap-2">
                                                <label className= "font-bold">End</label>
                                                <input
                                                onChange = {(event) => {
                                                    const copy = {...resumeToEdit}
                                                    copy.extraSections[sectionindex].subsections[index].end = event.target.value
                                                    setResumeToEdit(copy)
                                                }}
                                                type = "month"
                                                value={project.end && new Date(project.end).toISOString().slice(0, 7)} 
                                                className = "shadow-[0_2px_3px_1px_rgba(0,0,0,0.25)] text-black p-2 rounded-md"/> 
                                            </div>}
                                            <div className = "flex p-2 font-bold rounded-md items-center justify-center gap-2">
                                                <input
                                                onChange = {() => {
                                                    const copy = {...resumeToEdit}
                                                    copy.extraSections[sectionindex].subsections[index].ongoing ? copy.extraSections[sectionindex].subsections[index].ongoing = false : copy.extraSections[sectionindex].subsections[index].ongoing = true
                                                    setResumeToEdit(copy)
                                                }}
                                                type = "checkbox" checked = {project.ongoing} />
                                                Ongoing
                                            </div>
                                        </div>
                                        <div className = "flex flex-col gap-2">
                                            <h3 className = "text-xl font-bold">Extras about the SubSection</h3>
                                            <div className = "grid sm:grid-cols-2 gap-2">
                                                {project.extras?.map((extra, extraindex) => {
                                                    return <div key = {extraindex} className = "flex p-2 bg-sky-400/50 rounded-md gap-2">
                                                        <input
                                                        onChange = {(event) => {
                                                            const newrn = event.target.value
                                                            const copy = {...resumeToEdit}
                                                            copy.extraSections[sectionindex].subsections[index].extras[extraindex] = newrn
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "p-2 w-4/5 rounded-md text-black shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]" placeholder = "Part-Time" type = "text" value = {extra}/>
                                                        <button
                                                        type = "button"
                                                        onClick = {() => {
                                                            const copy = {...resumeToEdit}
                                                            copy.extraSections[sectionindex].subsections[index].extras.splice(extraindex, 1)
                                                            setResumeToEdit(copy)
                                                        }}
                                                        className = "p-2 bg-white p-1 rounded-full shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                            <img src = "/close.svg"/>
                                                        </button>
                                                    </div>
                                                })}
                                                <button
                                                type = "button"
                                                onClick = {() => {
                                                    const copy = {...resumeToEdit}
                                                    const newarr = [...copy.extraSections[sectionindex].subsections[index].extras, ""]
                                                    copy.extraSections[sectionindex].subsections[index].extras = newarr
                                                    setResumeToEdit(copy)
                                                }}
                                                className = "bg-blue-700 font-bold flex items-center justify-center p-2 rounded-md text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.15)]">
                                                    <img src = "edit.svg" />ADD EXTRA
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                })}
                                <button
                                type = "button"
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.extraSections[sectionindex].subsections = [...copy.extraSections[sectionindex].subsections, {title: "", summary: "", start: new Date(), end: new Date (), ongoing: false, points : [], urls: [], extras: []}]
                                    setResumeToEdit(copy)
                                }}
                                className = "p-2 bg-blue-700 font-bold text-white flex items-center justify-center rounded-md">
                                    <img src = "/edit.svg" />ADD SUBSECTION
                                </button>
                            </div>
                        </div>
                    })}
                    <button
                    type = "button"
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        copy.extraSections = [...copy.extraSections, { sectionName : "", subsections: []}]
                        setResumeToEdit(copy)
                    }}
                    className = "p-2 bg-blue-700 font-bold text-white flex items-center justify-center rounded-md">
                        <img src = "/edit.svg" />ADD NEW SECTION
                    </button>
                </div>
            </div>
        </div>
    )
}