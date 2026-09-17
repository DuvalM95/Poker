import { Button, Pill } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

export default function PlayerMovementsModal({ playerName, movements, onClose }) {
  if (!playerName) return null

  const playerMovements = movements.filter((movement) => movement.nameKey === playerName.toLowerCase())
  const ingreso = playerMovements
    .filter((movement) => movement.kind === 'entrada')
    .reduce((total, movement) => total + Number(movement.amount), 0)
  const salida = playerMovements
    .filter((movement) => movement.kind === 'salida')
    .reduce((total, movement) => total + Number(movement.amount), 0)
  const adeudo = playerMovements
    .filter((movement) => movement.kind === 'entrada' && movement.method === 'Adeudo')
    .reduce((total, movement) => total + Number(movement.amount), 0)
  const neto = ingreso - salida

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-lift" role="dialog" aria-modal="true" aria-labelledby="player-movements-title">
        <div className="flex items-start justify-between gap-4 border-b border-ink/8 px-5 py-4">
          <div>
            <p className="text-[12px] text-ink/50">Movimientos de jugador</p>
            <h3 id="player-movements-title" className="font-display text-[19px] font-medium leading-tight">{playerName}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalle" className="px-1 text-[22px] leading-none text-ink/40 hover:text-ink">×</button>
        </div>

        <div className="max-h-[55vh] overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-paper-dim text-[11.5px] text-ink/55">
              <tr>
                <th className="px-5 py-2.5 text-left font-medium">Tipo</th>
                <th className="px-3 py-2.5 text-left font-medium">Método</th>
                <th className="px-3 py-2.5 text-left font-medium">Hora / ticket</th>
                <th className="px-5 py-2.5 text-right font-medium">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {playerMovements.map((movement) => (
                <tr key={movement.id} className="border-t border-ink/6">
                  <td className="px-5 py-3"><Pill tone={movement.kind === 'entrada' ? 'entrada' : 'salida'}>{movement.kind === 'entrada' ? 'Ingreso' : 'Salida'}</Pill></td>
                  <td className="px-3 py-3 text-ink/70">{movement.method}</td>
                  <td className="px-3 py-3 text-[12px] text-ink/55">
                    <div>{new Date(movement.at).toLocaleTimeString('es-EC')}</div>
                    <div>Ticket #{movement.ticketLabel || movement.ticket}</div>
                  </td>
                  <td className={`px-5 py-3 text-right font-medium num ${movement.kind === 'entrada' ? 'text-entrada' : 'text-salida'}`}>
                    {movement.kind === 'entrada' ? '+' : '-'}${fmtMoney(movement.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-1.5 border-t border-ink/8 bg-paper-dim px-5 py-3">
          <div className="flex justify-between text-[13px]"><span className="text-ink/60">Ingresos</span><span className="num text-entrada">${fmtMoney(ingreso)}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-ink/60">Salidas</span><span className="num text-salida">${fmtMoney(salida)}</span></div>
          {adeudo > 0 && <div className="flex justify-between text-[13px]"><span className="font-medium text-salida">Adeudo pendiente</span><span className="num font-medium text-salida">${fmtMoney(adeudo)}</span></div>}
          <div className="flex justify-between border-t border-ink/10 pt-1 text-[15px]"><span className="font-semibold">Balance neto</span><span className={`num font-semibold ${neto >= 0 ? 'text-entrada' : 'text-salida'}`}>{neto >= 0 ? '+' : ''}${fmtMoney(neto)}</span></div>
        </div>
        <div className="flex justify-end border-t border-ink/8 px-5 py-3"><Button variant="ghost" onClick={onClose}>Cerrar</Button></div>
      </section>
    </div>
  )
}
