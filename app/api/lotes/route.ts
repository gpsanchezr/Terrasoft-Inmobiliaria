import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.from('lotes').select('*')

    if (error) {
      console.error('Error de Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API lotes enviando:', data?.length || 0, 'registros')
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Error interno:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
