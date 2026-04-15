import { NextRequest, NextResponse } from 'next/server';
import { createCompra } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, lote_id } = body;

    if (!user_id || !lote_id) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const compra = await createCompra(user_id, lote_id);

    return NextResponse.json({ success: true, compra });
  } catch (err) {
    console.error('Error creando compra:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
