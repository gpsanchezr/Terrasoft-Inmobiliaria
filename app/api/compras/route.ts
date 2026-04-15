import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get('estado');
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('compras')
      .select(`
        id,
        user_id,
        lote_id,
        fecha_compra,
        estado,
        lotes(numero_lote, valor_total, etapa, area_m2)
      `);

    if (estado) {
      query = query.eq('estado', estado);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // Por defecto, solo mostrar compras activas
      query = query.eq('estado', 'activa');
    }

    const { data: compras, error } = await query.order('fecha_compra', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Error al obtener compras' },
        { status: 500 }
      );
    }

    // Enriquecer con información de pagos
    const comprasConPagos = await Promise.all(
      (compras || []).map(async (compra) => {
        const { data: pagos } = await supabase
          .from('pagos')
          .select('monto_abonado')
          .eq('compra_id', compra.id)
          .eq('estado', 'completado');

        const totalPagado = pagos?.reduce((sum, p) => sum + p.monto_abonado, 0) || 0;
        const valorTotal = (compra.lotes as any).valor_total;
        const saldoPendiente = valorTotal - totalPagado;

        return {
          ...compra,
          total_pagado: totalPagado,
          saldo_pendiente: saldoPendiente,
          cliente_nombre: 'Cliente', // Se obtendría del user_profiles si necesario
          numero_lote: (compra.lotes as any).numero_lote,
          valor_total: valorTotal
        };
      })
    );

    return NextResponse.json(comprasConPagos);
  } catch (error) {
    console.error('Error en compras API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
