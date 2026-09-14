import { Card, Button } from './ui.jsx'

export default function ArchiveModal({ open, onClose, onConfirm }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="font-display text-[19px] font-medium mb-2">¿Finalizar y archivar la sesión?</h2>
        <p className="text-[14px] text-ink/60 leading-relaxed mb-6">
          Esto guardará un reporte final de la sesión actual y limpiará todos los movimientos y
          registros para empezar de nuevo. Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={onConfirm}>Continuar</Button>
        </div>
      </Card>
    </div>
  )
}
