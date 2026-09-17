import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigError } from './supabase.js'

export const TOURNAMENT_LABELS = { none: 'Ninguno', entrada: 'Entrada', recompra: 'Recompra', addon: 'Add-On', recompra_addon: 'Recompra y Add-On', entrada_addon: 'Entrada y Add-On' }
export const PAY_METHODS_IN = ['Efectivo', 'Transferencia', 'Adeudo', 'Cash Back', 'Promoción']
export const PAY_METHODS_OUT = ['Efectivo', 'Transferencia', 'Adeudo', 'Jackpot']
export const fmtMoney = (n) => (Number(n) || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const dateKey = (iso) => new Date(iso).toISOString().slice(0, 10)
const emptySession = () => ({ id: null, ticketCounter: 1, tournamentTag: 'none', movements: [], rake: [] })
const mapMovement = (m) => ({ ...m, ticketLabel: m.ticket_label, nameKey: m.name_key, tournamentTag: m.tournament_tag, at: m.created_at })
const mapRake = (r) => ({ ...r, at: r.created_at })

export function usePokerStore(uid) {
  const [clubName, setClubNameState] = useState('')
  const [session, setSession] = useState(emptySession)
  const [archive, setArchive] = useState([])
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    if (!supabase || !uid) return
    let { data: active, error: err } = await supabase.from('poker_sessions').select('*').is('archived_at', null).maybeSingle()
    if (!active && !err) ({ data: active, error: err } = await supabase.from('poker_sessions').insert({ user_id: uid }).select().single())
    if (err || !active) { setError(err?.message || 'No se pudo abrir la sesión.'); return }
    const [movements, rake, archived] = await Promise.all([
      supabase.from('poker_movements').select('*').eq('session_id', active.id).order('created_at', { ascending: false }),
      supabase.from('poker_rake').select('*').eq('session_id', active.id).order('created_at', { ascending: false }),
      supabase.from('poker_sessions').select('id, archived_at, poker_movements(*), poker_rake(*)').not('archived_at', 'is', null).order('archived_at', { ascending: false }),
    ])
    if (movements.error || rake.error || archived.error) { setError(movements.error?.message || rake.error?.message || archived.error?.message); return }
    setError(''); setClubNameState(active.club_name || '')
    setSession({ id: active.id, ticketCounter: active.ticket_counter, tournamentTag: active.tournament_tag, movements: movements.data.map(mapMovement), rake: rake.data.map(mapRake) })
    setArchive(archived.data)
  }, [uid])

  useEffect(() => { if (uid) loadData(); else { setSession(emptySession()); setArchive([]) } }, [uid, loadData])
  const saveSession = useCallback((changes) => supabase ? supabase.from('poker_sessions').update(changes).eq('id', session.id) : Promise.resolve({ error: new Error(supabaseConfigError) }), [session.id])
  const setClubName = useCallback(async (name) => { setClubNameState(name); const { error: e } = await saveSession({ club_name: name }); if (e) setError(e.message) }, [saveSession])
  const setTournamentTag = useCallback(async (tag) => { setSession((s) => ({ ...s, tournamentTag: tag })); const { error: e } = await saveSession({ tournament_tag: tag }); if (e) setError(e.message) }, [saveSession])
  const addMovement = useCallback(async ({ name, amount, method, kind }) => {
    const clean = name.trim(), value = Number(amount), nameKey = clean.toLowerCase()
    if (!clean) return { ok: false, error: 'Escribe un nombre.' }
    if (!Number.isFinite(value) || value <= 0) return { ok: false, error: 'La cantidad debe ser positiva.' }
    if (kind === 'salida' && !session.movements.some((m) => m.nameKey === nameKey)) return { ok: false, error: 'Miembro no ingresado. No se puede realizar el retiro.' }
    const ticket = session.ticketCounter, ticketLabel = session.tournamentTag === 'none' ? `${ticket}` : `${ticket} - ${TOURNAMENT_LABELS[session.tournamentTag]}`
    const { data, error: e } = await supabase.from('poker_movements').insert({ session_id: session.id, user_id: uid, ticket, ticket_label: ticketLabel, name: clean, name_key: nameKey, amount: value, kind, method, tournament_tag: session.tournamentTag }).select().single()
    if (e) return { ok: false, error: e.message }
    const { error: ticketError } = await saveSession({ ticket_counter: ticket + 1 }); if (ticketError) return { ok: false, error: ticketError.message }
    const movement = mapMovement(data); setSession((s) => ({ ...s, ticketCounter: ticket + 1, movements: [movement, ...s.movements] })); return { ok: true, movement }
  }, [session, uid, saveSession])
  const addEntry = useCallback((data) => addMovement({ ...data, kind: 'entrada' }), [addMovement])
  const addExit = useCallback((data) => addMovement({ ...data, kind: 'salida' }), [addMovement])
  const addRake = useCallback(async (amount) => { const value = Number(amount); if (!Number.isFinite(value) || value <= 0) return { ok:false, error:'La cantidad debe ser positiva.' }; const { data, error: e } = await supabase.from('poker_rake').insert({ session_id:session.id, user_id:uid, amount:value }).select().single(); if (e) return { ok:false,error:e.message }; setSession((s)=>({ ...s,rake:[mapRake(data),...s.rake] })); return { ok:true } }, [session.id, uid])
  const removeRake = useCallback(async (id) => { const { error: e } = await supabase.from('poker_rake').delete().eq('id', id); if (e) return setError(e.message); setSession((s) => ({ ...s, rake:s.rake.filter((r) => r.id !== id) })) }, [])
  const totals = useMemo(() => { const sum = (kind) => session.movements.filter((m) => m.kind === kind).reduce((n,m) => n + Number(m.amount), 0); const ingreso=sum('entrada'), salida=sum('salida'); return { ingreso, salida, neto:ingreso-salida, rakeTotal:session.rake.reduce((n,r)=>n+Number(r.amount),0) } }, [session])
  const members = useMemo(() => new Map(session.movements.map((m) => [m.nameKey,m.name])), [session.movements])
  const summaryByMember = useMemo(() => {
    const data = new Map()
    session.movements.forEach((movement) => {
      const row = data.get(movement.nameKey) || { name: movement.name, ingreso: 0, salida: 0, adeudo: 0 }
      if (movement.kind === 'entrada') {
        row.ingreso += Number(movement.amount)
        if (movement.method === 'Adeudo') row.adeudo += Number(movement.amount)
      }
      else row.salida += Number(movement.amount)
      data.set(movement.nameKey, row)
    })
    return [...data.values()].map((row) => ({ ...row, neto: row.ingreso - row.salida }))
  }, [session.movements])
  const archiveSession = useCallback(async () => { const { error: e } = await saveSession({ archived_at:new Date().toISOString() }); if(e) return {ok:false,error:e.message}; await loadData(); return {ok:true} }, [saveSession,loadData])
  const archivedDayKeys = useMemo(() => new Set(archive.flatMap((s)=>[...(s.poker_movements||[]),...(s.poker_rake||[])].map((x)=>dateKey(x.created_at)))), [archive])
  const getDayReport = useCallback((day) => { const items=archive.flatMap((s)=>[...(s.poker_movements||[]).map(mapMovement),...(s.poker_rake||[]).map(mapRake)]).filter((x)=>dateKey(x.at)===day).map((x)=>x.name?{...x,type:x.kind==='entrada'?'Ingreso':'Salida'}:{...x,name:'Registro',kind:'registro',method:'-',type:'Registro'}).sort((a,b)=>new Date(b.at)-new Date(a.at)); const sum=(kind)=>items.filter((x)=>x.kind===kind).reduce((n,x)=>n+Number(x.amount),0), ingresos=sum('entrada'),salidas=sum('salida'),registro=sum('registro'); return {items,ingresos,salidas,registro,neto:ingresos-salidas} }, [archive])
  return { clubName,setClubName,session,members,totals,summaryByMember,setTournamentTag,addEntry,addExit,addRake,removeRake,archiveSession,archivedDayKeys,getDayReport,error }
}
