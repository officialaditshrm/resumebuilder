import { Link, useNavigate } from 'react-router-dom'
import Preview from '../components/Preview.jsx'
import sampleResume from './sampleResume.js'
import { Icon, ListSkeleton, Title } from '../components/ui.jsx'

const RECENT_LIMIT = 5

const edited = (value) => new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })

function Landing({loggedInUser, allResumes, buildResume, openLogin, setCurrResumeData, signingIn}) {
    const navigate = useNavigate()

    // Signed in: a simple dashboard of recent work
    if (loggedInUser || signingIn) {
        const mine = loggedInUser && allResumes
            ? allResumes.filter((r) => r.user_id === loggedInUser._id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            : null
        const firstName = loggedInUser?.name?.trim().split(/\s+/)[0]
        return (
            <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
                <div className="max-w-4xl flex flex-col gap-12">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="flex flex-col gap-3">
                            <Title>{firstName ? `Welcome back, ${firstName}` : 'Welcome back'}</Title>
                            <p className="ui-lede">Pick up where you left off, or start a resume for a new application.</p>
                        </div>
                        <button type="button" onClick={() => buildResume()} disabled={!loggedInUser} className="ui-btn ui-btn-primary">
                            <Icon name="add" />New resume
                        </button>
                    </div>

                    <section aria-labelledby="recent-heading" className="flex flex-col gap-4">
                        <div className="flex items-baseline justify-between gap-4">
                            <h2 id="recent-heading" className="ui-h2">Recent resumes</h2>
                            {mine && mine.length > RECENT_LIMIT &&
                                <Link to="/myresumes" className="ui-link text-sm">View all {mine.length}</Link>
                            }
                        </div>

                        {!mine && <ListSkeleton rows={3} label="Loading your resumes" />}

                        {mine && mine.length === 0 &&
                            <div className="ui-sheet px-6 py-10 sm:px-8 flex flex-col items-start gap-3">
                                <p className="font-semibold">No resumes yet</p>
                                <p className="text-graphite max-w-md">Start with one resume. You can copy it later to tailor a version for each job.</p>
                                <button type="button" onClick={() => buildResume()} className="ui-btn ui-btn-primary mt-1"><Icon name="add" />New resume</button>
                            </div>
                        }

                        {mine && mine.length > 0 &&
                            <ul className="ui-sheet ui-divide overflow-hidden">
                                {mine.slice(0, RECENT_LIMIT).map((resume) => (
                                    <li key={resume._id}>
                                        <Link to="/resume" onClick={() => setCurrResumeData(resume)} className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-ink/[0.03]">
                                            <Icon name="doc" size={22} className="text-graphite" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-semibold">{resume.name}</span>
                                                <span className="block truncate text-sm text-graphite">
                                                    {resume.private ? 'Private' : 'Public'}, edited {edited(resume.updatedAt)}
                                                </span>
                                            </span>
                                            <span className="text-sm font-semibold shrink-0 flex items-center gap-1">Open<Icon name="chevron" size={14} /></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        }
                    </section>
                </div>
            </main>
        )
    }

    // Signed out: what the product does, and a way in
    return (
        <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
            <section className="grid xl:grid-cols-[minmax(0,1fr)_450px] gap-12 xl:gap-16 items-start">
                <div className="flex flex-col gap-7 max-w-[36rem] xl:pt-6">
                    <Title className="text-[clamp(2.5rem,1.4rem+3.4vw,3.5rem)]">Build a resume that fits the job</Title>
                    <p className="ui-lede text-lg">
                        Create a resume, keep a version for each application, check it against a job description and export an ATS-friendly PDF.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => openLogin('signup')} className="ui-btn ui-btn-primary h-12 px-6 text-base">Create an account</button>
                        <button type="button" onClick={() => openLogin('login')} className="ui-btn ui-btn-secondary h-12 px-6 text-base">Log in</button>
                    </div>
                    <p className="text-sm text-graphite">
                        Or <button type="button" onClick={() => navigate('/community')} className="ui-link text-ink">browse resumes people have shared</button>.
                    </p>
                </div>

                <figure className="ui-rise m-0 w-fit" aria-label="Example resume made with Resolute">
                    <div
                    className="legacy overflow-hidden h-[380px] sm:h-[460px] xl:h-[560px] xl:w-[450px]"
                    style={{ WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent)', maskImage: 'linear-gradient(to bottom, #000 72%, transparent)' }}>
                        <div className="xl:scale-[0.8] xl:origin-top-left pointer-events-none select-none p-[3px]" aria-hidden="true" inert>
                            <Preview resumeInView={sampleResume} />
                        </div>
                    </div>
                </figure>
            </section>
        </main>
    )
}

export default Landing
