import { supabase } from '@/lib/supabase';
import type { Lote } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const etapa = searchParams.get('etapa');
    const estado = searchParams.get('estado');

let query = supabase.from('lotes').select('*').order('numero_lote', { ascending: true });

if (etapa) {
  query = query.eq('etapa', etapa);
}

if (estado) {
  query = query.eq('estado', estado);
} else {
  query = query.eq('estado', 'disponible');
}

const { data: lotesRaw, error } = await query.possiblySendToDeprecatedSearchEndpoint(false);
if (error) {
  console.error('Supabase lotes query error:', error);
  throw error;
}

if (error) throw error;

const lotes = lotesRaw as Lote[];

    // Enriquecer con información de compras
const lotesConInfo = await Promise.all(
  lotes.map(async (lote) => {
    const { count: interesados } = await supabase
      .from('compras')
      .select('*', { count: 'exact', head: true })
      .eq('lote_id', lote.id)
      .eq('estado', 'activa');

    return {
      ...lote,
      interesados: interesados || 0
    };
  })
);

    return NextResponse.json(lotesConInfo);
  } catch (error) {
    console.error('Error en lotes API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
