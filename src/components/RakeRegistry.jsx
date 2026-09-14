import { useState } from 'react'
import { Card, TextInput, Button } from './ui.jsx'
import { fmtMoney } from '../lib/store.js'

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function RakeRegistry({ rake, addRake, removeRake }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const total = rake.reduce((a, r) => a + r.amount, 0)

  // flag entries whose gap to the previous one looks off (possible tampering)
  const sorted = [...rake].sort((a, b) => new Date(a.at) - new Date(b.at))
  const gaps = new Map()
  for (let i = 1; i < sorted.length; i++) {
    const diffMin = (new Date(sorted[i].at) - new Date(sorted[i - 1].at)) / 60000
    if (diffMin < 2 || diffMin > 90) gaps.set(sorted[i].id, true)
  }

  async function submit(e) {
    e.preventDefault()
    const res = await addRake(amount)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setError('')
    setAmount('')
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brass/15 text-brass-dim text-[15px] font-semibold">$</span>
        <div>
          <h2 className="font-display text-[18px] font-medium leading-tight">Registro</h2>
          <p className="text-[12.5px] text-ink/50">Total registrado por los crupieres</p>
        </div>
      </div>

      <form onSubmit={submit} className="flex gap-2 mb-3">
        <TextInput
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantidad de registro"
        />
        <Button type="submit" variant="brass">+</Button>
      </form>
      {error && <p className="text-[13px] text-salida mb-2">{error}</p>}

      <div className="max-h-40 overflow-auto rounded-lg border border-ink/8">
        {rake.length === 0 ? (
          <p className="text-center text-ink/40 py-6 text-[13px]">Sin registros aún.</p>
        ) : (
          <table className="w-full text-[13px]">
            <tbody>
              {rake.map((r) => (
                <tr key={r.id} className="border-b last:border-0 border-ink/6">
                  <td className="px-3 py-2 text-ink/55 num text-[12px]">
                    {new Date(r.at).toLocaleTimeString('es-EC')}
                    {gaps.get(r.id) && (
                      <span title="Intervalo inusual respecto al registro anterior: revisar cambio de crupier" className="ml-1.5 text-brass-dim">⚠</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right num font-medium">${fmtMoney(r.amount)}</td>
                  <td className="px-2 py-2 text-center w-8">
                    <button onClick={() => removeRake(r.id)} className="grid h-6 w-6 place-items-center rounded text-salida/60 hover:bg-salida-bg hover:text-salida mx-auto">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between mt-3 px-1 text-[14px]">
        <span className="font-medium text-ink/70">Total Registro</span>
        <span className="num font-semibold">${fmtMoney(total)}</span>
      </div>
    </Card>
  )
}
