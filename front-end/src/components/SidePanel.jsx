import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Avatar, Icon } from './ui.jsx'

const NAV = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/myresumes', label: 'My resumes', icon: 'doc' },
    { to: '/community', label: 'Community', icon: 'globe' },
    { to: '/profile', label: 'Profile', icon: 'person', needsUser: true },
]

const RECENT_LIMIT = 6

export default function SidePanel ({busy, pfp, setPfp, darkMode, setDarkMode, buildResume, hamburgerOpen, setHamburgerOpen, smallScreen, setToken, signingIn, openLogin, loggedInUser, allResumes, setLoggedInUser, setCurrResumeData})  {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const drawerClosed = smallScreen && !hamburgerOpen

    // Close the mobile drawer after navigating
    useEffect(() => { setHamburgerOpen(false) }, [pathname])

    useEffect(() => {
        if (!hamburgerOpen) return
        const onKey = (e) => { if (e.key === 'Escape') setHamburgerOpen(false) }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [hamburgerOpen])

    const myResumes = loggedInUser && allResumes
        ? allResumes.filter(oneresume => oneresume.user_id === loggedInUser._id)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        : []

    const logout = () => {
        setLoggedInUser(null); localStorage.removeItem("resoluteToken"); setToken(""); setPfp(null); setCurrResumeData(null); setHamburgerOpen(false); navigate("/")
    }

    // While a save or delete is running, links stay put so the request isn't interrupted.
    const holdIfBusy = (e) => { if (busy) e.preventDefault() }
    const busyProps = busy ? { 'aria-disabled': true, title: 'Wait for the save to finish' } : {}

    const isActive = (to) => to === '/' ? pathname === '/' : pathname.toLowerCase().startsWith(to)

    return (
        <>
            {smallScreen && hamburgerOpen &&
                <div className="ui-fade fixed inset-0 z-40 bg-black/45 md:hidden" onClick={() => setHamburgerOpen(false)} aria-hidden="true" />
            }
            <aside
            id="app-sidebar"
            aria-label="Main"
            inert={drawerClosed ? true : undefined}
            className={`ui ui-drawer fixed inset-y-0 left-0 z-50 md:z-30 w-72 max-w-[85vw] flex flex-col bg-sheet border-r border-rule text-ink
                ${drawerClosed ? '-translate-x-full' : 'translate-x-0'} md:translate-x-0 ${smallScreen && hamburgerOpen ? 'shadow-[0_0_60px_rgba(0,0,0,0.35)]' : ''}`}>

                <div className="flex items-center justify-between h-16 px-5 shrink-0">
                    <Link to="/" onClick={holdIfBusy} {...busyProps} aria-label="Resolute home" className="rounded-md">
                        <img src={darkMode ? "/logotransparentdark.png" : "/logotransparent.png"} alt="Resolute" className="h-[26px] w-auto" />
                    </Link>
                    {smallScreen &&
                        <button type="button" onClick={() => setHamburgerOpen(false)} className="ui-btn ui-btn-ghost ui-btn-sm px-2 -mr-2" aria-label="Close menu">
                            <Icon name="close" />
                        </button>
                    }
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-7">
                    <nav aria-label="Primary">
                        <ul className="flex flex-col gap-0.5">
                            {NAV.filter(item => !item.needsUser || loggedInUser).map(item => {
                                const active = isActive(item.to)
                                return (
                                    <li key={item.to}>
                                        <Link
                                        to={item.to}
                                        onClick={holdIfBusy}
                                        {...busyProps}
                                        aria-current={active ? 'page' : undefined}
                                        className={`ui-nav relative flex items-center gap-3 h-11 px-3 rounded-lg text-[15px] ${busy && !active ? 'opacity-50 cursor-progress' : ''} ${active ? 'bg-ink/[0.07] font-bold' : 'font-medium text-graphite hover:text-ink hover:bg-ink/[0.04]'}`}>
                                            <Icon name={item.icon} />
                                            <span>{item.label}{active && <span className="text-stop" aria-hidden="true">.</span>}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {loggedInUser &&
                        <section aria-labelledby="sidebar-resumes" className="flex flex-col gap-1">
                            <div className="flex items-center justify-between px-3">
                                <h2 id="sidebar-resumes" className="text-sm font-semibold text-graphite">Your resumes</h2>
                                {myResumes.length > 0 &&
                                    <Link to="/myresumes" onClick={holdIfBusy} {...busyProps} className="text-sm font-semibold text-graphite hover:text-ink underline-offset-2 hover:underline">View all</Link>
                                }
                            </div>
                            {myResumes.length > 0 ?
                                <ul className="flex flex-col">
                                    {myResumes.slice(0, RECENT_LIMIT).map(resume => (
                                        <li key={resume._id}>
                                            <Link
                                            to="/resume"
                                            onClick={(e) => { if (busy) { e.preventDefault(); return } setCurrResumeData(resume) }}
                                            title={resume.name}
                                            aria-disabled={busy || undefined}
                                            className={`block truncate px-3 py-2 rounded-lg text-[15px] hover:bg-ink/[0.04] ${busy ? 'opacity-50 cursor-progress' : ''}`}>
                                                {resume.name}
                                            </Link>
                                        </li>
                                    ))}
                                    {myResumes.length > RECENT_LIMIT &&
                                        <li className="px-3 pt-1 text-sm text-graphite">and {myResumes.length - RECENT_LIMIT} more</li>
                                    }
                                </ul>
                                :
                                <p className="px-3 py-1 text-sm text-graphite">{allResumes ? 'No resumes yet.' : 'Loading your resumes…'}</p>
                            }
                            <div className="px-3 pt-3">
                                <button type="button" disabled={busy} onClick={() => { setHamburgerOpen(false); buildResume() }} className="ui-btn ui-btn-primary w-full">
                                    <Icon name="add" />New resume
                                </button>
                            </div>
                        </section>
                    }

                    {!loggedInUser && !signingIn &&
                        <section className="px-3 flex flex-col gap-3">
                            <p className="text-sm text-graphite">Log in to build resumes, keep versions for each application and share them.</p>
                            <button type="button" onClick={() => { setHamburgerOpen(false); openLogin('login') }} className="ui-btn ui-btn-primary w-full">
                                <Icon name="login" />Log in
                            </button>
                            <button type="button" onClick={() => { setHamburgerOpen(false); openLogin('signup') }} className="ui-btn ui-btn-secondary w-full">
                                Create an account
                            </button>
                        </section>
                    }
                </div>

                <div className="shrink-0 border-t border-rule px-3 py-3 flex flex-col gap-1">
                    <button
                    type="button"
                    role="switch"
                    aria-checked={darkMode}
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center justify-between gap-3 h-11 px-3 rounded-lg text-[15px] font-medium hover:bg-ink/[0.04]">
                        <span className="flex items-center gap-3"><Icon name="moon" />Dark mode</span>
                        <span aria-hidden="true" className={`relative inline-flex h-6 w-10 rounded-full ${darkMode ? 'bg-ink' : 'bg-ink/20'}`}>
                            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-sheet shadow ${darkMode ? 'translate-x-4' : ''}`} />
                        </span>
                    </button>

                    {loggedInUser &&
                        <div className="flex items-center gap-3 px-3 pt-2 min-w-0">
                            <Link to="/profile" onClick={holdIfBusy} {...busyProps} className="flex items-center gap-3 min-w-0 flex-1 rounded-lg" title="Profile">
                                <Avatar src={pfp} name={loggedInUser.name} size={36} />
                                <span className="min-w-0">
                                    <span className="block truncate font-semibold text-[15px] leading-tight">{loggedInUser.name}</span>
                                    <span className="block truncate text-xs text-graphite">{loggedInUser.email}</span>
                                </span>
                            </Link>
                            <button type="button" onClick={logout} disabled={busy} className="ui-btn ui-btn-ghost ui-btn-sm px-2" aria-label="Log out" title="Log out">
                                <Icon name="logout" />
                            </button>
                        </div>
                    }
                    {signingIn &&
                        <p className="px-3 pt-2 text-sm text-graphite" role="status">Signing you in…</p>
                    }
                </div>
            </aside>
        </>
    )
}
