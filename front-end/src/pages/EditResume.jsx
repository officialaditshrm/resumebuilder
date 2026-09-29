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
import { useState, useEffect, useId, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Notice, Spinner, Title, useAnimatedClose } from '../components/ui.jsx'

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
    const [summaryEdit, setSummaryEdit] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)
    const mounted = useRef(true)
    useEffect(() => () => { mounted.current = false }, [])


    useEffect(() => {
        if (!currResumeData) {
            navigate("/")
        }
        setResumeToEdit({...currResumeData})
    }, [])


    if (resumeToEdit) {
        return (
            <div className = "mt-[25vh] flex gap-8 flex-col min-h-screen sm:p-10 p-5 max-md:[20vh] md:ml-72">
                <div className = "ui w-full max-w-3xl mx-auto flex flex-col gap-3">
                    <Title>Edit resume</Title>
                    <p className = "ui-lede">Changes show in the preview below as you type. Nothing is saved until you press Save resume.</p>
                </div>
                <form
                onSubmit = {async (event) => {
                    event.preventDefault()
                    if (saving) return
                    setSaving(true)
                    setSaveError(null)
                    // Leave the page only once the server has the changes.
                    const saved = await updateResume(currResumeData._id, resumeToEdit)
                    if (!mounted.current) return
                    setSaving(false)
                    if (saved) navigate("/myresumes")
                    else setSaveError("Couldn't save. Check your connection and try again. Your changes are still here.")
                }}
                aria-busy = {saving}
                className = "ui w-full max-w-3xl mx-auto flex flex-col gap-8">
                    <fieldset disabled = {saving} className = "contents">
                    {/* META */}
                    <section id = "meta" aria-labelledby = "meta-heading" className = "flex flex-col gap-4">
                        <h2 id = "meta-heading" className = "ui-h2">Resume details</h2>
                        <div className = "ui-sheet p-5 sm:p-6 grid sm:grid-cols-2 gap-5">
                            <Lab label = "Resume name" help = "Only you see this.">
                                <input
                                required
                                className = "ui-input"
                                type = "text" value = {resumeToEdit.name} onChange = {(event) => {
                                    const newrn = event.target.value
                                    setResumeToEdit((prev) => 
                                    ({
                                        ...prev,
                                        name: newrn
                                    })
                                    )
                                }}/>
                            </Lab>
                            <Lab label = "Applicant name" help = "Printed at the top of the resume.">
                                <input
                                required
                                className = "ui-input"
                                autoComplete = "name"
                                type = "text" value = {resumeToEdit.username} onChange = {(event) => {
                                    const newrn = event.target.value
                                    setResumeToEdit((prev) => 
                                    ({
                                        ...prev,
                                        username: newrn
                                    })
                                    )
                                }}/>
                            </Lab>
                        </div>
                    </section>

                    <section aria-labelledby = "contents-heading" className = "flex flex-col gap-4">
                        <div>
                            <h2 id = "contents-heading" className = "ui-h2">Sections</h2>
                            <p className = "ui-help mt-1">Sections you leave empty don't appear on the resume.</p>
                        </div>
                        <ul className = "ui-sheet ui-divide overflow-hidden">
                            <SectionRow title = "Header" summary = {headerSummary(resumeToEdit)} onClick = {() => setHeaderEdit(true)} />
                            <SectionRow title = "Summary" summary = {textSummary(resumeToEdit.resumesummary)} onClick = {() => setSummaryEdit(true)} />
                            <SectionRow title = "Education" summary = {countSummary(resumeToEdit.education, 'institution', 'institutions')} onClick = {() => setEducationEdit(true)} />
                            <SectionRow title = "Experience" summary = {experienceSummary(resumeToEdit.experience)} onClick = {() => setExperienceEdit(true)} />
                            <SectionRow title = "Projects" summary = {countSummary(resumeToEdit.projects, 'project', 'projects')} onClick = {() => setProjectsEdit(true)} />
                            <SectionRow title = "Skills" summary = {countSummary(resumeToEdit.skills, 'skill group', 'skill groups')} onClick = {() => setSkillsEdit(true)} />
                            <SectionRow title = "Extra sections" summary = {extrasSummary(resumeToEdit.extraSections)} onClick = {() => setExtraSectionsEdit(true)} />
                        </ul>
                    </section>

                    </fieldset>
                    {saveError && <Notice tone = "error">{saveError}</Notice>}
                    <div className = "flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-rule pt-6">
                        <button
                        onClick = {() => {setCurrResumeData(null); navigate("/")}}
                        disabled = {saving}
                        className = "ui-btn ui-btn-secondary"
                        type = "button">
                            Cancel
                        </button>
                        <button
                        className = "ui-btn ui-btn-primary px-6 min-w-[9.5rem]"
                        disabled = {saving}
                        type = "submit">
                            {saving ? <><Spinner />Saving…</> : "Save resume"}
                        </button>
                    </div>
                    {headerEdit && <HeaderDetails resumeToEdit={resumeToEdit} setHeaderEdit={setHeaderEdit} setResumeToEdit={setResumeToEdit}/>}
                    {summaryEdit && <SummaryDetails resumeToEdit={resumeToEdit} setSummaryEdit={setSummaryEdit} setResumeToEdit={setResumeToEdit}/>}
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



/* ------------------------------------------------------------------
   Form building blocks for the section editors
   ------------------------------------------------------------------ */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

function countSummary(list, one, many) {
    const n = list?.length || 0
    return n ? plural(n, one, many) : 'Empty'
}

function textSummary(text) {
    const t = (text || '').trim()
    if (!t) return 'Empty'
    return t.length > 70 ? t.slice(0, 70).trimEnd() + '…' : t
}

function headerSummary(r) {
    const place = [r.city, r.state, r.country].filter(Boolean).join(', ')
    const parts = [place, r.email].filter(Boolean)
    return parts.length ? parts.join(', ') : 'Empty'
}

function experienceSummary(list) {
    const n = list?.length || 0
    if (!n) return 'Empty'
    const roles = list.reduce((sum, org) => sum + (org.roles?.length || 0), 0)
    return `${plural(n, 'organization', 'organizations')}, ${plural(roles, 'role', 'roles')}`
}

function extrasSummary(list) {
    const names = (list || []).map((s) => (s.sectionName || '').trim() || 'Untitled')
    return names.length ? names.join(', ') : 'None'
}

function SectionRow({ title, summary, onClick }) {
    const empty = summary === 'Empty' || summary === 'None'
    return (
        <li>
            <button type = "button" onClick = {onClick} className = "w-full text-left flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-ink/[0.03]">
                <span className = "min-w-0 flex-1">
                    <span className = "block font-bold text-[17px]">{title}</span>
                    <span className = {`block truncate text-sm ${empty ? 'text-graphite/80' : 'text-graphite'}`}>{summary}</span>
                </span>
                <span className = "shrink-0 text-sm font-semibold flex items-center gap-1">{empty ? 'Add' : 'Edit'}<Icon name = "chevron" size = {14} /></span>
            </button>
        </li>
    )
}

// Full-screen on phones, a large panel on wider screens. Edits apply live, so "Done" only closes.
let sheetOpenedAt = 0

function EditorSheet({ title, description, onDone, children }) {
    const titleId = useId()
    const panelRef = useRef(null)
    const [closing, close] = useAnimatedClose(onDone)
    useState(() => { sheetOpenedAt = Date.now() })
    useEffect(() => {
        const previouslyFocused = document.activeElement
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        panelRef.current?.focus()
        const onKey = (e) => { if (e.key === 'Escape') close() }
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            previouslyFocused?.focus?.()
        }
    }, [])
    return (
        <div className = "ui fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-6">
            <div className = {`${closing ? 'ui-fade-out' : 'ui-fade'} absolute inset-0 bg-black/45`} onClick = {close} aria-hidden = "true" />
            <div
            ref = {panelRef}
            role = "dialog"
            aria-modal = "true"
            aria-labelledby = {titleId}
            tabIndex = {-1}
            // These editors live inside the resume <form>; stop Enter in a field from saving and leaving the page.
            onKeyDown = {(e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.preventDefault() }}
            className = {`${closing ? 'ui-dialog-out' : 'ui-dialog-in'} relative flex flex-col w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[92vh] bg-canvas text-ink sm:rounded-[18px] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] focus:outline-none`}>
                <div className = "shrink-0 flex items-center justify-between gap-4 h-16 px-5 sm:px-7 bg-sheet border-b border-rule">
                    <h2 id = {titleId} className = "font-bold text-lg truncate">{title}</h2>
                    <button type = "button" onClick = {close} className = "ui-btn ui-btn-primary ui-btn-sm px-5">Done</button>
                </div>
                <div className = "flex-1 overflow-y-auto px-4 sm:px-7 py-6 flex flex-col gap-6">
                    {description && <p className = "ui-help -mb-2">{description}</p>}
                    {children}
                </div>
            </div>
        </div>
    )
}

function Lab({ label, help, children, className = '' }) {
    return (
        <label className = {`block min-w-0 ${className}`}>
            <span className = "ui-label">{label}</span>
            {children}
            {help && <span className = "ui-help mt-1.5 block">{help}</span>}
        </label>
    )
}

// Level 1: an institution, organization, project, skill group or section
const useAddedLater = () => useState(() => Date.now() - sheetOpenedAt > 300)[0]

function Block({ title, onRemove, removeLabel, children }) {
    const added = useAddedLater()
    return (
        <div className = {`${added ? 'ui-item-in' : ''} ui-sheet p-4 sm:p-6 flex flex-col gap-5`}>
            <div className = "flex items-center justify-between gap-3 -mt-1">
                <h3 className = "font-bold text-[17px]">{title}</h3>
                {onRemove && <RemoveButton onClick = {onRemove} label = {removeLabel} />}
            </div>
            {children}
        </div>
    )
}

// Level 2: a qualification, role or subsection inside a block
function SubBlock({ title, onRemove, removeLabel, children }) {
    const added = useAddedLater()
    return (
        <div className = {`${added ? 'ui-item-in' : ''} rounded-[12px] border border-rule bg-wash p-4 sm:p-5 flex flex-col gap-4`}>
            <div className = "flex items-center justify-between gap-3 -mt-1">
                <h4 className = "font-semibold">{title}</h4>
                {onRemove && <RemoveButton onClick = {onRemove} label = {removeLabel} />}
            </div>
            {children}
        </div>
    )
}

function Group({ title, help, children }) {
    return (
        <div className = "flex flex-col gap-2.5">
            <div>
                <h4 className = "text-sm font-semibold">{title}</h4>
                {help && <p className = "ui-help">{help}</p>}
            </div>
            {children}
        </div>
    )
}

function RemoveButton({ onClick, label, text = 'Remove' }) {
    return (
        <button type = "button" onClick = {onClick} aria-label = {label} className = "ui-btn ui-btn-ghost ui-btn-sm text-danger px-2.5 -mr-2 gap-1.5">
            <Icon name = "delete" size = {18} />{text}
        </button>
    )
}

function IconRemove({ onClick, label }) {
    return (
        <button type = "button" onClick = {onClick} aria-label = {label} title = {label} className = "shrink-0 h-11 w-11 inline-flex items-center justify-center rounded-lg text-graphite hover:text-danger hover:bg-danger/[0.08]">
            <Icon name = "close" size = {20} />
        </button>
    )
}

function AddButton({ onClick, children }) {
    return (
        <button type = "button" onClick = {onClick} className = "w-full min-h-11 py-2.5 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-field-edge text-[15px] font-semibold text-ink hover:bg-ink/[0.04] hover:border-ink">
            <Icon name = "add" size = {18} />{children}
        </button>
    )
}

function Ongoing({ children }) {
    return (
        <label className = "inline-flex items-center gap-2.5 min-h-11 text-[15px] font-semibold cursor-pointer select-none">
            {children}
            Ongoing
        </label>
    )
}

function HeaderDetails ({resumeToEdit, setHeaderEdit, setResumeToEdit}) {
    return (
        <EditorSheet title = "Header" description = "Where you are and how to reach you. This sits under your name at the top of the resume." onDone = {() => setHeaderEdit(false)}>
            <Block title = "Location">
                <div className = "grid sm:grid-cols-2 gap-4">
                    <Lab label = "City">
                        <input
                        className = "ui-input" autoComplete = "address-level2"
                        type = "text" value = {resumeToEdit.city} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                city: newrn
                            })
                            )
                        }}/>
                    </Lab>
                    <Lab label = "State">
                        <input
                        className = "ui-input" autoComplete = "address-level1"
                        type = "text" value = {resumeToEdit.state} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                state: newrn
                            })
                            )
                        }}/>
                    </Lab>
                    <Lab label = "Country">
                        <input
                        className = "ui-input" autoComplete = "country-name"
                        type = "text" value = {resumeToEdit.country} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                country: newrn
                            })
                            )
                        }}/>
                    </Lab>
                    <Lab label = "PIN code">
                        <input
                        className = "ui-input" autoComplete = "postal-code" inputMode = "numeric"
                        type = "text" value = {resumeToEdit.pincode} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                pincode: newrn
                            })
                            )
                        }}/>
                    </Lab>
                </div>
            </Block>
            <Block title = "Contact">
                <div className = "grid sm:grid-cols-2 gap-4">
                    <Lab label = "Phone" help = "Hidden in on-screen previews, printed on the PDF you export.">
                        <input
                        className = "ui-input" autoComplete = "tel" inputMode = "tel"
                        type = "text" value = {resumeToEdit.phonenum} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                phonenum: newrn
                            })
                            )
                        }}/>
                    </Lab>
                    <Lab label = "Email">
                        <input
                        className = "ui-input" autoComplete = "email" inputMode = "email"
                        type = "text" value = {resumeToEdit.email} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                email: newrn
                            })
                            )
                        }}/>
                    </Lab>
                    <Lab label = "Second email (optional)">
                        <input
                        className = "ui-input" inputMode = "email"
                        type = "text" value = {resumeToEdit.email2} onChange = {(event) => {
                            const newrn = event.target.value
                            setResumeToEdit((prev) => 
                            ({
                                ...prev,
                                email2: newrn
                            })
                            )
                        }}/>
                    </Lab>
                </div>
            </Block>
            <Block title = "Links">
                <p className = "ui-help -mt-3">LinkedIn, GitHub, portfolio. The name is what appears on the resume; it links to the address.</p>
                {resumeToEdit.header_urls?.map((link, linkindex) => {
                    return <div key = {linkindex} className = "ui-item-in grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] gap-3 items-end">
                        <Lab label = "Name">
                            <input
                            onChange = {(event) => {
                                const newrn = event.target.value
                                const copy = {...resumeToEdit}
                                copy.header_urls[linkindex].name = newrn
                                setResumeToEdit(copy)
                            }}
                            className = "ui-input" placeholder = "LinkedIn" type = "text" value = {link.name}/>
                        </Lab>
                        <Lab label = "Address">
                            <input 
                            onChange = {(event) => {
                                const newrn = event.target.value
                                const copy = {...resumeToEdit}
                                copy.header_urls[linkindex].url = newrn
                                setResumeToEdit(copy)
                            }}
                            placeholder = "https://linkedin.com/in/your-name" type = "text" inputMode = "url" className = "ui-input" value = {link.url} />
                        </Lab>
                        <IconRemove
                        label = {`Remove link ${linkindex + 1}`}
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            copy.header_urls.splice(linkindex, 1)
                            setResumeToEdit(copy)
                        }}/>
                    </div>
                })}
                <AddButton
                onClick = {() => {
                    const copy = {...resumeToEdit}
                    const newarr = [...copy.header_urls, { name: "", url: ""}]
                    copy.header_urls = newarr
                    setResumeToEdit(copy)
                }}>Add link</AddButton>
            </Block>
        </EditorSheet>
    )
}

