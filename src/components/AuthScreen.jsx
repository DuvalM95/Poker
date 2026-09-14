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

export default function AuthScreen({ signIn, signUp }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (mode === 'signup' && password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)

    if (!res.ok) {
      setError(res.error || 'No se logró crear la cuenta. Intenta de nuevo.')
      return
    }

    if (mode === 'signup') {
      setSuccess('Cuenta creada correctamente. Ahora inicia sesión.')
      setMode('signin')
      setPassword('')
      setConfirm('')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-felt flex items-center justify-center px-4 py-10">
      <CardSuitsBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center text-paper mb-7">
          <div className="text-brass-light mb-2.5"><SpadeIcon /></div>
          <h1 className="font-display text-[22px] font-medium tracking-tight">PokerTransfer</h1>
          <p className="text-[13px] text-paper/50">Gestión de movimientos de mesa</p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-2 rounded-lg bg-ink/6 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
              className={`rounded-md py-2 text-[14px] font-medium transition ${mode === 'signin' ? 'bg-white shadow-card text-ink' : 'text-ink/50'}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
              className={`rounded-md py-2 text-[14px] font-medium transition ${mode === 'signup' ? 'bg-white shadow-card text-ink' : 'text-ink/50'}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <Field label="Correo">
              <TextInput
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
            </Field>
            <Field label="Contraseña">
              <TextInput
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            {mode === 'signup' && (
              <Field label="Confirmar contraseña">
                <TextInput
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
            )}

            {error && <p className="text-[13px] text-salida">{error}</p>}
            {success && <p className="text-[13px] text-entrada">{success}</p>}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Un momento…' : mode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-[12px] text-paper/35 mt-5">
          Tus movimientos quedan asociados a esta cuenta.
        </p>
      </div>
    </div>
  )
}