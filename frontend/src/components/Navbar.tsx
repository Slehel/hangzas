import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'FEED' },
    { to: '/concerts', label: 'CONCERTS' },
    { to: '/cities', label: 'CITIES' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(8,8,8,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '0.02em',
          }}>
            Hang<span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>zás</span>
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            HU
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: location.pathname === link.to ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (location.pathname !== link.to) (e.target as HTMLElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { if (location.pathname !== link.to) (e.target as HTMLElement).style.color = 'var(--text-muted)' }}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth */}
          <div style={{ display: 'flex', gap: '12px', marginLeft: '16px' }}>
            <Link to="/login" style={{
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              padding: '6px 12px',
              border: '1px solid var(--border-2)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--text-dim)'
              el.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border-2)'
              el.style.color = 'var(--text-muted)'
            }}>
              LOGIN
            </Link>
            <Link to="/register" style={{
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--bg)',
              background: 'var(--accent)',
              padding: '6px 12px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}>
              JOIN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
