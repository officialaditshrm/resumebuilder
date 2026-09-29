import { useEffect, useState } from 'react'

// Same rule the server enforces in userController.js (register, update, reset).
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!^#%*?&])[A-Za-z\d@$!^#%*?&]{8,}$/

export const passwordChecks = (password = '') => [
  { id: 'length', label: 'At least 8 characters', ok: password.length >= 8 },
  { id: 'upper', label: 'An uppercase letter', ok: /[A-Z]/.test(password) },
  { id: 'lower', label: 'A lowercase letter', ok: /[a-z]/.test(password) },
  { id: 'digit', label: 'A number', ok: /\d/.test(password) },
  { id: 'symbol', label: 'One of these symbols: @ $ ! ^ # % * ? &', ok: /[@$!^#%*?&]/.test(password) },
  { id: 'allowed', label: 'No spaces or other symbols', ok: password.length > 0 && /^[A-Za-z\d@$!^#%*?&]+$/.test(password) },
]

export const isStrongPassword = (password = '') => PASSWORD_PATTERN.test(password)

// Turns the backend's messages into something a person can act on.
// `action` tells the caller which follow-up to offer.
export function friendlyAuthMessage(message) {
  if (!message) return null
  const m = String(message)
  if (/^invalid email credentials$/i.test(m)) return { text: "There's no account with that email.", action: 'signup' }
  if (/^incorrect password$/i.test(m)) return { text: "That password isn't right. Check it and try again." }
  if (/already in use/i.test(m)) return { text: 'An account with this email already exists.', action: 'login' }
  if (/^invalid email$/i.test(m)) return { text: 'Enter a valid email address, like name@example.com.' }
  if (/^password must contain/i.test(m)) return { text: "That password doesn't meet the rules listed below the field." }
  if (/same password/i.test(m)) return { text: "Choose a password you haven't used for this account before." }
  if (/failed to fetch|networkerror|load failed/i.test(m)) return { text: "Couldn't reach the server. Check your connection and try again." }
  return { text: m }
}

// The API runs on a free host that sleeps when idle; the first request can take a while.
export function useSlowHint(pending, delay = 6000) {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    if (!pending) { setSlow(false); return }
    const t = setTimeout(() => setSlow(true), delay)
    return () => clearTimeout(t)
  }, [pending, delay])
  return slow
}

export const SLOW_SERVER_TEXT = 'Still working. The server can take up to a minute to wake up after a quiet spell.'
