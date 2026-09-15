import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { Card, Field, TextInput, Button } from './ui.jsx'

export default function AdminDashboard({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')

    setLoading(true)
    const { data, error: invokeError } = await supabase.functions.invoke('create-poker-user', {
      body: { email: email.trim(), password },
    })
    setLoading(false)
    if (invokeError || data?.error) return setError(data?.error || invokeError.message)

    setMessage(`Cuenta creada para ${data.user.email}. Ya puede iniciar sesión.`)
    setEmail('')
    setPassword('')
    setConfirm('')
  }

  return (
    <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-brass-dim">Acceso restringido</p>
          <h2 className="font-display text-[25px] font-medium">Administración</h2>
          <p className="mt-1 text-[13.5px] text-ink/55">Crea las cuentas de acceso para los miembros autorizados.</p>
        </div>
        <Button variant="outline" onClick={onBack}>Ir al panel normal</Button>
      </div>

      <Card className="p-5 sm:p-6">
        <h3 className="font-display text-[19px] font-medium">Agregar nuevo usuario</h3>
        <p className="mt-1 text-[13px] text-ink/50">La cuenta queda confirmada y lista para iniciar sesión.</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Correo del usuario">
            <TextInput type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="usuario@correo.com" />
          </Field>
          <Field label="Contraseña temporal">
            <TextInput type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" />
          </Field>
          <Field label="Confirmar contraseña">
            <TextInput type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Repite la contraseña" />
          </Field>

          {error && <p className="rounded-lg bg-salida-bg px-3 py-2 text-[13px] text-salida">{error}</p>}
          {message && <p className="rounded-lg bg-entrada-bg px-3 py-2 text-[13px] text-entrada">{message}</p>}

          <Button type="submit" variant="brass" disabled={loading}>{loading ? 'Creando cuenta…' : 'Crear usuario'}</Button>
        </form>
      </Card>
    </main>
  )
}
