import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Preview from '../components/Preview.jsx';
import HiddenResume from '../components/HiddenResume.jsx'
import ReactDOMServer from "react-dom/server"
import AtsPanel from '../components/AtsPanel.jsx'
import { Dialog, Icon, Notice, Spinner } from '../components/ui.jsx'

const edited = (value) => value ? new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : null

function Resume({currResumeData, setAiResult, url, copyResume, showAllSuggestions, setShowAllSuggestions, handleAIAnalysis, setJobDescription, setCurrResumeData, aiError, aiLoading, aiResult, jobDescription, loggedInUser, updateResume, deleteResume, fetchResumes, openLogin, signingIn }) {
    
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);
    const navigate = useNavigate();
    const printRef = useRef();

    useEffect(() => {
        if (!currResumeData) {
            navigate('/myresumes');
        }
        setJobDescription('')
        setShowAllSuggestions(false)
        setAiResult(null)
    }, []);


const handleExportPDFPuppeteer = async () => {
  const renderedHtml = ReactDOMServer.renderToStaticMarkup(
    <div className="resume-container">
      <HiddenResume resumeInView={currResumeData} />
    </div>
  );

  const fullHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${currResumeData?.username}</title>
      </head>
      <body>
        ${renderedHtml}
      </body>
    </html>
  `;

  const res = await fetch(`${url}/api/resumes/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: fullHtml }),
  });
  if (!res.ok) throw new Error("Export failed");

  const blob = await res.blob();
  const url2 = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url2;
  a.download = `${currResumeData?.username}_${currResumeData?.name || "resume"}.pdf`;
  a.click();
};

    // One export at a time; the server can take a while to render the PDF.
    const exportPdf = async () => {
        if (exporting) return
        setExporting(true)
        setExportError(null)
        try {
            await handleExportPDFPuppeteer()
        } catch (error) {
            setExportError("Couldn't create the PDF. Check your connection and try again.")
        } finally {
            setExporting(false)
        }
    }

    const setPrivacy = (makePrivate) => {
        if (Boolean(currResumeData.private) === makePrivate) return
        const resumeCopy = { ...currResumeData };
        resumeCopy.private = makePrivate;
        updateResume(currResumeData._id, resumeCopy);
        fetchResumes();
        setCurrResumeData(resumeCopy);
    }

    const isOwner = Boolean(loggedInUser && currResumeData && loggedInUser._id === currResumeData.user_id)

    return (
        <main className="md:ml-72 min-h-screen px-5 lg:px-10 xl:px-14 pt-8 md:pt-16 pb-24">
            {currResumeData && (
                <>
                    <header className="ui ui-page max-w-6xl flex flex-col gap-6">
                        <Link to={isOwner ? "/myresumes" : "/community"} className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-graphite hover:text-ink">
                            <Icon name="chevron" size={14} className="rotate-180" />{isOwner ? 'My resumes' : 'Community'}
                        </Link>

                        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                            <div className="min-w-0 max-w-3xl">
                                <h1 className="ui-title text-[clamp(2rem,1.3rem+2.2vw,3.25rem)] break-words">{currResumeData.name}</h1>
                                <p className="ui-lede mt-3">
                                    {currResumeData.username}
                                    {edited(currResumeData.updatedAt) && <>, edited {edited(currResumeData.updatedAt)}</>}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {isOwner &&
                                    <button type="button" onClick={() => {navigate("/editResume")}} className="ui-btn ui-btn-primary">
                                        <Icon name="edit" size={18} />Edit
                                    </button>
                                }
                                {loggedInUser &&
                                    <button type="button" onClick={() => {copyResume(currResumeData)}} className="ui-btn ui-btn-secondary">
                                        <Icon name="add" size={18} />Make a copy
                                    </button>
                                }
                                {isOwner &&
                                    <button type="button" onClick={exportPdf} disabled={exporting} className="ui-btn ui-btn-secondary min-w-[10.5rem]">
                                        {exporting ? <><Spinner />Creating PDF…</> : <><Icon name="down" size={18} />Download PDF</>}
                                    </button>
                                }
                                {!loggedInUser && !signingIn &&
                                    <button type="button" onClick={() => openLogin?.('login')} className="ui-btn ui-btn-secondary">Log in to make a copy</button>
                                }
                            </div>
                        </div>

                        {exportError && <Notice tone="error">{exportError}</Notice>}

                        {isOwner &&
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <div role="group" aria-label="Visibility" className="inline-grid grid-cols-2 gap-1 p-1 rounded-[10px] bg-ink/[0.06]">
                                    {[{ value: false, label: 'Public', icon: 'globe' }, { value: true, label: 'Private', icon: 'lock' }].map(option => {
                                        const selected = Boolean(currResumeData.private) === option.value
                                        return (
                                            <button
                                            key={option.label}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => setPrivacy(option.value)}
                                            className={`h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold ${selected ? 'bg-sheet text-ink shadow-[0_1px_3px_rgba(0,0,0,0.18)]' : 'text-graphite hover:text-ink'}`}>
                                                <Icon name={option.icon} size={15} />{option.label}
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="ui-help">
                                    {currResumeData.private ? "Only you can see this resume." : "Listed in Community, where anyone can view and copy it."}
                                </p>
                            </div>
                        }
                    </header>

                    <div className="hidden">
                        <div
                            ref={printRef}
                            style={{
                                fontFamily: "'Times New Roman', Times, serif",
                                backgroundColor: 'white',
                                boxSizing: 'border-box',
                            }}
                        >
                            <HiddenResume resumeInView={currResumeData} />
                        </div>
                    </div>

                    <div className="mt-10 max-w-6xl grid gap-10 min-[1400px]:grid-cols-[auto_minmax(0,1fr)] items-start">
                        {/* The resume itself: same component, same fixed sizes per screen width as before */}
                        <div className="flex [justify-content:safe_center] min-[1400px]:justify-start min-w-0">
                            <div>
                                <div
                                    style={{
                                        fontFamily: "'Times New Roman', Times, serif",
                                        backgroundColor: 'white',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Preview resumeInView={currResumeData} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 min-[1400px]:sticky min-[1400px]:top-8 min-w-0 w-full max-w-2xl mx-auto min-[1400px]:mx-0">
                            <AtsPanel
                                jobDescription={jobDescription}
                                setJobDescription={setJobDescription}
                                aiLoading={aiLoading}
                                aiError={aiError}
                                aiResult={aiResult}
                                onAnalyze={() => handleAIAnalysis(currResumeData, jobDescription)}
                            />

                            {isOwner &&
                                <section aria-labelledby="delete-heading" className="ui rounded-[14px] border border-danger/40 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 id="delete-heading" className="font-bold">Delete this resume</h2>
                                        <p className="ui-help mt-0.5">This can't be undone.</p>
                                    </div>
                                    <button type="button" onClick={() => setShowDeleteWarning(true)} className="ui-btn ui-btn-danger-quiet">
                                        <Icon name="delete" size={18} />Delete
                                    </button>
                                </section>
                            }

                            <p className="ui text-xs text-graphite break-all">Resume ID: {currResumeData._id}</p>
                        </div>
                    </div>
                </>
            )}

            {showDeleteWarning && (
                <DeleteWarning
                    navigate={navigate}
                    deleteResume={deleteResume}
                    id={currResumeData._id}
                    name={currResumeData.name}
                    setShowDeleteWarning={setShowDeleteWarning}
                />
            )}
        </main>
    );
}

export default Resume;

function DeleteWarning({ deleteResume, navigate, setShowDeleteWarning, id, name }) {
    const [pending, setPending] = useState(false)
    const [failed, setFailed] = useState(false)
    const confirm = async () => {
        if (pending) return
        setPending(true)
        setFailed(false)
        const deleted = await deleteResume(id);
        if (deleted) {
            setShowDeleteWarning(false);
            navigate('/myresumes');
        } else {
            setPending(false)
            setFailed(true)
        }
    }
    return (
        <Dialog title="Delete this resume?" onClose={() => setShowDeleteWarning(false)} size="sm" dismissible={!pending}>
            <p className="text-graphite">
                <span className="font-semibold text-ink break-words">{name}</span> will be deleted for good. If it's public, it also disappears from Community.
            </p>
            {failed && <Notice tone="error" className="mt-4">Couldn't delete it. Check your connection and try again.</Notice>}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button type="button" onClick={() => setShowDeleteWarning(false)} disabled={pending} className="ui-btn ui-btn-secondary" autoFocus>Keep it</button>
                <button type="button" onClick={confirm} disabled={pending} className="ui-btn ui-btn-danger min-w-[9.5rem]">
                    {pending ? <><Spinner />Deleting…</> : 'Delete resume'}
                </button>
            </div>
        </Dialog>
    )
}
