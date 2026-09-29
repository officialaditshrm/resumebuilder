import { useState } from 'react'
import { Dialog, Field, Notice, PasswordChecklist, PasswordInput, Spinner } from './ui.jsx'
import { friendlyAuthMessage, isStrongPassword, useSlowHint, SLOW_SERVER_TEXT } from '../lib/auth.js'

const TITLES = {
    login: { title: 'Log in to Resolute', description: 'Pick up where you left off.' },
    signup: { title: 'Create your account', description: 'Free. Build as many resumes as you need.' },
}

function Login ({setLoggedInUser, fetchResumes, setShowLogin, url, setToken, mode = 'login', setMode}) {
    const [alert, setAlert] = useState(null)       // { text, action }
    const [pending, setPending] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const slow = useSlowHint(pending)

    const switchMode = (next) => { setAlert(null); setMode(next) }
    const close = () => setShowLogin(false)

    // Only keep a token the server actually issued.
    const finish = (actualresponse) => {
        if (actualresponse.success === true && actualresponse.token) {
            localStorage.setItem("resoluteToken", actualresponse.token)
            setToken(actualresponse.token)
            setShowLogin(false)
            fetchResumes()
            return
        }
        setAlert(friendlyAuthMessage(actualresponse.message) || { text: 'Something went wrong. Try again.' })
    }

    const send = async (path, body) => {
        if (pending) return   // one request at a time
        setPending(true)
        setAlert(null)
        try {
            const response = await fetch(`${url}/api/users/${path}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type" : "application/json" }
            })
            finish(await response.json())
        } catch (error) {
            setAlert(friendlyAuthMessage(error.message))
        } finally {
            setPending(false)
        }
    }

    const alertBlock = alert &&
        <Notice tone="error">
            {alert.text}{' '}
            {alert.action === 'login' && <button type="button" className="ui-link" onClick={() => switchMode('login')}>Log in instead</button>}
            {alert.action === 'signup' && <button type="button" className="ui-link" onClick={() => switchMode('signup')}>Create an account</button>}
        </Notice>

    const { title, description } = TITLES[mode] || TITLES.login

    return (
        <Dialog title={title} description={description} onClose={close} size="sm">
            {mode === 'login' &&
                <form
                noValidate
                onSubmit={(event) => {
                    event.preventDefault()
                    if (!email.trim() || !password) { setAlert({ text: 'Enter your email and password.' }); return }
                    send('login', { email: email.trim(), password })
                }}
                className="flex flex-col gap-4">
                    <fieldset disabled={pending} className="contents">
                    <Field label="Email" htmlFor="login-email">
                        <input id="login-email" name="email" type="email" autoComplete="email" className="ui-input" autoFocus
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                    <div>
                        <label className="ui-label" htmlFor="login-password">Password</label>
                        <PasswordInput id="login-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    </fieldset>
                    {alertBlock}
                    {slow && <Notice>{SLOW_SERVER_TEXT}</Notice>}
                    <button type="submit" className="ui-btn ui-btn-primary w-full mt-1" disabled={pending}>
                        {pending ? <><Spinner />Logging in…</> : 'Log in'}
                    </button>
                    <p className="text-sm text-graphite text-center">
                        New to Resolute? <button type="button" className="ui-link text-ink" onClick={() => switchMode('signup')}>Create an account</button>
                    </p>
                </form>
            }

            {mode === 'signup' &&
                <form
                noValidate
                onSubmit={(event) => {
                    event.preventDefault()
                    if (!name.trim()) { setAlert({ text: 'Add your name. It appears on your profile.' }); return }
                    if (!email.trim()) { setAlert({ text: 'Enter your email address.' }); return }
                    if (!isStrongPassword(signupPassword)) { setAlert({ text: "That password doesn't meet the rules listed below the field." }); return }
                    send('register', { name: name.trim(), email: email.trim(), password: signupPassword })
                }}
                className="flex flex-col gap-4">
                    <Field label="Name" htmlFor="signup-name">
                        <input id="signup-name" name="signupname" type="text" autoComplete="name" className="ui-input" autoFocus
                        value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>
                    <Field label="Email" htmlFor="signup-email">
                        <input id="signup-email" name="signupemail" type="email" autoComplete="email" className="ui-input"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                    <div>
                        <label className="ui-label" htmlFor="signup-password">Password</label>
                        <PasswordInput id="signup-password" name="signuppassword" autoComplete="new-password" describedBy="signup-rules"
                        value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                        <PasswordChecklist id="signup-rules" password={signupPassword} />
                    </div>
                    {alertBlock}
                    {slow && <Notice>{SLOW_SERVER_TEXT}</Notice>}
                    <button type="submit" className="ui-btn ui-btn-primary w-full mt-1" disabled={pending}>
                        {pending ? <><Spinner />Creating account…</> : 'Create account'}
                    </button>
                    <p className="text-sm text-graphite text-center">
                        Already have an account? <button type="button" className="ui-link text-ink" onClick={() => switchMode('login')}>Log in</button>
                    </p>
                </form>
            }

        </Dialog>
    )
}

export default Login
