import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon, Notice, PasswordChecklist, PasswordInput, Spinner, Title } from '../components/ui.jsx'
import ForgotPassword from '../components/ForgotPassword.jsx'
import { friendlyAuthMessage, isStrongPassword, useSlowHint, SLOW_SERVER_TEXT } from '../lib/auth.js'

// Landing page for the link in the reset email: /reset-password?token=...
function ResetPassword ({ url, setToken, fetchResumes }) {
    const { search } = useLocation()
    const navigate = useNavigate()
    const [resetToken] = useState(() => new URLSearchParams(search).get('token') || '')
    const [stage, setStage] = useState(resetToken ? 'verifying' : 'invalid') // verifying | invalid | form | done
    const [accountEmail, setAccountEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState(null)
    const [pending, setPending] = useState(false)
    const [invalidReason, setInvalidReason] = useState(null)
    const slow = useSlowHint(pending || stage === 'verifying')

    useEffect(() => {
        // Keep the token out of the address bar and browser history once we've read it.
        if (resetToken) window.history.replaceState(window.history.state, '', '/reset-password')
        if (!resetToken) return
        let cancelled = false
        ;(async () => {
            try {
                const response = await fetch(`${url}/api/users/reset-password/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: resetToken })
                })
                if (response.status === 404) { if (!cancelled) { setInvalidReason("Password reset isn't switched on for this server yet. Contact the site owner."); setStage('invalid') } return }
                const data = await response.json()
                if (cancelled) return
                if (data.success) { setAccountEmail(data.email || ''); setStage('form') }
                else { setInvalidReason(data.message); setStage('invalid') }
            } catch (err) {
                if (!cancelled) { setInvalidReason("Couldn't reach the server to check this link. Refresh the page to try again."); setStage('invalid') }
            }
        })()
        return () => { cancelled = true }
    }, [])

    const submit = async (event) => {
        event.preventDefault()
        setError(null)
        if (!isStrongPassword(password)) { setError("That password doesn't meet the rules listed below the field."); return }
        if (password !== confirm) { setError("The two passwords don't match."); return }
        setPending(true)
        try {
            const response = await fetch(`${url}/api/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: resetToken, password })
            })
            const data = await response.json()
            if (!data.success) {
                if (/invalid or has expired/i.test(data.message || '')) { setInvalidReason(data.message); setStage('invalid'); return }
                setError(friendlyAuthMessage(data.message)?.text || 'Something went wrong. Try again.')
                return
            }
            if (data.token) {
                localStorage.setItem("resoluteToken", data.token)
                setToken(data.token)
                fetchResumes()
            }
            setStage('done')
        } catch (err) {
            setError("Couldn't reach the server. Check your connection and try again.")
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="ui md:ml-72 min-h-screen px-5 sm:px-8 lg:px-14 pt-10 md:pt-20 pb-24">
            <div className="max-w-md">
                {stage === 'verifying' &&
                    <div role="status" className="flex flex-col gap-4">
                        <Title>Checking your link</Title>
                        <p className="ui-lede flex items-center gap-2"><Spinner />One moment.</p>
                        {slow && <Notice>{SLOW_SERVER_TEXT}</Notice>}
                    </div>
                }

                {stage === 'invalid' &&
                    <div className="flex flex-col gap-6">
                        <Title>{resetToken ? 'This link has expired' : 'Reset your password'}</Title>
                        {resetToken && <p className="ui-lede">
                            {invalidReason && !/invalid or has expired/i.test(invalidReason) ? invalidReason :
                            "Reset links work for 15 minutes and only once. Ask for a new one below and use the newest email."}
                        </p>}
                        <div className="ui-sheet p-6">
                            <ForgotPassword url={url} onBack={() => navigate('/')} backLabel="Back to home" />
                        </div>
                    </div>
                }

                {stage === 'form' &&
                    <div className="flex flex-col gap-6">
                        <Title>Choose a new password</Title>
                        {accountEmail && <p className="ui-lede">For <span className="font-semibold text-ink break-all">{accountEmail}</span></p>}
                        <form noValidate onSubmit={submit} className="ui-sheet p-6 flex flex-col gap-5">
                            {/* Helps password managers attach the new password to the right account */}
                            <input type="email" name="username" autoComplete="username" value={accountEmail} readOnly hidden />
                            <div>
                                <label className="ui-label" htmlFor="reset-password">New password</label>
                                <PasswordInput id="reset-password" name="password" autoComplete="new-password" autoFocus describedBy="reset-rules"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                                <PasswordChecklist id="reset-rules" password={password} />
                            </div>
                            <div>
                                <label className="ui-label" htmlFor="reset-confirm">Type it again</label>
                                <PasswordInput id="reset-confirm" name="confirm" autoComplete="new-password"
                                invalid={confirm.length > 0 && confirm !== password}
                                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                                {confirm.length > 0 && confirm !== password && <p className="ui-help mt-1.5">Doesn't match yet.</p>}
                            </div>
                            {error && <Notice tone="error">{error}</Notice>}
                            {slow && <Notice>{SLOW_SERVER_TEXT}</Notice>}
                            <button type="submit" className="ui-btn ui-btn-primary w-full" disabled={pending}>
                                {pending ? <><Spinner />Saving…</> : 'Save new password'}
                            </button>
                        </form>
                    </div>
                }

                {stage === 'done' &&
                    <div className="flex flex-col gap-6" role="status">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-on-ink"><Icon name="check" size={26} /></span>
                        <Title>Password saved</Title>
                        <p className="ui-lede">You're logged in with your new password. Links in older reset emails no longer work.</p>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" className="ui-btn ui-btn-primary" onClick={() => navigate('/myresumes')}>Go to my resumes</button>
                            <button type="button" className="ui-btn ui-btn-secondary" onClick={() => navigate('/')}>Home</button>
                        </div>
                    </div>
                }
            </div>
        </main>
    )
}

export default ResetPassword
