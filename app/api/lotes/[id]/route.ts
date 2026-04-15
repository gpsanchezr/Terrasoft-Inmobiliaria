import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { data: lote, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !lote) {
      return NextResponse.json(
        { error: 'Lote no encontrado' },
        { status: 404 }
      );
    }

    // Obtener información adicional
    const { data: compras } = await supabase
      .from('compras')
      .select('id, user_id, fecha_compra')
      .eq('lote_id', id)
      .eq('estado', 'activa')
      .limit(3);

    return NextResponse.json({
      ...lote,
      compradoresInteresados: compras?.length || 0
    });
  } catch (error) {
    console.error('Error en lotes/[id] API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
