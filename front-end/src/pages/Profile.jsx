import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageCompression from 'browser-image-compression'
import { Avatar, Field, Notice, PasswordChecklist, PasswordInput, Spinner, Title } from '../components/ui.jsx'
import { friendlyAuthMessage, isStrongPassword } from '../lib/auth.js'

const longDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) : "-"

// Messages from the server and from this page, rewritten for people.
const STATUS_TEXT = {
    "Profile updated successfully": "Saved.",
    "Profile picture deleted": "Photo removed.",
    "No Changes made in Name": "That's already your name.",
    "No Changes made in Email": "That's already your email.",
    "No Changes made in bio": "Your bio is unchanged.",
    "Please add a name.": "Add a name before saving.",
    "Email cannot be empty": "Add an email before saving.",
    "Please enter a valid Password": "Enter your current password and a new one.",
    "Incorrect Password": "Your current password isn't right. Try again.",
}
const statusFor = (message) => {
    if (!message) return null
    const text = STATUS_TEXT[message] || friendlyAuthMessage(message)?.text || message
    const good = /success|deleted/i.test(message)
    return { text, tone: good ? 'success' : 'error' }
}

function Row({ label, children, action }) {
    return (
        <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)_auto] gap-x-6 gap-y-2 px-5 sm:px-6 py-5 items-start">
            <div className="text-sm font-semibold text-graphite sm:pt-2">{label}</div>
            <div className="min-w-0 sm:pt-1.5">{children}</div>
            {action && <div className="sm:justify-self-end">{action}</div>}
        </div>
    )
}

