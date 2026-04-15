import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const etapa = searchParams.get('etapa');
    const estado = searchParams.get('estado');

    let sql = 'SELECT * FROM lotes WHERE 1=1';
    const params: any[] = [];

    if (etapa) {
      sql += ' AND etapa = ?';
      params.push(etapa);
    }

    if (estado) {
      sql += ' AND estado = ?';
      params.push(estado);
    } else {
      // Por defecto mostrar solo disponibles
      sql += ' AND estado = ?';
      params.push('disponible');
    }

    sql += ' ORDER BY numero_lote ASC';

    const lotes = await query(sql, params);

    // Enriquecer con información de compras
    const lotesConInfo = await Promise.all(
      (lotes as any[]).map(async (lote) => {
        const compras = await query(
          'SELECT COUNT(*) as count FROM compras WHERE lote_id = ? AND estado = ?',
          [lote.id, 'activa']
        );

        return {
          ...lote,
          interesados: (compras as any[])[0].count || 0
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
