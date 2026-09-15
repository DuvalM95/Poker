export function Field({ label, children, error }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink/70 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-[12.5px] text-salida mt-1.5">{error}</span>}
    </label>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink/35 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/25 ' +
        (props.className || '')
      }
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/25"
    >
      {children}
    </select>
  )
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100'
  const variants = {
    primary: 'bg-felt text-paper hover:bg-felt-lighter shadow-card',
    entrada: 'bg-entrada text-white hover:brightness-110 shadow-card',
    salida: 'bg-salida text-white hover:brightness-110 shadow-card',
    brass: 'bg-brass text-felt hover:bg-brass-light shadow-card',
    ghost: 'bg-transparent text-ink/70 hover:bg-ink/5',
    outline: 'border border-ink/20 text-ink hover:bg-ink/5',
  }
  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function IconButton({ children, active, className = '', ...props }) {
  return (
    <button
      {...props}
      className={
        'grid h-10 w-10 place-items-center rounded-lg border transition ' +
        (active
          ? 'border-brass bg-brass/15 text-brass-light'
          : 'border-paper/15 text-paper/70 hover:border-paper/30 hover:text-paper') +
        ' ' + className
      }
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-paper shadow-card ${className}`}>{children}</div>
  )
}

export function Pill({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-ink/8 text-ink/70',
    entrada: 'bg-entrada-bg text-entrada',
    salida: 'bg-salida-bg text-salida',
    brass: 'bg-brass/15 text-brass-dim',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-3 text-[14px] font-medium shadow-lift ' +
        (toast.type === 'error' ? 'bg-salida text-white' : 'bg-felt text-paper')
      }
    >
      {toast.message}
    </div>
  )
}
