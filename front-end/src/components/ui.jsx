import { useEffect, useId, useRef, useState } from 'react'
import { passwordChecks } from '../lib/auth.js'

// Material Symbols (outlined) paths, drawn with currentColor so they follow the theme.
const PATHS = {
  menu: 'M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z',
  close: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z',
  home: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z',
  doc: 'M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z',
  globe: 'M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z',
  person: 'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z',
  add: 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z',
  logout: 'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z',
  login: 'M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z',
  moon: 'M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z',
  check: 'M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z',
  dot: 'M480-400q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Z',
  delete: 'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z',
  up: 'M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z',
  down: 'M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z',
  search: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
  chevron: 'm321-80-71-71 329-329-329-329 71-71 400 400L321-80Z',
  lock: 'M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z',
  mail: 'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z',
  photo: 'M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z',
  edit: 'M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z',
}

export function Icon({ name, size = 20, className = '', ...rest }) {
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" className={`shrink-0 ${className}`} {...rest}>
      <path d={PATHS[name]} />
    </svg>
  )
}

// Page titles end in the logo's red full stop.
export function Title({ children, as: Tag = 'h1', className = '' }) {
  return (
    <Tag className={`ui-title ${className}`}>
      {children}<span className="text-stop" aria-hidden="true">.</span>
    </Tag>
  )
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'

export function Avatar({ src, name, size = 40, className = '' }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [src])
  const style = { width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.38)) }
  if (src && !broken) {
    return <img src={src} alt="" onError={() => setBroken(true)} style={style} className={`rounded-full object-cover shrink-0 bg-wash ${className}`} />
  }
  return (
    <span aria-hidden="true" style={style} className={`rounded-full shrink-0 inline-flex items-center justify-center font-bold tracking-tight bg-ink/10 text-ink ${className}`}>
      {initials(name)}
    </span>
  )
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Plays the exit animation, then runs the real close. Ignores repeat calls while closing.
export function useAnimatedClose(onClose, duration = 180) {
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const close = () => {
    if (closingRef.current) return
    if (prefersReducedMotion()) { onClose?.(); return }
    closingRef.current = true
    setClosing(true)
    setTimeout(() => onClose?.(), duration)
  }
  return [closing, close]
}

// Accessible modal: labelled, ESC and backdrop close it, focus moves in and comes back.
// dismissible={false} keeps it open (for example while a request it started is still running).
export function Dialog({ title, description, onClose, children, size = 'md', footer, closeLabel = 'Close', hideTitle = false, dismissible = true }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const [closing, animatedClose] = useAnimatedClose(onClose)
  const dismissRef = useRef(dismissible)
  dismissRef.current = dismissible
  const requestClose = () => { if (dismissRef.current) animatedClose() }
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    // Respect an element that already took focus via autoFocus; otherwise focus the first field.
    if (panel && !panel.contains(document.activeElement)) {
      const first = panel.querySelector('input:not([type=hidden]):not([hidden]), textarea, select')
      ;(first || panel).focus()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); requestClose() }
      if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])')]
        if (!items.length) return
        const firstEl = items[0], lastEl = items[items.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus()
    }
  }, [])
  const width = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }[size]
  return (
    <div className="ui fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className={`${closing ? 'ui-fade-out' : 'ui-fade'} absolute inset-0 bg-black/45`} onClick={requestClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${closing ? 'ui-dialog-out' : 'ui-dialog-in'} relative w-full ${width} max-h-[92vh] overflow-y-auto bg-sheet text-ink rounded-t-[18px] sm:rounded-[18px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] focus:outline-none`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className={hideTitle ? 'sr-only' : ''}>
            <h2 id={titleId} className="ui-h2">{title}</h2>
            {description && <p className="ui-help mt-1.5">{description}</p>}
          </div>
          <button type="button" onClick={requestClose} disabled={!dismissible} className="ui-btn ui-btn-ghost ui-btn-sm -mr-2 -mt-1 px-2" aria-label={closeLabel}>
            <Icon name="close" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-4">{children}</div>
        {footer && <div className="px-6 pb-6 -mt-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, help, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="ui-label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {help && <p className="ui-help mt-1.5">{help}</p>}
    </div>
  )
}

export function PasswordInput({ id, name, value, onChange, autoComplete = 'current-password', autoFocus, invalid, describedBy, placeholder }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className="ui-input pr-20"
        spellCheck={false}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-2.5 rounded-md text-sm font-semibold text-graphite hover:text-ink hover:bg-ink/5"
        aria-pressed={shown}
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        {shown ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

export function PasswordChecklist({ password, id }) {
  const checks = passwordChecks(password)
  return (
    <ul id={id} className="mt-2.5 grid gap-1 text-sm" aria-label="Password requirements">
      {checks.map((c) => (
        <li key={c.id} className={`flex items-center gap-2 ${c.ok ? 'text-ink' : 'text-graphite'}`}>
          <Icon name={c.ok ? 'check' : 'dot'} size={16} />
          <span>{c.label}</span>
          <span className="sr-only">{c.ok ? '(done)' : '(not yet)'}</span>
        </li>
      ))}
    </ul>
  )
}

// Inline status message. tone: 'info' | 'error' | 'success'
export function Notice({ tone = 'info', children, className = '' }) {
  const styles = {
    info: 'border-edge bg-wash text-ink',
    success: 'border-ink/25 bg-wash text-ink',
    error: 'border-danger/40 bg-danger/[0.07] text-ink',
  }[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`ui-item-in rounded-lg border px-3.5 py-2.5 text-sm ${styles} ${className}`}>
      {children}
    </div>
  )
}

export function Spinner({ size = 16 }) {
  return (
    <span aria-hidden="true" style={{ width: size, height: size }} className="inline-block rounded-full border-2 border-current border-r-transparent animate-spin" />
  )
}

// Grey placeholder shown while data loads.
export function Skeleton({ className = '' }) {
  return <span aria-hidden="true" className={`ui-skeleton block ${className}`} />
}

// A row-list placeholder that matches the height of real list rows.
export function ListSkeleton({ rows = 3, label = 'Loading' }) {
  return (
    <div role="status" aria-label={label} className="ui-sheet ui-divide overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 sm:px-6 py-5">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-9 w-20 hidden sm:block" />
        </div>
      ))}
    </div>
  )
}
