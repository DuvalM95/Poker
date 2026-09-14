import { IconButton } from './ui.jsx'
import CardSuitsBackground from './CardSuitsBackground.jsx'

function SpadeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2C9.2 6 4 10.4 4 14.3a4 4 0 0 0 7.1 2.5c-.3 2.1-1.1 3.4-2.3 3.9h6.4c-1.2-.5-2-1.8-2.3-3.9a4 4 0 0 0 7.1-2.5c0-3.9-5.2-8.3-8-12.1Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 8.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5M10 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3M10 12h11m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-paper/40 group-focus-within:text-brass-light">
      <path
        d="M4 20l1-4.2L15.6 5.2a1.5 1.5 0 0 1 2.1 0l1.1 1.1a1.5 1.5 0 0 1 0 2.1L8.2 19l-4.2 1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Header({ clubName, onClubNameChange, view, onToggleView, netoNow, userEmail, onSignOut }) {
  return (
    <header className="relative overflow-hidden bg-felt text-paper">
      <CardSuitsBackground count={14} seed={7} minSize={14} maxSize={30} minOpacity={0.06} maxOpacity={0.14} />

      <div className="relative mx-auto flex max-w-[1180px] items-center gap-4 px-5 py-4 sm:px-8">
        <div className="text-brass-light shrink-0">
          <SpadeIcon />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[21px] font-semibold tracking-tight text-paper leading-none">
            PokerTransfer
          </h1>

          <label className="group mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md border border-dashed border-paper/20 bg-paper/[0.05] px-2 py-0.5 transition hover:border-brass/50 hover:bg-paper/[0.09] focus-within:border-brass focus-within:bg-paper/[0.09]">
            <span className="text-[11px] text-paper/40 shrink-0">Club:</span>
            <input
              value={clubName}
              onChange={(e) => onClubNameChange(e.target.value)}
              placeholder="Sin nombre"
              className="min-w-0 flex-1 bg-transparent text-[12.5px] font-medium text-paper/85 placeholder:text-paper/35 outline-none"
            />
            <PencilIcon />
          </label>
        </div>

        {view === 'main' && (
          <div className="hidden sm:block text-right mr-1">
            <p className="text-[11.5px] uppercase tracking-wide text-paper/40">Flujo neto</p>
            <p className={`num text-[17px] font-medium ${netoNow >= 0 ? 'text-entrada' : 'text-salida'}`}>
              ${netoNow.toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <IconButton active={view === 'history'} onClick={() => onToggleView('history')} title="Ver sesiones archivadas">
            <CalendarIcon />
          </IconButton>
          <IconButton active={view === 'archive'} onClick={() => onToggleView('archive')} title="Archivar y limpiar sesión">
            <ArchiveIcon />
          </IconButton>
          <IconButton onClick={onSignOut} title="Cerrar sesión" aria-label="Cerrar sesión" className="md:hidden">
            <SignOutIcon />
          </IconButton>
          <div className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-paper/15">
            <span className="text-[12.5px] text-paper/50 max-w-[140px] truncate">{userEmail}</span>
            <button onClick={onSignOut} className="text-[12.5px] font-medium text-brass-light hover:text-brass-light/80">
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
