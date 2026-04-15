import { query, createPago, calcularSaldoPendiente } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { compra_id, monto_abonado, metodo_pago, usuario_email } = body;

    // Validar datos
    if (!compra_id || !monto_abonado || !usuario_email) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Obtener información de la compra
    const compras = await query(
      'SELECT c.id, c.user_id, c.lote_id, l.numero_lote, l.valor_total FROM compras c JOIN lotes l ON c.lote_id = l.id WHERE c.id = ?',
      [compra_id]
    );

    if (!compras || compras.length === 0) {
      return NextResponse.json(
        { error: 'Compra no encontrada' },
        { status: 404 }
      );
    }

    const compra = (compras as any[])[0];

    // Crear registro de pago
    const pago = await createPago(compra_id, monto_abonado);

    // Obtener saldo actualizado
    const saldoPendiente = await calcularSaldoPendiente(compra_id);

    // Enviar correo de confirmación con Resend
    try {
      const totalPagado = compra.valor_total - saldoPendiente;
      await resend.emails.send({
        from: 'noreply@proyecto-inmobiliario.com',
        to: usuario_email,
        subject: `✅ Pago confirmado - Lote ${compra.numero_lote}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Pago Registrado Exitosamente!</h2>
            <p>Tu pago ha sido procesado correctamente.</p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Resumen del Pago:</h3>
              <p><strong>Lote:</strong> ${compra.numero_lote}</p>
              <p><strong>Monto Abonado:</strong> $${monto_abonado.toLocaleString('es-CO')}</p>
              <p><strong>Total Pagado:</strong> $${totalPagado.toLocaleString('es-CO')}</p>
              <p><strong>Saldo Pendiente:</strong> $${Math.max(0, saldoPendiente).toLocaleString('es-CO')}</p>
              <p><strong>Fecha de Pago:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
            </div>

            <p>Puedes acceder a tu comprobante de pago desde tu panel de control.</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Si tienes preguntas, contáctanos.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error enviando correo:', emailError);
      // No fallar la API si el correo falla
    }

    return NextResponse.json({
      success: true,
      pago,
      saldo_pendiente: Math.max(0, saldoPendiente)
    });
  } catch (error) {
    console.error('Error en crear-pago API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
