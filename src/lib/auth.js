import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigError } from './supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Purge the retired local database, including mock-auth password digests.
    // Data is now read exclusively from Supabase.
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index)
      if (key?.startsWith('poker.')) localStorage.removeItem(key)
    }
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const signUp = useCallback(async (email, password) => {
    if (!supabase) return { ok: false, error: supabaseConfigError }
    const { error } = await supabase.auth.signUp({ email: email.trim(), password })
    return error ? { ok: false, error: error.message } : { ok: true }
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { ok: false, error: supabaseConfigError }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? { ok: false, error: error.message } : { ok: true }
  }, [])

  const signOut = useCallback(async () => { if (supabase) await supabase.auth.signOut() }, [])
  return { user, loading, signUp, signIn, signOut }
}
