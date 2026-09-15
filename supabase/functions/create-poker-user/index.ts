import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) throw new Error('No autorizado.')

    const service = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    const { data: userData, error: userError } = await service.auth.getUser(token)
    if (userError || !userData.user) throw new Error('Sesión inválida.')

    const { data: admin } = await service.from('poker_admins').select('user_id').eq('user_id', userData.user.id).maybeSingle()
    if (!admin) return json({ error: 'No tienes permisos de administrador.' }, 403)

    const { email, password } = await request.json()
    if (typeof email !== 'string' || !email.includes('@')) return json({ error: 'Correo inválido.' }, 400)
    if (typeof password !== 'string' || password.length < 8) return json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, 400)

    const { data, error } = await service.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
    })
    if (error) return json({ error: error.message }, 400)
    return json({ user: { id: data.user.id, email: data.user.email } })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'No se pudo crear la cuenta.' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
