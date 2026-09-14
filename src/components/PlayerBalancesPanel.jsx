import { Card, Pill } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

export default function PlayerBalancesPanel({ summaryByMember, onSelectPlayer }) {
  const sorted = [...summaryByMember].sort((a, b) => Math.abs(b.neto) - Math.abs(a.neto))

  return (
    <Card className="p-4 flex flex-col max-h-[220px]">
      <div className="flex items-center justify-between mb-2.5 shrink-0">
        <div>
          <h3 className="font-display text-[15px] font-medium leading-tight">Balance por jugador</h3>
          <p className="text-[11.5px] text-ink/45">Se actualiza con cada movimiento</p>
        </div>
        <Pill tone="brass">En vivo</Pill>
      </div>

      <div className="overflow-auto -mx-1 px-1">
        {sorted.length === 0 ? (
          <p className="text-center text-ink/40 text-[13px] py-4">Sin jugadores aún.</p>
        ) : (
          <table className="w-full text-[13px]">
            <tbody>
              {sorted.map((r) => (
                <tr key={r.name} className="border-b last:border-0 border-ink/6 hover:bg-ink/[0.025]">
                  <td colSpan={3} className="p-0">
                    <button
                      type="button"
                      onClick={() => onSelectPlayer(r.name)}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-0 px-0 text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
                      title={`Ver movimientos de ${r.name}`}
                    >
                      <span className="py-1.5 font-medium truncate max-w-[110px]">{r.name}</span>
                      <span className="py-1.5 text-right text-ink/45 num text-[11.5px]">
                        +${fmtMoney(r.ingreso)} / -${fmtMoney(r.salida)}
                      </span>
                      <span className={`py-1.5 pl-3 text-right num font-semibold ${r.neto >= 0 ? 'text-entrada' : 'text-salida'}`}>
                        {r.neto >= 0 ? '+' : ''}${fmtMoney(r.neto)}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  )
}
