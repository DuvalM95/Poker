import { fmtMoney } from '../lib/store.js'

export default function TicketReceipt({ movement, clubName }) {
  if (!movement) return null
  const d = new Date(movement.at)
  return (
    <div className="w-[300px] mx-auto p-6 font-mono text-ink bg-white">
      <p className="text-center font-display text-[17px] font-semibold mb-1">
        {clubName || 'Recibo'}
      </p>
      <p className="text-center text-[13px] mb-4">{movement.kind === 'entrada' ? 'Ingreso' : 'Salida'}</p>
      <div className="border-t border-dashed border-ink/40 my-3" />
      <div className="space-y-1.5 text-[13px]">
        <p>Ticket: #{movement.ticketLabel}</p>
        <p>Nombre: {movement.name}</p>
        <p>Método de pago: {movement.method}</p>
        <p>Fecha: {d.toLocaleDateString('es-EC')}</p>
        <p>Hora: {d.toLocaleTimeString('es-EC')}</p>
      </div>
      <div className="border-t border-dashed border-ink/40 my-3" />
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Cantidad:</span>
        <span className="text-[18px] font-semibold">${fmtMoney(movement.amount)}</span>
      </div>
      <div className="border-t border-dashed border-ink/40 my-4" />
      <p className="text-center text-[11px] text-ink/50">Gracias</p>
    </div>
  )
}
