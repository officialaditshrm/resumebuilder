import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Dialog, Icon, ListSkeleton, Title } from '../components/ui.jsx'


function Community ({url, darkMode, allResumes, fetchUsers, allUsers, setAllUsers, fetchResumes, setCurrResumeData, particularUser, setParticularUser, loggedInUser, currResumeData}) {
    const [query, setQuery] = useState('')

    useEffect(() => {
    if (!allResumes || !allUsers) return;

    // Prevent infinite loop: only update if not already updated
    const needsUpdate = allUsers.some(user => user.publiccount === undefined)
    if (!needsUpdate) return;

    const publicCounts = {}
    allResumes.forEach(resume => {
        if (!resume.private) {
            publicCounts[resume.user_id] = (publicCounts[resume.user_id] || 0) + 1
        }
    })

    setAllUsers(prev => 
        prev.map(user => ({
            ...user,
            publiccount: publicCounts[user._id] || 0
        }))
    );
}, [allUsers, allResumes])


    useEffect(() => {
        setParticularUser(null)
        fetchUsers()
        
    }, [])

    const publicTotal = allResumes ? allResumes.filter((resume) => resume.private === false).length : null
    const needle = query.trim().toLowerCase()
    const people = allUsers
        ?.slice() // clone to avoid mutating original
        .sort((a, b) => {
            if ((b.publiccount || 0) !== (a.publiccount || 0)) {
            return (b.publiccount || 0) - (a.publiccount || 0);
            }
            if (!!b.profileimg !== !!a.profileimg) {
            return !!b.profileimg ? 1 : -1;
            }
            
            if (!!b.bio !== !!a.bio) {
            return !!b.bio ? 1 : -1;
            }return 0;
        })
        .filter((user) => !needle || (user.name || '').toLowerCase().includes(needle))

    return (
        <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
            <div className="max-w-4xl flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <Title>Community</Title>
                    <p className="ui-lede">
                        {allUsers && publicTotal !== null ?
                            `${allUsers.length} ${allUsers.length === 1 ? 'member' : 'members'} sharing ${publicTotal} public ${publicTotal === 1 ? 'resume' : 'resumes'}. Open someone's profile to read their resumes.`
                            : 'See how other people write their resumes.'}
                    </p>
                </div>

                <div className="relative max-w-sm">
                    <label htmlFor="community-search" className="sr-only">Search people by name</label>
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite pointer-events-none" />
                    <input id="community-search" type="search" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} className="ui-input pl-10" />
                </div>

                {!allUsers && <ListSkeleton rows={4} label="Loading people" />}
                {people && people.length === 0 &&
                    <p className="text-graphite">No one matches “{query}”. <button type="button" className="ui-link text-ink" onClick={() => setQuery('')}>Clear the search</button></p>
                }
                {people && people.length > 0 &&
                    <ul id="listofusers" className="ui-sheet ui-divide overflow-hidden">
                        {people.map((user) => (
                            <li key={user._id}>
                                <button
                                type="button"
                                onClick={() => setParticularUser(user)}
                                className="w-full text-left flex items-start gap-4 px-5 sm:px-6 py-5 hover:bg-ink/[0.03]">
                                    <Avatar src={user.profileimg ? user.profilesrc : null} name={user.name} size={48} />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                            <span className="font-bold text-lg leading-snug break-words">{user.name}</span>
                                            <span className="text-sm text-graphite">
                                                {user.publiccount ? `${user.publiccount} public ${user.publiccount > 1 ? 'resumes' : 'resume'}` : 'No public resumes'}
                                            </span>
                                        </span>
                                        {user.bio ?
                                            <span className="block mt-1 text-graphite line-clamp-2 break-words">{user.bio}</span>
                                            :
                                            <span className="block mt-1 text-graphite/70 text-sm">No bio yet</span>
                                        }
                                    </span>
                                    <Icon name="chevron" size={16} className="mt-2 text-graphite" />
                                </button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
            {particularUser && <ParticularUser darkMode = {darkMode} setParticularUser={setParticularUser} setCurrResumeData={setCurrResumeData} loggedInUser = {loggedInUser} currResumeData = {currResumeData} allResumes={allResumes} particularUser={particularUser}/>}
        </main>
    )
}

export default Community

function ParticularUser ({particularUser, setParticularUser, loggedInUser, setCurrResumeData, allResumes}) {
    const [userPublicResumes, setUserPublicResumes] = useState([])
    useEffect(() => {
        if (!allResumes || !particularUser) return;

        const publicResumes = allResumes.filter(
            resume => resume.user_id === particularUser._id && !resume.private
        );

        setUserPublicResumes(publicResumes)
    }, [])
    const close = () => {setParticularUser(null); setUserPublicResumes([])}
    return (
        <Dialog title={particularUser.name} onClose={close} size="md" hideTitle>
            <div className="flex items-center gap-4">
                <Avatar src={particularUser.profileimg ? particularUser.profilesrc : null} name={particularUser.name} size={64} />
                <div className="min-w-0">
                    <p className="ui-h2 break-words" aria-hidden="true">{particularUser.name}</p>
                    {loggedInUser && loggedInUser._id === particularUser._id && <p className="text-sm text-graphite">This is you</p>}
                </div>
            </div>
            {particularUser.bio ?
                <p className="mt-5 whitespace-pre-line break-words">{particularUser.bio}</p>
                :
                <p className="mt-5 text-graphite">No bio yet.</p>
            }
            <h3 className="mt-7 mb-2 text-sm font-semibold text-graphite">Public resumes</h3>
            {userPublicResumes.length > 0 ?
                <ul className="rounded-[12px] border border-rule ui-divide overflow-hidden">
                    {userPublicResumes.map((resume) => (
                        <li key={resume._id}>
                            <Link
                            onClick = {() => {setParticularUser(null); setUserPublicResumes([]); setCurrResumeData(resume)}}
                            to = "/resume"
                            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-ink/[0.03]">
                                <span className="min-w-0 font-semibold break-words">{resume.name}</span>
                                <span className="text-sm font-semibold shrink-0">View</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                :
                <p className="text-graphite">Nothing shared yet.</p>
            }
        </Dialog>
    )
}
