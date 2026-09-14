import { useState } from 'react'
import { Card, Field, TextInput, Select, Button } from './ui.jsx'
import { PAY_METHODS_IN, TOURNAMENT_LABELS } from '../lib/store.js'

export default function EntryForm({ addEntry, ticketCounter, tournamentTag, onSuccess }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Efectivo')
  const [error, setError] = useState('')

  const ticketLabel =
    tournamentTag === 'none' ? `${ticketCounter}` : `${ticketCounter} - ${TOURNAMENT_LABELS[tournamentTag]}`

  async function submit(e) {
    e.preventDefault()
    const res = await addEntry({ name, amount, method })
    if (!res.ok) {
      setError(res.error)
      return
    }
    setError('')
    setName('')
    setAmount('')
    onSuccess?.(res.movement)
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-entrada-bg text-entrada text-[17px] font-semibold">+</span>
        <div>
          <h2 className="font-display text-[18px] font-medium leading-tight">Ingresar miembro</h2>
          <p className="text-[12.5px] text-ink/50">Añade un jugador y sus fichas de entrada</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Nombre">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="p.ej. Molina"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cantidad (USD)">
            <TextInput
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Ticket">
            <TextInput value={ticketLabel} disabled className="bg-ink/5 num text-ink/60" />
          </Field>
        </div>

        <Field label="Método de pago">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAY_METHODS_IN.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </Field>

        {error && <p className="text-[13px] text-salida">{error}</p>}

        <Button type="submit" variant="entrada" className="w-full">
          Ingresar miembro
        </Button>
      </form>
    </Card>
  )
}
