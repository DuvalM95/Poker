import { useState } from 'react'
import { Card, Field, TextInput, Button } from './ui.jsx'
import CardSuitsBackground from './CardSuitsBackground.jsx'

function SpadeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2C9.2 6 4 10.4 4 14.3a4 4 0 0 0 7.1 2.5c-.3 2.1-1.1 3.4-2.3 3.9h6.4c-1.2-.5-2-1.8-2.3-3.9a4 4 0 0 0 7.1-2.5c0-3.9-5.2-8.3-8-12.1Z" />
    </svg>
  )
}

export default function AuthScreen({ signIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (!result.ok) setError(result.error || 'No se pudo iniciar sesión.')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-felt px-4 py-10">
      <CardSuitsBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-paper">
          <div className="mb-2.5 text-brass-light"><SpadeIcon /></div>
          <h1 className="font-display text-[22px] font-medium tracking-tight">PokerTransfer</h1>
          <p className="text-[13px] text-paper/50">Gestión de movimientos de mesa</p>
        </div>

        <Card className="p-6">
          <h2 className="font-display text-[20px] font-medium">Iniciar sesión</h2>
          <p className="mt-1 text-[13px] text-ink/50">Accede con una cuenta creada por el administrador.</p>
          <form onSubmit={submit} className="mt-5 space-y-3.5">
            <Field label="Correo">
              <TextInput type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" />
            </Field>
            <Field label="Contraseña">
              <TextInput type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
            </Field>
            {error && <p className="text-[13px] text-salida">{error}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>{loading ? 'Un momento…' : 'Iniciar sesión'}</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
