import { Select } from './ui.jsx'
import { TOURNAMENT_LABELS } from '../lib/store.js'

const TAG_OPTIONS = Object.entries(TOURNAMENT_LABELS).filter(([key]) => key !== 'none')

export default function TournamentOptions({ tournamentTag, onChange }) {
  const isTournament = tournamentTag !== 'none'

  function selectMode(mode) {
    if (mode === 'normal') {
      onChange('none')
    } else if (!isTournament) {
      // switching into tournament mode: default to a real tag, not "Ninguno"
      onChange('entrada')
    }
  }

  return (
    <div className="rounded-2xl bg-felt p-2 shadow-card">
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => selectMode('normal')}
          className={
            'rounded-xl py-2.5 text-[14px] font-semibold transition ' +
            (!isTournament ? 'bg-paper text-felt shadow-card' : 'text-paper/55 hover:text-paper')
          }
        >
          Normal
        </button>
        <button
          type="button"
          onClick={() => selectMode('torneo')}
          className={
            'rounded-xl py-2.5 text-[14px] font-semibold transition ' +
            (isTournament ? 'bg-brass text-felt shadow-card' : 'text-paper/55 hover:text-paper')
          }
        >
          Torneo
        </button>
      </div>

      {isTournament && (
        <div className="px-1 pt-3 pb-1">
          <label className="block text-[12px] font-medium text-paper/55 mb-1.5">
            Etiqueta del ticket
          </label>
          <Select value={tournamentTag} onChange={(e) => onChange(e.target.value)}>
            {TAG_OPTIONS.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <p className="text-[12px] text-paper/45 mt-2 leading-relaxed">
            Cada ingreso y salida que registres ahora llevará esta etiqueta en su ticket.
          </p>
        </div>
      )}
    </div>
  )
}