function SummaryDetails ({resumeToEdit, setResumeToEdit, setSummaryEdit}) {

    return (
        <EditorSheet title = "Summary" description = "Two or three sentences on who you are and what you're best at. Lead with results." onDone = {() => setSummaryEdit(false)}>
            <div className = "ui-sheet p-4 sm:p-6">
                <Lab label = "Resume summary">
                    <textarea 
                    value = {resumeToEdit.resumesummary}
                    onChange={(e) => {
                        const resumesummary = e.target.value
                        setResumeToEdit((prev) => ({
                            ...prev,
                            resumesummary
                        }))
                    }}
                    rows = {7}
                    className = "ui-input"
                    placeholder = "Backend developer with 2 years of Node.js experience. Built payment services handling 1M+ transactions a day."
                    />
                </Lab>
            </div>
        </EditorSheet>
    )
}

function EducationDetails ({resumeToEdit, setResumeToEdit, setEducationEdit}) {
    return (
        <EditorSheet title = "Education" description = "Add each school or college, then the qualifications you earned there." onDone = {() => setEducationEdit(false)}>
            {resumeToEdit?.education?.map((edu, eduindex) => {
                return <Block key = {eduindex} title = {`Institution ${eduindex + 1}`} removeLabel = {`Remove institution ${eduindex + 1}`}
                onRemove = {() => {
                    const copy = {...resumeToEdit}
                    copy.education.splice(eduindex, 1)
                    setResumeToEdit(copy)
                }}>
                    <Lab label = "Institution name">
                        <input
                        className = "ui-input"
                        placeholder = "Delhi Technological University"
                        onChange = {(event) => {
                            const newrn = event.target.value
                            const copy = {...resumeToEdit}
                            copy.education[eduindex].institution = newrn
                            setResumeToEdit(copy)
                        }}
                        type = "text" value = {edu.institution}/>
                    </Lab>
                    {edu.qualifications?.map((qual, qindex) => {
                        return <SubBlock key = {qindex} title = {`Qualification ${qindex + 1}`} removeLabel = {`Remove qualification ${qindex + 1}`}
                        onRemove = {() => {
                            const copy = {...resumeToEdit}
                            copy.education[eduindex].qualifications.splice(qindex, 1)
                            setResumeToEdit(copy)
                        }}>
                            <Lab label = "Qualification">
                                <input
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.education[eduindex].qualifications[qindex].name = newrn
                                    setResumeToEdit(copy)
                                }}
                                value = {qual.name}
                                placeholder = "B.Tech in Computer Science"
                                className = "ui-input"
                                />
                            </Lab>
                            <Lab label = "Short description (optional)">
                                <textarea
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.education[eduindex].qualifications[qindex].description = newrn
                                    setResumeToEdit(copy)
                                }}
                                value = {qual.description}
                                rows = {2}
                                placeholder = "Minor in Economics"
                                className = "ui-input"
                                />
                            </Lab>
                            <div className = "grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                <Lab label = "Start">
                                    <input type = "month"
                                    onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.education[eduindex].qualifications[qindex].start = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    value = {qual.start && new Date(qual.start).toISOString().slice(0,7)} className = "ui-input"/>
                                </Lab>
                                {!qual.ongoing ?
                                    <Lab label = "End">
                                        <input
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.education[eduindex].qualifications[qindex].end = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        type = "month" value = {qual.end && new Date(qual.end).toISOString().slice(0,7)} className = "ui-input"/>
                                    </Lab>
                                    : <div className = "hidden sm:block" />}
                                <Ongoing>
                                    <input type = "checkbox" checked = {qual.ongoing} onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.education[eduindex].qualifications[qindex].ongoing = event.target.checked
                                        setResumeToEdit(copy)
                                    }}/>
                                </Ongoing>
                            </div>
                            <Lab label = "Grades (optional)">
                                <input
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.education[eduindex].qualifications[qindex].grades = newrn
                                    setResumeToEdit(copy)
                                }}
                                placeholder = "CGPA: 8.4" type = "text" value = {qual.grades} className = "ui-input"/>
                            </Lab>
                            <Group title = "Other details" help = "Short notes shown next to the qualification, like a city or honours.">
                                {qual.extras?.map((extra, extraindex) => {
                                    return <div key = {extraindex} className = "ui-item-in flex gap-2 items-center">
                                        <input 
                                        aria-label = {`Detail ${extraindex + 1}`}
                                        placeholder = "Distance learning programme"
                                        className = "ui-input" type = "text" value = {extra} onChange = {(event) => {
                                        const newrn = event.target.value
                                        const copy = {...resumeToEdit}
                                        copy.education[eduindex].qualifications[qindex].extras[extraindex] = newrn
                                        setResumeToEdit(copy)
                                    }}/>
                                        <IconRemove
                                        label = {`Remove detail ${extraindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.education[eduindex].qualifications[qindex].extras.splice(extraindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarray = [...copy.education[eduindex].qualifications[qindex].extras, ""]
                                    copy.education[eduindex].qualifications[qindex].extras = newarray
                                    setResumeToEdit(copy)
                                }}>Add detail</AddButton>
                            </Group>
                        </SubBlock>
                    })}
                    <AddButton
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        const newarray = [...copy.education[eduindex].qualifications, {name : "", start: new Date(), end: new Date(), grades: "", ongoing: false, extras: []}]
                        copy.education[eduindex].qualifications = newarray
                        setResumeToEdit(copy)
                    }}>Add qualification</AddButton>
                </Block>
            })}
            <AddButton
            onClick = {() => {
                const copy = {...resumeToEdit}
                const newarray = [...copy.education, {institution: "", qualifications: []}]
                copy.education = newarray
                setResumeToEdit(copy)
            }}>Add institution</AddButton>
        </EditorSheet>
    )
}

function ExperienceDetails ({resumeToEdit, setResumeToEdit, setExperienceEdit}) {

    return (
        <EditorSheet title = "Experience" description = "Add each organization, then the roles you held there. Lead each point with what changed because of your work." onDone = {() => setExperienceEdit(false)}>
            {resumeToEdit.experience?.map((org, orgindex) => {
                return <Block key = {orgindex} title = {`Organization ${orgindex + 1}`} removeLabel = {`Remove organization ${orgindex + 1}`}
                onRemove = {() => {
                    const copy = {...resumeToEdit}
                    copy.experience.splice(orgindex, 1)
                    setResumeToEdit(copy)
                }}>
                    <Lab label = "Organization name">
                        <input
                        type = "text"
                        onChange = {(event) => {
                            const copy = {...resumeToEdit}
                            copy.experience[orgindex].organization = event.target.value
                            setResumeToEdit(copy)
                        }}
                        value = {org.organization}
                        className = "ui-input"
                        placeholder = "Infosys Ltd"
                        />
                    </Lab>
                    <Group title = "Details about the organization" help = "Location, work mode, or who it was incubated under.">
                        {org.extras?.map((extra, extraindex) => {
                            return <div key = {extraindex} className = "ui-item-in flex gap-2 items-center">
                                <input
                                aria-label = {`Organization detail ${extraindex + 1}`}
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.experience[orgindex].extras[extraindex] = newrn
                                    setResumeToEdit(copy)
                                }}
                                className = "ui-input" placeholder = "Bengaluru" type = "text" value = {extra}/>
                                <IconRemove
                                label = {`Remove organization detail ${extraindex + 1}`}
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.experience[orgindex].extras.splice(extraindex, 1)
                                    setResumeToEdit(copy)
                                }}/>
                            </div>
                        })}
                        <AddButton
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            const newarr = [...copy.experience[orgindex].extras, ""]
                            copy.experience[orgindex].extras = newarr
                            setResumeToEdit(copy)
                        }}>Add detail</AddButton>
                    </Group>

                    {org.roles?.map((role, roleindex) => {
                        return <SubBlock key = {roleindex} title = {`Role ${roleindex + 1}`} removeLabel = {`Remove role ${roleindex + 1}`}
                        onRemove = {() => {
                            const copy = {...resumeToEdit}
                            copy.experience[orgindex].roles.splice(roleindex, 1)
                            setResumeToEdit(copy)
                        }}>
                            <Lab label = "Role title">
                                <input
                                type = "text"
                                value = {role.rolename}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.experience[orgindex].roles[roleindex].rolename = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                placeholder = "Front-end engineer"
                                className = "ui-input"/>
                            </Lab>
                            <div className = "grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                <Lab label = "Start">
                                    <input
                                    onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.experience[orgindex].roles[roleindex].start = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    type = "month" value = {role.start && new Date(role.start).toISOString().slice(0, 7)} className = "ui-input"/>
                                </Lab>
                                {!role.ongoing ?
                                    <Lab label = "End">
                                        <input
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].end = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        type = "month" value = {role.end && new Date(role.end).toISOString().slice(0, 7)} className = "ui-input"/>
                                    </Lab>
                                    : <div className = "hidden sm:block" />}
                                <Ongoing>
                                    <input
                                    onChange = {() => {
                                        const copy = {...resumeToEdit}
                                        copy.experience[orgindex].roles[roleindex].ongoing ? copy.experience[orgindex].roles[roleindex].ongoing = false : copy.experience[orgindex].roles[roleindex].ongoing = true
                                        setResumeToEdit(copy)
                                    }}
                                    type = "checkbox" checked = {role.ongoing} />
                                </Ongoing>
                            </div>
                            <Lab label = "Role summary (optional)">
                                <textarea
                                value = {role.rolesummary}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.experience[orgindex].roles[roleindex].rolesummary = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                rows = {2}
                                placeholder = "One line on what the team does and what you owned."
                                className = "ui-input"/>
                            </Lab>
                            <Group title = "Points">
                                {role.points?.map((point, pointindex) => {
                                    return <div key = {pointindex} className = "ui-item-in flex items-start gap-2">
                                        <textarea
                                        aria-label = {`Point ${pointindex + 1}`}
                                        value = {point}
                                        rows = {2}
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].points[pointindex] = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        placeholder = "Cut page load time by 40% by moving images to a CDN."
                                        className = "ui-input min-h-0"
                                        key = {pointindex}/>
                                        <IconRemove
                                        label = {`Remove point ${pointindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].points.splice(pointindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.experience[orgindex].roles[roleindex].points, ""]
                                    copy.experience[orgindex].roles[roleindex].points = newarr
                                    setResumeToEdit(copy)
                                }}>Add point</AddButton>
                            </Group>
                            <Group title = "Details about the role" help = "Like Part-time, Internship or Remote.">
                                {role.extras?.map((extra, extraindex) => {
                                    return <div key = {extraindex} className = "ui-item-in flex gap-2 items-center">
                                        <input
                                        aria-label = {`Role detail ${extraindex + 1}`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].extras[extraindex] = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        className = "ui-input" placeholder = "Part-time" type = "text" value = {extra}/>
                                        <IconRemove
                                        label = {`Remove role detail ${extraindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].extras.splice(extraindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.experience[orgindex].roles[roleindex].extras, ""]
                                    copy.experience[orgindex].roles[roleindex].extras = newarr
                                    setResumeToEdit(copy)
                                }}>Add detail</AddButton>
                            </Group>
                            <Group title = "Links">
                                {role.urls?.map((link, linkindex) => {
                                    return <div key = {linkindex} className = "ui-item-in grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] gap-2 items-center">
                                        <input
                                        aria-label = {`Link ${linkindex + 1} name`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].urls[linkindex].name = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        className = "ui-input" placeholder = "Case study" type = "text" value = {link.name}/>
                                        <input 
                                        aria-label = {`Link ${linkindex + 1} address`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].urls[linkindex].url = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        placeholder = "https://" type = "text" inputMode = "url" className = "ui-input" value = {link.url} />
                                        <IconRemove
                                        label = {`Remove link ${linkindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.experience[orgindex].roles[roleindex].urls.splice(linkindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.experience[orgindex].roles[roleindex].urls, {}]
                                    copy.experience[orgindex].roles[roleindex].urls = newarr
                                    setResumeToEdit(copy)
                                }}>Add link</AddButton>
                            </Group>
                        </SubBlock>
                    })}
                    <AddButton
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        const newarr = [...copy.experience[orgindex].roles, {rolename : "", rolesummary: "", start: new Date(), end: new Date(), ongoing: false, points: [], extras: [], urls: []}]
                        copy.experience[orgindex].roles = newarr
                        setResumeToEdit(copy)
                    }}>Add role</AddButton>
                </Block>
            })}
            <AddButton
            onClick = {() => {
                const copy = {...resumeToEdit}
                const newarr = [...copy.experience, { organization : "", urls : [], extras: [], roles: []}]
                copy.experience = newarr
                setResumeToEdit(copy)
            }}>Add organization</AddButton>
        </EditorSheet>
    )
}

