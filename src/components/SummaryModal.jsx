import { Card, Button } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

export default function SummaryModal({ open, onClose, summaryByMember, totals, clubName }) {
  if (!open) return null

  const neto = totals.neto
  const netoConRegistro = neto - totals.rakeTotal

  return (
    <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-ink/8">
          <div>
            <h2 className="font-display text-[20px] font-medium">Resumen por miembro</h2>
            <p className="text-[12.5px] text-ink/50">Desglose de ingresos y salidas de {clubName || 'la sesión'}</p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-[20px] leading-none px-1">×</button>
        </div>

        <div className="overflow-auto px-6 py-4" data-print-area>
          <table className="w-full text-[13.5px]">
            <thead className="text-ink/50 text-[11.5px]">
              <tr>
                <th className="text-left font-medium py-2">Nombre</th>
                <th className="text-right font-medium py-2">Ingreso</th>
                <th className="text-right font-medium py-2">Salida</th>
                <th className="text-right font-medium py-2">Neto</th>
              </tr>
            </thead>
            <tbody>
              {summaryByMember.map((r) => (
                <tr key={r.name} className="border-t border-ink/6">
                  <td className="py-2 font-medium">{r.name}</td>
                  <td className="py-2 text-right num">${fmtMoney(r.ingreso)}</td>
                  <td className="py-2 text-right num">${fmtMoney(r.salida)}</td>
                  <td className={`py-2 text-right num font-medium ${r.neto >= 0 ? 'text-entrada' : 'text-salida'}`}>
                    ${fmtMoney(r.neto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1.5 rounded-xl bg-paper-dim px-4 py-3">
            <div className="flex justify-between text-[13.5px]">
              <span className="font-medium text-ink/70">Totales</span>
              <span className="num font-semibold">${fmtMoney(neto)}</span>
            </div>
            <div className="flex justify-between text-[13.5px]">
              <span className="text-ink/60">Registro</span>
              <span className="num text-salida">-${fmtMoney(totals.rakeTotal)}</span>
            </div>
            <div className="flex justify-between text-[15px] pt-1 border-t border-ink/10">
              <span className="font-semibold">Neto con registro</span>
              <span className="num font-semibold">${fmtMoney(netoConRegistro)}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-ink/8 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          <Button variant="brass" onClick={() => window.print()}>Imprimir resultados</Button>
        </div>
      </Card>
    </div>
  )
}
