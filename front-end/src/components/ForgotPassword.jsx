import { useEffect, useState } from 'react'
import { Field, Icon, Notice, Spinner } from './ui.jsx'
import { friendlyAuthMessage, useSlowHint, SLOW_SERVER_TEXT } from '../lib/auth.js'

const RESEND_SECONDS = 60

// Asks the server to email a reset link. Used in the login dialog and on /reset-password.
export default function ForgotPassword ({ url, initialEmail = '', onBack, backLabel = 'Back to log in' }) {
    const [email, setEmail] = useState(initialEmail)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [sentTo, setSentTo] = useState(null)
    const [cooldown, setCooldown] = useState(0)
    const slow = useSlowHint(pending)

    useEffect(() => {
        if (cooldown <= 0) return
        const t = setTimeout(() => setCooldown(c => c - 1), 1000)
        return () => clearTimeout(t)
    }, [cooldown])

    const requestLink = async (address) => {
        setPending(true)
        setError(null)
        try {
            const response = await fetch(`${url}/api/users/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: address })
            })
            if (response.status === 404) { setError("Password reset isn't switched on for this server yet. Contact the site owner."); return }
            const data = await response.json()
            if (!data.success) {
                setError(friendlyAuthMessage(data.message)?.text || "Couldn't send the email. Try again in a minute.")
                return
            }
            setSentTo(address)
            setCooldown(RESEND_SECONDS)
        } catch (err) {
            setError("Couldn't reach the server. Check your connection and try again.")
        } finally {
            setPending(false)
        }
    }

    if (sentTo) {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex gap-3 items-start">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.07]"><Icon name="mail" /></span>
                    <div role="status">
                        <p className="font-semibold">Check your email</p>
                        <p className="ui-help mt-1">
                            If there's an account for <span className="font-semibold text-ink break-all">{sentTo}</span>, a link to reset your password is on its way. It works for 15 minutes. Check your spam folder if it doesn't arrive.
                        </p>
                    </div>
                </div>
                {error && <Notice tone="error">{error}</Notice>}
                <div className="flex flex-wrap gap-3">
                    <button type="button" className="ui-btn ui-btn-secondary" disabled={cooldown > 0 || pending} onClick={() => requestLink(sentTo)}>
                        {pending ? <><Spinner />Sending…</> : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
                    </button>
                    <button type="button" className="ui-btn ui-btn-ghost" onClick={() => { setSentTo(null); setError(null) }}>Use a different email</button>
                </div>
                {onBack && <button type="button" className="ui-link self-start text-sm" onClick={onBack}>{backLabel}</button>}
            </div>
        )
    }

    return (
        <form
        noValidate
        onSubmit={(event) => {
            event.preventDefault()
            const address = email.trim()
            if (!/^\S+@\S+\.\S+$/.test(address)) { setError('Enter the email you signed up with, like name@example.com.'); return }
            requestLink(address)
        }}
        className="flex flex-col gap-4">
            <p className="ui-help">Enter the email you signed up with and we'll send you a link to choose a new password.</p>
            <Field label="Email" htmlFor="forgot-email">
                <input id="forgot-email" name="email" type="email" autoComplete="email" autoFocus className="ui-input"
                value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? 'true' : undefined} />
            </Field>
            {error && <Notice tone="error">{error}</Notice>}
            {slow && <Notice>{SLOW_SERVER_TEXT}</Notice>}
            <button type="submit" className="ui-btn ui-btn-primary w-full" disabled={pending}>
                {pending ? <><Spinner />Sending…</> : 'Email me a reset link'}
            </button>
            {onBack && <button type="button" className="ui-link self-center text-sm" onClick={onBack}>{backLabel}</button>}
        </form>
    )
}