function ProjectDetails ({setResumeToEdit, resumeToEdit, setProjectsEdit}) {
    return (
        <EditorSheet title = "Projects" description = "Projects appear in this order on the resume. Use Move up and Move down to reorder them." onDone = {() => setProjectsEdit(false)}>
            {resumeToEdit.projects?.map((project, index) => {
                return <Block key = {index} title = {`Project ${index + 1}`} removeLabel = {`Remove project ${index + 1}`}
                onRemove = {() => {
                    const copy = {...resumeToEdit}
                    copy.projects.splice(index, 1)
                    setResumeToEdit(copy)
                }}>
                    {resumeToEdit.projects.length > 1 &&
                        <div className = "flex gap-2 -mt-2">
                            {index != 0 && <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                const newer = copy.projects[index]
                                copy.projects[index] = copy.projects[index-1]
                                copy.projects[index-1] = newer
                                setResumeToEdit(copy)
                            }}
                            className = "ui-btn ui-btn-secondary ui-btn-sm">
                                <Icon name = "up" size = {16} />Move up
                            </button>}

                            {(index != resumeToEdit.projects.length - 1) && <button
                            type = "button"
                            onClick = {() => {
                                const copy = {...resumeToEdit}
                                const newer = copy.projects[index]
                                copy.projects[index] = copy.projects[index+1]
                                copy.projects[index+1] = newer
                                setResumeToEdit(copy)
                            }}
                            className = "ui-btn ui-btn-secondary ui-btn-sm">
                                <Icon name = "down" size = {16} />Move down
                            </button>}
                        </div>
                    }
                    <Lab label = "Project name">
                        <input
                        value = {project.projectname}
                        onChange = {(event) => {
                            const copy = {...resumeToEdit}
                            copy.projects[index].projectname = event.target.value
                            setResumeToEdit(copy)
                        }}
                        type = "text" placeholder = "Campus bus tracker" className = "ui-input"/>
                    </Lab>
                    <Lab label = "Project summary (optional)">
                        <textarea
                        value = {project.projectsummary}
                        onChange = {(event) => {
                            const copy = {...resumeToEdit}
                            copy.projects[index].projectsummary = event.target.value
                            setResumeToEdit(copy)
                        }}
                        rows = {2}
                        placeholder = "One line on what it does and who uses it."
                        className = "ui-input"/>
                    </Lab>
                    <div className = "grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
                        <Lab label = "Tech label" help = "Shown before the list, e.g. Tech stack.">
                            <input type = "text" value = {project.stack?.head} onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.projects[index].stack.head = event.target.value
                                setResumeToEdit(copy)
                            }}
                            className = "ui-input"
                            placeholder = "Tech stack"/>
                        </Lab>
                        <Lab label = "Technologies used">
                            <textarea value = {project.stack?.content} onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.projects[index].stack.content = event.target.value
                                setResumeToEdit(copy)
                            }}
                            rows = {2}
                            className = "ui-input min-h-0"
                            placeholder = "React, Node.js, Express, MongoDB"/>
                        </Lab>
                    </div>
                    <div className = "grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <Lab label = "Start">
                            <input
                            onChange = {(event) => {
                                const copy = {...resumeToEdit}
                                copy.projects[index].start = event.target.value
                                setResumeToEdit(copy)
                            }}
                            type = "date" value = {project.start && new Date(project.start).toISOString().slice(0, 10)} className = "ui-input"/>
                        </Lab>
                        {!project.ongoing ?
                            <Lab label = "End">
                                <input
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].end = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                type = "date" value = {project.end && new Date(project.end).toISOString().slice(0, 10)} className = "ui-input"/>
                            </Lab>
                            : <div className = "hidden sm:block" />}
                        <Ongoing>
                            <input
                            onChange = {() => {
                                const copy = {...resumeToEdit}
                                copy.projects[index].ongoing ? copy.projects[index].ongoing = false : copy.projects[index].ongoing = true
                                setResumeToEdit(copy)
                            }}
                            type = "checkbox" checked = {project.ongoing} />
                        </Ongoing>
                    </div>
                    <Group title = "Points">
                        {project.points?.map((point, pointindex) => {
                            return <div key = {pointindex} className = "ui-item-in flex items-start gap-2">
                                <textarea
                                aria-label = {`Point ${pointindex + 1}`}
                                value = {point}
                                rows = {2}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].points[pointindex] = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                placeholder = "Used by 900 students in the first month."
                                className = "ui-input min-h-0"
                                key = {pointindex}/>
                                <IconRemove
                                label = {`Remove point ${pointindex + 1}`}
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].points.splice(pointindex, 1)
                                    setResumeToEdit(copy)
                                }}/>
                            </div>
                        })}
                        <AddButton
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            const newarr = [...copy.projects[index].points, ""]
                            copy.projects[index].points = newarr
                            setResumeToEdit(copy)
                        }}>Add point</AddButton>
                    </Group>
                    <Group title = "Links">
                        {project.urls?.map((link, linkindex) => {
                            return <div key = {linkindex} className = "ui-item-in grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] gap-2 items-center">
                                <input
                                aria-label = {`Link ${linkindex + 1} name`}
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].urls[linkindex].name = newrn
                                    setResumeToEdit(copy)
                                }}
                                className = "ui-input" placeholder = "Live demo" type = "text" value = {link.name}/>
                                <input 
                                aria-label = {`Link ${linkindex + 1} address`}
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].urls[linkindex].url = newrn
                                    setResumeToEdit(copy)
                                }}
                                placeholder = "https://" type = "text" inputMode = "url" className = "ui-input" value = {link.url} />
                                <IconRemove
                                label = {`Remove link ${linkindex + 1}`}
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].urls.splice(linkindex, 1)
                                    setResumeToEdit(copy)
                                }}/>
                            </div>
                        })}
                        <AddButton
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            const newarr = [...copy.projects[index].urls, {}]
                            copy.projects[index].urls = newarr
                            setResumeToEdit(copy)
                        }}>Add link</AddButton>
                    </Group>
                    <Group title = "Other details" help = "Like Team of 3 or Hackathon winner.">
                        {project.extras?.map((extra, extraindex) => {
                            return <div key = {extraindex} className = "ui-item-in flex gap-2 items-center">
                                <input
                                aria-label = {`Project detail ${extraindex + 1}`}
                                onChange = {(event) => {
                                    const newrn = event.target.value
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].extras[extraindex] = newrn
                                    setResumeToEdit(copy)
                                }}
                                className = "ui-input" placeholder = "Team of 3" type = "text" value = {extra}/>
                                <IconRemove
                                label = {`Remove project detail ${extraindex + 1}`}
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    copy.projects[index].extras.splice(extraindex, 1)
                                    setResumeToEdit(copy)
                                }}/>
                            </div>
                        })}
                        <AddButton
                        onClick = {() => {
                            const copy = {...resumeToEdit}
                            const newarr = [...copy.projects[index].extras, ""]
                            copy.projects[index].extras = newarr
                            setResumeToEdit(copy)
                        }}>Add detail</AddButton>
                    </Group>
                </Block>
            })}
            <AddButton
            onClick = {() => {
                const copy = {...resumeToEdit}
                copy.projects = [...copy.projects, {projectname: "", projectsummary: "", start: new Date(), stack: {}, end: new Date(), urls: [], points: [], extras: []}]
                setResumeToEdit(copy)
            }}>Add project</AddButton>
        </EditorSheet>
    )
}

