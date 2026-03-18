import { useState } from 'react'

const mockSongs = [
  { id: 1, artist: 'Ákos', title: 'Születésem', city: 'Budapest', duration: '3:42', index: '01' },
  { id: 2, artist: 'Quimby', title: 'Isten állatkertje', city: 'Szeged', duration: '4:17', index: '02' },
  { id: 3, artist: 'Omega', title: 'Gyöngyhajú lány', city: 'Budapest', duration: '5:05', index: '03' },
  { id: 4, artist: 'Tankcsapda', title: 'Örökké élni', city: 'Debrecen', duration: '3:58', index: '04' },
  { id: 5, artist: 'Kispál', title: 'Fehér', city: 'Pécs', duration: '4:30', index: '05' },
]

function SongRow({ song, isPlaying, onPlay }: {
  song: typeof mockSongs[0],
  isPlaying: boolean,
  onPlay: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto auto',
        alignItems: 'center',
        gap: '20px',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: hovered ? 'var(--surface)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onClick={onPlay}
    >
      {/* Index / Play indicator */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: isPlaying ? 'var(--accent)' : 'var(--text-dim)',
        textAlign: 'right',
        letterSpacing: '0.05em',
        transition: 'color 0.15s',
      }}>
        {isPlaying ? '▶' : song.index}
      </span>

      {/* Title + artist */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 400,
          color: isPlaying ? 'var(--accent)' : 'var(--text)',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          transition: 'color 0.15s',
        }}>
          {song.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginTop: '2px',
        }}>
          {song.artist} — {song.city}
        </div>
      </div>

      {/* City tag */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.12em',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-2)',
        padding: '3px 8px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.15s',
      }}>
        {song.city.toUpperCase()}
      </span>

      {/* Duration */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        {song.duration}
      </span>
    </div>
  )
}

export default function FeedPage() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'discover' | 'following'>('discover')

  return (
    <div style={{ minHeight: '100vh', paddingTop: '56px' }}>

      {/* Hero */}
      <div style={{
        padding: '80px 24px 56px',
        maxWidth: '1100px',
        margin: '0 auto',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          opacity: 0.4,
        }} />

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'var(--accent)',
          marginBottom: '20px',
          textTransform: 'uppercase',
        }}>
          Magyar Zenei Közösség — Est. 2024
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 7vw, 88px)',
          fontWeight: 300,
          lineHeight: 0.92,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          marginBottom: '24px',
        }}>
          Discover<br />
          <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Hungarian</span><br />
          Music
        </h1>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
          maxWidth: '320px',
          lineHeight: 1.8,
        }}>
          Artists, songs, concerts — filtered by city. Preview any track in 30 seconds.
        </p>
      </div>

      {/* Feed section */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid var(--border)',
          marginBottom: '0',
        }}>
          {(['discover', 'following'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '16px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '1px solid var(--accent)' : '1px solid transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Song list */}
        <div>
          {mockSongs.map(song => (
            <SongRow
              key={song.id}
              song={song}
              isPlaying={playingId === song.id}
              onPlay={() => setPlayingId(playingId === song.id ? null : song.id)}
            />
          ))}
        </div>

        {/* Footer line */}
        <div style={{
          padding: '32px 0',
          borderTop: '1px solid var(--border)',
          marginTop: '0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            HANGZÁS — HUNGARIAN MUSIC COMMUNITY
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            {mockSongs.length} TRACKS
          </span>
        </div>
      </div>
    </div>
  )
}
