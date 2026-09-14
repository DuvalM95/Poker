import { useMemo, useState } from 'react'
import { Card, Pill, Button } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const WEEKDAYS = ['lu','ma','mi','ju','vi','sá','do']

function toKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function HistoryView({ archivedDayKeys, getDayReport, onBack }) {
  const today = new Date()
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [selected, setSelected] = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()))

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1)
    const startWeekday = (first.getDay() + 6) % 7 // Monday = 0
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [cursor])

  const report = getDayReport(selected)
  const selectedDate = new Date(selected + 'T00:00:00')

  return (
    <div className="mx-auto max-w-[1000px] px-5 sm:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[14px] text-ink/60 hover:text-ink mb-6">
        <span aria-hidden>←</span> Historial de movimientos archivados
      </button>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card className="p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))}
              className="grid h-7 w-7 place-items-center rounded-md hover:bg-ink/8 text-ink/60"
            >‹</button>
            <p className="font-display text-[15px] font-medium capitalize">{MONTHS[cursor.m]} {cursor.y}</p>
            <button
              onClick={() => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))}
              className="grid h-7 w-7 place-items-center rounded-md hover:bg-ink/8 text-ink/60"
            >›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink/40 mb-1">
            {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              if (!d) return <div key={i} />
              const key = toKey(cursor.y, cursor.m, d)
              const hasData = archivedDayKeys.has(key)
              const isSelected = key === selected
              return (
                <button
                  key={i}
                  onClick={() => setSelected(key)}
                  className={
                    'h-8 rounded-md text-[13px] transition ' +
                    (isSelected
                      ? 'bg-felt text-paper font-semibold'
                      : hasData
                      ? 'bg-ink/10 text-ink font-medium hover:bg-ink/15'
                      : 'text-ink/35 hover:bg-ink/5')
                  }
                >
                  {d}
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5">
            <div>
              <h2 className="font-display text-[19px] font-medium leading-snug">
                Movimientos para {selectedDate.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-[12.5px] text-ink/50 mt-1">Resumen de sus movimientos archivados para el día seleccionado.</p>
            </div>
            <Button variant="brass" onClick={() => window.print()} className="shrink-0 self-start">
              Imprimir
            </Button>
          </div>
          <p className="text-[12.5px] text-ink/50 mb-4">Resumen de sus movimientos archivados para el día seleccionado.</p>

          <div data-print-area>
            <div className="overflow-auto rounded-xl border border-ink/8">
              <table className="w-full text-[13.5px]">
                <thead className="bg-paper-dim text-ink/55 text-[11.5px]">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Hora</th>
                    <th className="text-left font-medium px-3 py-2">Nombre</th>
                    <th className="text-left font-medium px-3 py-2">Tipo</th>
                    <th className="text-left font-medium px-3 py-2 hidden sm:table-cell">Método</th>
                    <th className="text-right font-medium px-3 py-2">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-ink/40 py-10">Sin movimientos archivados este día.</td></tr>
                  )}
                  {report.items.map((it) => (
                    <tr key={it.id} className="border-t border-ink/6">
                      <td className="px-3 py-2 num text-ink/60 text-[12.5px]">{new Date(it.at).toLocaleTimeString('es-EC')}</td>
                      <td className="px-3 py-2 font-medium">{it.name}</td>
                      <td className="px-3 py-2">
                        <Pill tone={it.kind === 'entrada' ? 'entrada' : it.kind === 'salida' ? 'salida' : 'brass'}>{it.type}</Pill>
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell text-ink/60">{it.method}</td>
                      <td className={`px-3 py-2 text-right num font-medium ${it.kind === 'salida' || it.kind === 'registro' ? 'text-salida' : 'text-entrada'}`}>
                        {it.kind === 'entrada' ? '+' : '-'}${fmtMoney(it.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-1.5 rounded-xl bg-paper-dim px-4 py-3 max-w-sm ml-auto">
              <div className="flex justify-between text-[13.5px]">
                <span className="text-ink/60">Total ingresos archivados</span>
                <span className="num text-entrada font-medium">${fmtMoney(report.ingresos)}</span>
              </div>
              <div className="flex justify-between text-[13.5px]">
                <span className="text-ink/60">Total salidas archivadas</span>
                <span className="num text-salida font-medium">${fmtMoney(report.salidas)}</span>
              </div>
              <div className="flex justify-between text-[13.5px]">
                <span className="text-ink/60">Total registro archivado</span>
                <span className="num font-medium">${fmtMoney(report.registro)}</span>
              </div>
              <div className="flex justify-between text-[15px] pt-1 border-t border-ink/10">
                <span className="font-semibold">Flujo neto del día</span>
                <span className="num font-semibold">${fmtMoney(report.neto)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}