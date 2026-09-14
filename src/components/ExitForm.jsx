import { useState } from 'react'
import { Card, Field, TextInput, Select, Button } from './ui.jsx'
import { PAY_METHODS_OUT } from '../lib/store.js'

export default function ExitForm({ addExit, ticketCounter, onSuccess }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Efectivo')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    const res = await addExit({ name, amount, method })
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
        <span className="grid h-8 w-8 place-items-center rounded-full bg-salida-bg text-salida text-[17px] font-semibold">–</span>
        <div>
          <h2 className="font-display text-[18px] font-medium leading-tight">Registrar salida</h2>
          <p className="text-[12.5px] text-ink/50">Cash out de un jugador en mesa</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Nombre" error={error}>
          <TextInput
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError('') }}
            placeholder="Escribe el nombre tal como ingresó"
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
            <TextInput value={`${ticketCounter}`} disabled className="bg-ink/5 num text-ink/60" />
          </Field>
        </div>

        <Field label="Método de pago">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAY_METHODS_OUT.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </Field>

        <Button type="submit" variant="salida" className="w-full">
          Registrar salida
        </Button>
      </form>
    </Card>
  )
}
