import { Button } from './ui.jsx'
import TicketReceipt from './TicketReceipt.jsx'

export default function TicketModal({ movement, clubName, onClose }) {
  if (!movement) return null
  return (
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lift overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink/8">
          <h3 className="font-display text-[16px] font-medium">Ticket de movimiento</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-[20px] leading-none px-1">×</button>
        </div>
        <div data-print-area>
          <TicketReceipt movement={movement} clubName={clubName} />
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-ink/8">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          <Button variant="brass" onClick={() => window.print()}>Imprimir</Button>
        </div>
      </div>
    </div>
  )
}