function SkillsDetails ({resumeToEdit, setResumeToEdit, setSkillsEdit}) {
    return (
        <EditorSheet title = "Skills" description = "Group related skills together, like Languages or Frameworks & tools." onDone = {() => setSkillsEdit(false)}>
            {resumeToEdit.skills?.map((skill, skillindex) => {
            return <Block key = {skillindex} title = {`Skill group ${skillindex + 1}`} removeLabel = {`Remove skill group ${skillindex + 1}`}
            onRemove = {() => {
                const copy = {...resumeToEdit}
                copy.skills.splice(skillindex, 1)
                setResumeToEdit(copy)
            }}>
                <Lab label = "Group name">
                    <input type = "text" value = {skill.head} onChange = {(event) => {
                        const copy = {...resumeToEdit}
                        copy.skills[skillindex].head = event.target.value
                        setResumeToEdit(copy)
                    }}
                    className = "ui-input"
                    placeholder = "Programming languages"/>
                </Lab>
                <Lab label = "Skills" help = "Separate them with commas.">
                    <textarea value = {skill.content} onChange = {(event) => {
                        const copy = {...resumeToEdit}
                        copy.skills[skillindex].content = event.target.value
                        setResumeToEdit(copy)
                    }}
                    rows = {2}
                    className = "ui-input"
                    placeholder = "JavaScript, Python, SQL"/>
                </Lab>
            </Block>
            })}
            <AddButton
            onClick = {() => {
                const copy = {...resumeToEdit}
                copy.skills = [...copy.skills, {head: "", content: ""}]
                setResumeToEdit(copy)
            }}>Add skill group</AddButton>
        </EditorSheet>
    )
}

