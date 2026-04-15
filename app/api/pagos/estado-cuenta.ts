import { query, calcularSaldoPendiente } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const compraId = searchParams.get('compra_id');

    if (!compraId) {
      return NextResponse.json(
        { error: 'compra_id es requerido' },
        { status: 400 }
      );
    }

    // Obtener información de la compra y lote
    const compras = await query(
      'SELECT c.id, c.lote_id, c.fecha_compra, l.valor_total FROM compras c JOIN lotes l ON c.lote_id = l.id WHERE c.id = ?',
      [compraId]
    );

    if (!compras || compras.length === 0) {
      return NextResponse.json(
        { error: 'Compra no encontrada' },
        { status: 404 }
      );
    }

    const compra = (compras as any[])[0];

    // Obtener pagos realizados
    const pagos = await query(
      'SELECT monto_abonado, fecha_pago FROM pagos WHERE compra_id = ? AND estado = ? ORDER BY fecha_pago DESC',
      [compraId, 'completado']
    );

    const valorTotal = compra.valor_total;
    const totalPagado = (pagos as any[]).reduce((sum, pago) => sum + pago.monto_abonado, 0) || 0;
    const saldoPendiente = valorTotal - totalPagado;

    return NextResponse.json({
      compra_id: compra.id,
      valor_total: valorTotal,
      total_pagado: totalPagado,
      saldo_pendiente: Math.max(0, saldoPendiente),
      fecha_compra: compra.fecha_compra,
      ultimo_pago: (pagos as any[])[0]?.fecha_pago || null,
      pagos: pagos || []
    });
  } catch (error) {
    console.error('Error en estado-cuenta API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
