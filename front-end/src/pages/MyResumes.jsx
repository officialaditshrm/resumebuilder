import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, Icon, ListSkeleton, Notice, Spinner, Title } from '../components/ui.jsx'

const formatDate = (value, withTime) => new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day : "numeric",
    year : "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {})
})

function MyResumes ({buildResume, openLogin, signingIn, allResumes, loggedInUser, fetchResumes, setCurrResumeData, currResumeData, deleteResume}) {
    const [showDeleteWarning, setShowDeleteWarning] = useState(false)

    useEffect (() => {
        fetchResumes()
    }, [])

    if (loggedInUser) {
        const mine = allResumes ? allResumes.filter(oneresume => oneresume.user_id === loggedInUser._id)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) : null
        return (
            <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
                <div className="max-w-4xl flex flex-col gap-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-3">
                            <Title>Your resumes</Title>
                            {mine && mine.length > 0 &&
                                <p className="ui-lede">{mine.length} {mine.length === 1 ? 'resume' : 'resumes'}, most recently edited first.</p>
                            }
                        </div>
                        <button type="button" onClick={() => buildResume()} className="ui-btn ui-btn-primary">
                            <Icon name="add" />New resume
                        </button>
                    </div>

                    {!mine && <ListSkeleton rows={3} label="Loading your resumes" />}

                    {mine && mine.length === 0 &&
                        <div className="ui-sheet px-6 py-12 sm:px-10 flex flex-col items-start gap-4">
                            <h2 className="ui-h2">Start your first resume</h2>
                            <p className="text-graphite max-w-md">Give it a name, fill in the sections you need and see the resume update as you type.</p>
                            <button type="button" onClick={() => buildResume()} className="ui-btn ui-btn-primary"><Icon name="add" />New resume</button>
                        </div>
                    }

                    {mine && mine.length > 0 &&
                        <ul className="ui-sheet ui-divide overflow-hidden">
                            {mine.map((resume) => (
                                <li key={resume._id} data-resume-id={resume._id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-6 py-5">
                                    <span aria-hidden="true" className="hidden sm:flex h-14 w-11 shrink-0 rounded-[4px] border border-edge bg-white flex-col gap-[3px] p-1.5 pt-2">
                                        <span className="h-[3px] w-2/3 mx-auto rounded bg-zinc-900" />
                                        <span className="h-[2px] w-full rounded bg-zinc-300" />
                                        <span className="h-[2px] w-full rounded bg-zinc-300" />
                                        <span className="h-[2px] w-4/5 rounded bg-zinc-300" />
                                        <span className="h-[2px] w-full rounded bg-zinc-300" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <h2 className="font-bold text-lg leading-snug truncate" title={resume.name}>{resume.name}</h2>
                                            <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${resume.private ? 'bg-ink/[0.07] text-graphite' : 'border border-edge text-ink'}`}>
                                                <Icon name={resume.private ? 'lock' : 'globe'} size={13} />{resume.private ? 'Private' : 'Public'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-graphite truncate">{resume.username}</p>
                                        <p className="text-sm text-graphite mt-1">
                                            Edited {formatDate(resume.updatedAt, true)}<span className="hidden sm:inline">, created {formatDate(resume.createdAt)}</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Link
                                        to="/resume"
                                        onClick={() => setCurrResumeData(resume)}
                                        className="ui-btn ui-btn-secondary ui-btn-sm flex-1 sm:flex-none">Open</Link>
                                        <button
                                        type="button"
                                        onClick = {() => {setCurrResumeData(resume); setShowDeleteWarning(true)}}
                                        aria-label={`Delete ${resume.name}`}
                                        className="ui-btn ui-btn-ghost ui-btn-sm text-danger px-3">
                                            <Icon name="delete" size={18} />Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                {showDeleteWarning && currResumeData &&
                    <DeleteWarning
                    name={currResumeData.name}
                    onConfirm={async () => {
                        const deleted = await deleteResume(currResumeData._id)
                        if (deleted) { setShowDeleteWarning(false); setCurrResumeData(null) }
                        return deleted
                    }}
                    onCancel={() => setShowDeleteWarning(false)} />
                }
            </main>
        )
    }
    return (
        <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
            <div className="max-w-xl flex flex-col gap-6">
                <Title>Your resumes</Title>
                {signingIn ?
                    <p className="ui-lede" role="status">Signing you in…</p>
                    :
                    <>
                        <p className="ui-lede">Log in to build a resume or open the ones you've saved.</p>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => openLogin('login')} className="ui-btn ui-btn-primary">Log in</button>
                            <button type="button" onClick={() => openLogin('signup')} className="ui-btn ui-btn-secondary">Create an account</button>
                        </div>
                    </>
                }
            </div>
        </main>
    )
}

export default MyResumes


function DeleteWarning ({name, onConfirm, onCancel}) {
    const [pending, setPending] = useState(false)
    const [failed, setFailed] = useState(false)
    const confirm = async () => {
        if (pending) return
        setPending(true)
        setFailed(false)
        const ok = await onConfirm()
        if (!ok) { setPending(false); setFailed(true) }
    }
    return (
        <Dialog title="Delete this resume?" onClose={onCancel} size="sm" dismissible={!pending}>
            <p className="text-graphite">
                <span className="font-semibold text-ink break-words">{name}</span> will be deleted for good. If it's public, it also disappears from Community.
            </p>
            {failed && <Notice tone="error" className="mt-4">Couldn't delete it. Check your connection and try again.</Notice>}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button type="button" onClick={onCancel} disabled={pending} className="ui-btn ui-btn-secondary" autoFocus>Keep it</button>
                <button type="button" onClick={confirm} disabled={pending} className="ui-btn ui-btn-danger min-w-[9.5rem]">
                    {pending ? <><Spinner />Deleting…</> : 'Delete resume'}
                </button>
            </div>
        </Dialog>
    )
}
