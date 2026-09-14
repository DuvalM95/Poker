import { createClient } from '@supabase/supabase-js'

// Vite reads `.env` automatically. Keep only one `.env` in the project root.
// Restart the dev server after creating or changing it.
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = (
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
	import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim()

// Never put a service_role key in a VITE_ variable.
export const supabase = url && key ? createClient(url, key) : null
export const supabaseConfigError = supabase
	? null
	: 'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env'
