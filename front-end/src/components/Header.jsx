import { Link } from 'react-router-dom'
import { Avatar, Icon } from './ui.jsx'

// Top bar for phones and small tablets. The sidebar takes over from 768px up.
function Header ({busy, darkMode, loggedInUser, pfp, signingIn, openLogin, hamburgerOpen, setHamburgerOpen}) {
    return (
        <header className="ui md:hidden fixed top-0 inset-x-0 z-40 h-14 px-2 flex items-center justify-between bg-canvas/90 backdrop-blur border-b border-rule text-ink">
            <button
            type="button"
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
            aria-expanded={hamburgerOpen}
            aria-controls="app-sidebar"
            aria-label="Open menu"
            className="ui-btn ui-btn-ghost px-2.5">
                <Icon name="menu" size={24} />
            </button>
            <Link to="/" onClick={(e) => { if (busy) e.preventDefault() }} aria-disabled={busy || undefined} aria-label="Resolute home" className="absolute left-1/2 -translate-x-1/2 rounded-md">
                <img src={darkMode ? "/logotransparentdark.png" : "/logotransparent.png"} alt="Resolute" className="h-[22px] w-auto" />
            </Link>
            {loggedInUser ?
                <Link to="/profile" onClick={(e) => { if (busy) e.preventDefault() }} aria-disabled={busy || undefined} aria-label="Your profile" className="p-1.5 rounded-full">
                    <Avatar src={pfp} name={loggedInUser.name} size={32} />
                </Link>
                : signingIn ?
                <span className="w-11" aria-hidden="true" />
                :
                <button type="button" onClick={() => openLogin('login')} className="ui-btn ui-btn-ghost ui-btn-sm">Log in</button>
            }
        </header>
    )
}

export default Header
