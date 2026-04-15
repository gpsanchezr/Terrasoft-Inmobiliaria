import { createPqrs, getAllPqrs } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, asunto, descripcion, user_id } = body;

    if (!tipo || !asunto || !descripcion) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const pqrs = await createPqrs(user_id, tipo, asunto, descripcion);

    return NextResponse.json(
      { success: true, pqrs },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en PQRS API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const pqrs = await getAllPqrs();

    return NextResponse.json(pqrs);
  } catch (error) {
    console.error('Error en PQRS API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
