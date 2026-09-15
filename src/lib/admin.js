import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

export function useAdmin(userId) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function checkAccess() {
      if (!supabase || !userId) {
        if (active) { setIsAdmin(false); setLoading(false) }
        return
      }
      const { data } = await supabase.from('poker_admins').select('user_id').eq('user_id', userId).maybeSingle()
      if (active) { setIsAdmin(Boolean(data)); setLoading(false) }
    }

    setLoading(true)
    checkAccess()
    return () => { active = false }
  }, [userId])

  return { isAdmin, loading }
}
