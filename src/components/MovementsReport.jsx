import { Card, Pill } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

function PrinterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 14h12v7H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export default function MovementsReport({ movements, totals, clubName, onPrint }) {
  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display text-[19px] font-medium leading-tight">Reporte de movimientos</h2>
          <p className="text-[12.5px] text-ink/50">Detalle de entradas y salidas del miembro</p>
        </div>
        {clubName && <Pill tone="brass">{clubName}</Pill>}
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-ink/8">
        <table className="w-full text-[13.5px]">
          <thead className="sticky top-0 bg-paper-dim text-ink/55 text-[11.5px]">
            <tr>
              <th className="text-left font-medium px-3 py-2.5">Nombre</th>
              <th className="text-left font-medium px-3 py-2.5">Método</th>
              <th className="text-left font-medium px-3 py-2.5 hidden sm:table-cell">Hora</th>
              <th className="text-right font-medium px-3 py-2.5">Cantidad</th>
              <th className="text-center font-medium px-3 py-2.5">Ticket</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-ink/40 py-10 text-[13.5px]">
                  Aún no hay transacciones.
                </td>
              </tr>
            )}
            {movements.map((m) => (
              <tr key={m.id} className="border-t border-ink/6 hover:bg-ink/[0.025]">
                <td className="px-3 py-2.5 font-medium">{m.name}</td>
                <td className="px-3 py-2.5">
                  <Pill tone={m.method === 'Adeudo' ? 'neutral' : m.kind === 'entrada' ? 'entrada' : 'salida'}>
                    {m.method}
                  </Pill>
                </td>
                <td className="px-3 py-2.5 hidden sm:table-cell text-ink/55 num text-[12.5px]">
                  {new Date(m.at).toLocaleTimeString('es-EC')}
                </td>
                <td className={`px-3 py-2.5 text-right num font-medium ${m.kind === 'entrada' ? 'text-entrada' : 'text-salida'}`}>
                  {m.kind === 'entrada' ? '+' : '-'}${fmtMoney(m.amount)}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button
                    onClick={() => onPrint(m)}
                    title="Imprimir ticket"
                    className="grid h-7 w-7 place-items-center rounded-md text-ink/45 hover:bg-ink/10 hover:text-ink mx-auto"
                  >
                    <PrinterIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-1.5 rounded-xl bg-paper-dim px-4 py-3">
        <div className="flex justify-between text-[13.5px]">
          <span className="text-ink/60">Ingreso total</span>
          <span className="num font-medium text-entrada">${fmtMoney(totals.ingreso)}</span>
        </div>
        <div className="flex justify-between text-[13.5px]">
          <span className="text-ink/60">Total de retiros</span>
          <span className="num font-medium text-salida">${fmtMoney(totals.salida)}</span>
        </div>
        <div className="flex justify-between text-[15px] pt-1 border-t border-ink/10">
          <span className="font-semibold">Flujo neto</span>
          <span className={`num font-semibold ${totals.neto >= 0 ? 'text-entrada' : 'text-salida'}`}>
            ${fmtMoney(totals.neto)}
          </span>
        </div>
      </div>
    </Card>
  )
}