function Profile ({setPfp, setToken, loggedInUser, url, pfp, openLogin, signingIn, updateUser, flashNameAlert, nameAlert, setNameAlert, setLoggedInUser, setCurrResumeData}) {
    const [userToShow, setUserToShow] = useState(null)
    const [showDeleteUser, setShowDeleteUser] = useState(false)
    const [uploading, setUploading] = useState(false)
    // Which change is being sent to the server right now ('name', 'email', ...). One at a time.
    const [saving, setSaving] = useState(null)
    const save = async (field, formData, onSaved) => {
        if (saving) return
        setSaving(field)
        const ok = await updateUser(userToShow._id, formData)
        setSaving(null)
        if (ok) onSaved()   // keep the form open if the server said no, so nothing typed is lost
    }
    const saveLabel = (field, label) => saving === field ? <><Spinner />Saving…</> : label
    const [newPassword, setNewPassword] = useState('')
    const navigate = useNavigate()

    const deletePfp = async (id)  => {
        try{
            const response = await fetch(`${url}/api/users/deletepfp/${id}`, {
                method : "DELETE"
            })
            if (!response.ok) {
                throw new Error ("Couldn't delete somehow")
            }
            setPfp(null)
            setNameAlert("Profile picture deleted")
            flashNameAlert()
        } catch(error) {
            console.log(error.message)
        }
    }


    const deleteUser = async (id, user) => {
        try {
            const response = await fetch(`${url}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(user)
            })
            if (!response.ok) {
                throw new Error("couldn't delete user")
            }
            const actualresponse = await response.json()
            if (actualresponse.success === false) {
                // Wrong password: the account still exists, so stay signed in.
                setDeletionAlert(/incorrect password/i.test(actualresponse.message || '') ? "That password isn't right." : actualresponse.message)
                flashDeletionAlert()
                return
            }
            localStorage.removeItem("resoluteToken")
            setToken("")
            setPfp(null)
            setCurrResumeData(null)
            navigate("/")
        } catch (error) {
            setDeletionAlert("Couldn't delete your account. Check your connection and try again.")
            flashDeletionAlert()
        }
    }

    const [deletionAlert, setDeletionAlert] = useState(null)

    const flashDeletionAlert = () => {
        setTimeout(() => {
            setDeletionAlert(null)
        }, 5000)
    }


    useEffect(() => {
        setUserToShow(loggedInUser)
    }, [loggedInUser])

    const [editName, setEditName] = useState(false)
    const [editEmail, setEditEmail] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [editBio, setEditBio] = useState(false)

    const status = statusFor(nameAlert)

    if (userToShow) {
        return (
            <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
                <div className="max-w-3xl flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <Title>Profile</Title>
                        <p className="ui-lede">Your name, photo and bio appear in Community next to your public resumes. Your email is never shown.</p>
                    </div>

                    <div aria-live="polite">
                        {status && <Notice tone={status.tone}>{status.text}</Notice>}
                    </div>

                    <section aria-label="Account details" className="ui-sheet ui-divide">
                        <Row label="Photo">
                            <div className="flex flex-wrap items-center gap-4">
                                <Avatar src={pfp} name={userToShow.name} size={72} />
                                <div className="flex flex-wrap gap-2">
                                    <label className={`ui-btn ui-btn-secondary ui-btn-sm relative focus-within:outline focus-within:outline-2 focus-within:outline-ink focus-within:outline-offset-2 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                                        {uploading ? <><Spinner />Uploading…</> : pfp ? 'Change photo' : 'Add photo'}
                                        <input
                                        type="file"
                                        className = "sr-only"
                                        accept="image/*"
                                        disabled={uploading || !!saving}
                                        onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if (!file || uploading || saving) return
                                            setUploading(true)
                                            try {
                                                const compressedFile = await imageCompression(file, {
                                                maxSizeMB: 0.1,
                                                maxWidthOrHeight: 500,
                                                useWebWorker: true
                                                })

                                                const formData = new FormData()
                                                formData.append("profileimg", compressedFile)

                                                await updateUser(userToShow._id, formData)

                                            } catch (error) {
                                                console.error("Image compression failed:", error)
                                            } finally {
                                                setUploading(false)
                                                e.target.value = ''
                                            }
                                        }}
                                        />
                                    </label>
                                    {pfp &&
                                        <button type="button" disabled={uploading || !!saving} onClick = {async () => {setSaving('photo'); await deletePfp(loggedInUser._id); setSaving(null)}} className="ui-btn ui-btn-ghost ui-btn-sm">{saving === 'photo' ? <><Spinner />Removing…</> : 'Remove'}</button>
                                    }
                                </div>
                            </div>
                        </Row>

                        <Row label="Name" action={!editName && <button type="button" disabled={!!saving} className="ui-btn ui-btn-secondary ui-btn-sm" onClick = {() => {setEditName(true)}}>Edit</button>}>
                            {editName ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const newName = event.target.elements.name.value
                                    const formData = new FormData();
                                    formData.append("name", newName);
                                    if (newName === loggedInUser.name) {
                                        setNameAlert("No Changes made in Name")
                                        flashNameAlert()
                                        return
                                    }
                                    if (newName.trim() === "") {
                                        setNameAlert("Please add a name.")
                                        flashNameAlert()
                                        return
                                    }
                                    save('name', formData, () => setEditName(false))
                                }} 
                                className="flex flex-col gap-3 max-w-md">
                                    <label htmlFor="profile-name" className="sr-only">Name</label>
                                    <input 
                                    id="profile-name"
                                    type = "text"
                                    name = "name" 
                                    autoFocus
                                    autoComplete="name"
                                    onChange={(event) => {
                                        const newName = event.target.value
                                        const copyLog = {...userToShow}
                                        copyLog.name = newName
                                        setUserToShow(copyLog)
                                    }}
                                    value = {userToShow.name}
                                    className="ui-input"
                                    />
                                    <div className="flex gap-2">
                                        <button type = "submit" disabled={!!saving} className="ui-btn ui-btn-primary ui-btn-sm">{saveLabel('name', 'Save name')}</button>
                                        <button type = "button" disabled={!!saving} onClick = {() => {setUserToShow(loggedInUser); setNameAlert(null); setEditName(false)}} className="ui-btn ui-btn-ghost ui-btn-sm">Cancel</button>
                                    </div>
                                </form>
                                :
                                <p className="font-semibold break-words">{userToShow.name}</p>
                            }
                        </Row>

                        <Row label="Email" action={!editEmail && <button type="button" disabled={!!saving} className="ui-btn ui-btn-secondary ui-btn-sm" onClick = {() => {setEditEmail(true)}}>Edit</button>}>
                            {editEmail ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const formEmail = event.target.elements.email.value
                                    const formData = new FormData();
                                    formData.append("email", formEmail);
                                    if (formEmail === loggedInUser.email) {
                                        setNameAlert("No Changes made in Email")
                                        flashNameAlert()
                                        return
                                    }
                                    if (formEmail.trim() === "") {
                                        setNameAlert("Email cannot be empty")
                                        flashNameAlert()
                                        return
                                    }
                                    save('email', formData, () => setEditEmail(false))
                                }} 
                                className="flex flex-col gap-3 max-w-md">
                                    <label htmlFor="profile-email" className="sr-only">Email</label>
                                    <input 
                                    id="profile-email"
                                    type = "email"
                                    name = "email" 
                                    autoFocus
                                    autoComplete="email"
                                    onChange={(event) => {
                                        const newEmail = event.target.value
                                        const copyLog = {...userToShow}
                                        copyLog.email = newEmail
                                        setUserToShow(copyLog)
                                    }}
                                    value = {userToShow.email}
                                    className="ui-input"
                                    />
                                    <p className="ui-help">You'll use this to log in.</p>
                                    <div className="flex gap-2">
                                        <button type = "submit" disabled={!!saving} className="ui-btn ui-btn-primary ui-btn-sm">{saveLabel('email', 'Save email')}</button>
                                        <button type = "button" disabled={!!saving} onClick = {() => {setEditEmail(false); setNameAlert(null); setUserToShow(loggedInUser)}} className="ui-btn ui-btn-ghost ui-btn-sm">Cancel</button>
                                    </div>
                                </form>
                                :
                                <p className="break-all">{userToShow.email}</p>
                            }
                        </Row>

                        <Row label="Password" action={!editPassword && <button type="button" disabled={!!saving} className="ui-btn ui-btn-secondary ui-btn-sm" onClick = {() => {setEditPassword(true)}}>Change</button>}>
                            {editPassword ?
                                <div className="flex flex-col gap-5 max-w-md">
                                    <form
                                    noValidate
                                    onSubmit = {(event) => {
                                        event.preventDefault()
                                        const formPassword = event.target.elements.password.value
                                        const formNewPassword = event.target.elements.newPassword.value
                                        const formData = new FormData();
                                        formData.append("password", formPassword);
                                        formData.append("newPassword", formNewPassword);
                                        if (formNewPassword.trim() != "" && formPassword.trim() != "") {
                                            if (!isStrongPassword(formNewPassword)) {
                                                setNameAlert("Password must contain atleast 8 characters")
                                                flashNameAlert()
                                                return
                                            }
                                            save('password', formData, () => { setEditPassword(false); setNewPassword('') })
                                        } else {
                                            setNameAlert("Please enter a valid Password")
                                            flashNameAlert()
                                        }
                                    }} 
                                    className="flex flex-col gap-4">
                                        <input type="email" name="username" autoComplete="username" value={userToShow.email} readOnly hidden />
                                        <div>
                                            <label className="ui-label" htmlFor="profile-current-password">Current password</label>
                                            <PasswordInput id="profile-current-password" name="password" autoFocus />
                                        </div>
                                        <div>
                                            <label className="ui-label" htmlFor="profile-new-password">New password</label>
                                            <PasswordInput id="profile-new-password" name="newPassword" autoComplete="new-password" describedBy="profile-rules"
                                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            <PasswordChecklist id="profile-rules" password={newPassword} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button type = "submit" disabled={!!saving} className="ui-btn ui-btn-primary ui-btn-sm">{saveLabel('password', 'Save password')}</button>
                                            <button type = "button" disabled={!!saving} onClick = {() => {setEditPassword(false); setNewPassword('')}} className="ui-btn ui-btn-ghost ui-btn-sm">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                                :
                                <p aria-label="Hidden" className="tracking-[0.2em] text-graphite">••••••••</p>
                            }
                        </Row>

                        <Row label="Bio" action={!editBio && <button type="button" disabled={!!saving} className="ui-btn ui-btn-secondary ui-btn-sm" onClick = {() => {setEditBio(true)}}>Edit</button>}>
                            {editBio ?
                                <form
                                onSubmit = {(event) => {
                                    event.preventDefault()
                                    const newBio = event.target.elements.bio.value
                                    const formData = new FormData();
                                    formData.append("bio", newBio);
                                    if (newBio === loggedInUser.bio) {
                                        setNameAlert("No Changes made in bio")
                                        flashNameAlert()
                                        return
                                    }
                                    if (newBio.trim() === "") {
                                        formData.bio = " "
                                    }
                                    save('bio', formData, () => setEditBio(false))
                                }} 
                                className="flex flex-col gap-3">
                                    <label htmlFor="profile-bio" className="sr-only">Bio</label>
                                    <textarea
                                    id="profile-bio"
                                    name = "bio" 
                                    autoFocus
                                    rows={4}
                                    onChange={(event) => {
                                        const newBio = event.target.value
                                        const copyLog = {...userToShow}
                                        copyLog.bio = newBio
                                        setUserToShow(copyLog)
                                    }}
                                    value = {userToShow.bio || ''}
                                    placeholder="What you do and what you're looking for, in a sentence or two."
                                    className="ui-input"
                                    />
                                    <div className="flex gap-2">
                                        <button type = "submit" disabled={!!saving} className="ui-btn ui-btn-primary ui-btn-sm">{saveLabel('bio', 'Save bio')}</button>
                                        <button type = "button" disabled={!!saving} onClick = {() => {setEditBio(false); setUserToShow(loggedInUser); setNameAlert(null)}} className="ui-btn ui-btn-ghost ui-btn-sm">Cancel</button>
                                    </div>
                                </form>
                                :
                                (userToShow.bio ? <p className="whitespace-pre-line break-words">{userToShow.bio}</p> : <p className="text-graphite">No bio yet. Add one so people in Community know who you are.</p>)
                            }
                        </Row>

                        <Row label="Account">
                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                                <dt className="text-graphite">Joined</dt><dd>{longDate(userToShow.createdAt)}</dd>
                                <dt className="text-graphite">Last updated</dt><dd>{longDate(userToShow.updatedAt)}</dd>
                            </dl>
                        </Row>
                    </section>

                    <div>
                        <button
                        type="button"
                        disabled={!!saving || uploading}
                        onClick = {() => {setToken(""); localStorage.removeItem("resoluteToken"); setPfp(null); setCurrResumeData(null); navigate("/")}}
                        className="ui-btn ui-btn-secondary">
                            Log out
                        </button>
                    </div>

                    <section aria-labelledby="danger-heading" className="rounded-[14px] border border-danger/40 p-5 sm:p-6 flex flex-col gap-4">
                        <div>
                            <h2 id="danger-heading" className="font-bold text-lg">Delete account</h2>
                            <p className="text-graphite mt-1">Deletes your profile and every resume you've made, including public ones. This can't be undone.</p>
                        </div>
                        {!showDeleteUser ? 
                            <button type="button" disabled={!!saving} onClick = {() => setShowDeleteUser(true)} className="ui-btn ui-btn-danger-quiet self-start">
                                Delete my account
                            </button>
                            :
                            <form
                            onSubmit = {(event) => {
                                event.preventDefault()
                                const password = event.target.elements.password.value
                                if (password === "") {
                                    setDeletionAlert("Enter your password.")
                                    flashDeletionAlert()
                                    return
                                }
                                if (event.target.elements.verifier.value !== "I am going to regret this") {
                                    setDeletionAlert("Type the sentence exactly as shown.")
                                    flashDeletionAlert()
                                    return
                                }
                                if (saving) return
                                setSaving('delete')
                                deleteUser(loggedInUser._id, {password: password}).finally(() => setSaving(null))

                            }}
                            className="flex flex-col gap-4 max-w-md">
                                <input type="email" name="username" autoComplete="username" value={userToShow.email} readOnly hidden />
                                <div>
                                    <label className="ui-label" htmlFor="delete-password">Your password</label>
                                    <PasswordInput id="delete-password" name="password" autoFocus />
                                </div>
                                <Field label={<>Type <span className="font-bold">I am going to regret this</span></>} htmlFor="delete-verifier">
                                    <input id="delete-verifier" type = "text" className="ui-input" name = "verifier" autoComplete="off" spellCheck={false}/>
                                </Field>
                                {deletionAlert && <Notice tone="error">{deletionAlert}</Notice>}
                                <div className="flex flex-wrap gap-2">
                                    <button type = "submit" disabled={!!saving} className="ui-btn ui-btn-danger">{saving === 'delete' ? <><Spinner />Deleting…</> : 'Delete account for good'}</button>
                                    <button onClick = {() => {setShowDeleteUser(false)}} disabled={saving === 'delete'} type = "button" className="ui-btn ui-btn-ghost">Cancel</button>
                                </div>
                            </form>
                        }
                    </section>
                </div>
            </main>
        )
    } else {
        return (
            <main className="ui ui-page md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
                <div className="max-w-xl flex flex-col gap-6">
                    <Title>Profile</Title>
                    {signingIn ?
                        <p className="ui-lede" role="status">Signing you in…</p>
                        :
                        <>
                            <p className="ui-lede">Log in to edit your name, photo, bio and password.</p>
                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={() => openLogin('login')} className="ui-btn ui-btn-primary">Log in</button>
                            </div>
                        </>
                    }
                </div>
            </main>
        )
    }
}

export default Profile
