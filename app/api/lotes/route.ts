import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const etapa = searchParams.get('etapa')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    let query = supabase
      .from('lotes')
      .select('*')
      .order('numero_lote')

    if (estado) {
      query = query.eq('estado', estado)
    }
    if (etapa && etapa !== 'Todos') {
      query = query.eq('etapa', etapa)
    }

    const { data: lotes, error } = await query

    if (error) {
      console.error('Error de Supabase lotes:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(lotes || [])
  } catch (err) {
    console.error('Error interno lotes API:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