function ExtraSectionDetails ({setResumeToEdit, resumeToEdit, setExtraSectionsEdit}) {
    return (
        <EditorSheet title = "Extra sections" description = "Certifications, achievements, volunteering, anything that doesn't fit elsewhere. Each section gets its own heading on the resume." onDone = {() => setExtraSectionsEdit(false)}>
            {resumeToEdit.extraSections?.map((section, sectionindex) => {
                return <Block key = {sectionindex} title = {section.sectionName?.trim() ? section.sectionName : `Section ${sectionindex + 1}`} removeLabel = {`Remove section ${sectionindex + 1}`}
                onRemove = {() => {
                    const copy = {...resumeToEdit}
                    copy.extraSections.splice(sectionindex, 1)
                    setResumeToEdit(copy)
                }}>
                    <Lab label = "Section heading">
                        <input placeholder = "Certifications" type = "text" value = {section.sectionName} className = "ui-input"
                        onChange = {(event) => {
                            const copy = {...resumeToEdit}
                            copy.extraSections[sectionindex].sectionName = event.target.value
                            setResumeToEdit(copy)
                        }} />
                    </Lab>
                    {section.subsections?.map((project, index) => {
                        return <SubBlock key = {index} title = {`Entry ${index + 1}`} removeLabel = {`Remove entry ${index + 1}`}
                        onRemove = {() => {
                            const copy = {...resumeToEdit}
                            copy.extraSections[sectionindex].subsections.splice(index, 1)
                            setResumeToEdit(copy)
                        }}>
                            <Lab label = "Title">
                                <input
                                value = {project.title}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.extraSections[sectionindex].subsections[index].title = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                type = "text" placeholder = "AWS Certified Cloud Practitioner" className = "ui-input"/>
                            </Lab>
                            <Lab label = "Summary (optional)">
                                <textarea
                                value = {project.summary}
                                onChange = {(event) => {
                                    const copy = {...resumeToEdit}
                                    copy.extraSections[sectionindex].subsections[index].summary = event.target.value
                                    setResumeToEdit(copy)
                                }}
                                rows = {2}
                                placeholder = "One line of context."
                                className = "ui-input"/>
                            </Lab>
                            <div className = "grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                <Lab label = "Start">
                                    <input
                                    onChange = {(event) => {
                                        const copy = {...resumeToEdit}
                                        copy.extraSections[sectionindex].subsections[index].start = event.target.value
                                        setResumeToEdit(copy)
                                    }}
                                    type = "month" 
                                    value={project.start && new Date(project.start).toISOString().slice(0, 7)} 
                                    className = "ui-input"/>
                                </Lab>
                                {!project.ongoing ?
                                    <Lab label = "End">
                                        <input
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].end = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        type = "month"
                                        value={project.end && new Date(project.end).toISOString().slice(0, 7)} 
                                        className = "ui-input"/>
                                    </Lab>
                                    : <div className = "hidden sm:block" />}
                                <Ongoing>
                                    <input
                                    onChange = {() => {
                                        const copy = {...resumeToEdit}
                                        copy.extraSections[sectionindex].subsections[index].ongoing ? copy.extraSections[sectionindex].subsections[index].ongoing = false : copy.extraSections[sectionindex].subsections[index].ongoing = true
                                        setResumeToEdit(copy)
                                    }}
                                    type = "checkbox" checked = {project.ongoing} />
                                </Ongoing>
                            </div>
                            <Group title = "Points">
                                {project.points?.map((point, pointindex) => {
                                    return <div key = {pointindex} className = "ui-item-in flex items-start gap-2">
                                        <textarea
                                        aria-label = {`Point ${pointindex + 1}`}
                                        value = {point}
                                        rows = {2}
                                        onChange = {(event) => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].points[pointindex] = event.target.value
                                            setResumeToEdit(copy)
                                        }}
                                        className = "ui-input min-h-0"
                                        key = {pointindex}/>
                                        <IconRemove
                                        label = {`Remove point ${pointindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].points.splice(pointindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.extraSections[sectionindex].subsections[index].points, ""]
                                    copy.extraSections[sectionindex].subsections[index].points = newarr
                                    setResumeToEdit(copy)
                                }}>Add point</AddButton>
                            </Group>
                            <Group title = "Links">
                                {project.urls?.map((link, linkindex) => {
                                    return <div key = {linkindex} className = "ui-item-in grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] gap-2 items-center">
                                        <input
                                        aria-label = {`Link ${linkindex + 1} name`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].urls[linkindex].name = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        className = "ui-input" placeholder = "Certificate" type = "text" value = {link.name}/>
                                        <input 
                                        aria-label = {`Link ${linkindex + 1} address`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].urls[linkindex].url = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        placeholder = "https://" type = "text" inputMode = "url" className = "ui-input" value = {link.url} />
                                        <IconRemove
                                        label = {`Remove link ${linkindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].urls.splice(linkindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.extraSections[sectionindex].subsections[index].urls, {}]
                                    copy.extraSections[sectionindex].subsections[index].urls = newarr
                                    setResumeToEdit(copy)
                                }}>Add link</AddButton>
                            </Group>
                            <Group title = "Other details">
                                {project.extras?.map((extra, extraindex) => {
                                    return <div key = {extraindex} className = "ui-item-in flex gap-2 items-center">
                                        <input
                                        aria-label = {`Detail ${extraindex + 1}`}
                                        onChange = {(event) => {
                                            const newrn = event.target.value
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].extras[extraindex] = newrn
                                            setResumeToEdit(copy)
                                        }}
                                        className = "ui-input" placeholder = "Finalist" type = "text" value = {extra}/>
                                        <IconRemove
                                        label = {`Remove detail ${extraindex + 1}`}
                                        onClick = {() => {
                                            const copy = {...resumeToEdit}
                                            copy.extraSections[sectionindex].subsections[index].extras.splice(extraindex, 1)
                                            setResumeToEdit(copy)
                                        }}/>
                                    </div>
                                })}
                                <AddButton
                                onClick = {() => {
                                    const copy = {...resumeToEdit}
                                    const newarr = [...copy.extraSections[sectionindex].subsections[index].extras, ""]
                                    copy.extraSections[sectionindex].subsections[index].extras = newarr
                                    setResumeToEdit(copy)
                                }}>Add detail</AddButton>
                            </Group>
                        </SubBlock>
                    })}
                    <AddButton
                    onClick = {() => {
                        const copy = {...resumeToEdit}
                        copy.extraSections[sectionindex].subsections = [...copy.extraSections[sectionindex].subsections, {title: "", summary: "", start: new Date(), end: new Date (), ongoing: false, points : [], urls: [], extras: []}]
                        setResumeToEdit(copy)
                    }}>Add entry</AddButton>
                </Block>
            })}
            <AddButton
            onClick = {() => {
                const copy = {...resumeToEdit}
                copy.extraSections = [...copy.extraSections, { sectionName : "", subsections: []}]
                setResumeToEdit(copy)
            }}>Add section</AddButton>
        </EditorSheet>
    )
}
