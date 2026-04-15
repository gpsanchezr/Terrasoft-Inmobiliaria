import { supabase } from './supabase';

// Calcula el saldo pendiente aplicando la fórmula:
// Valor total del lote - suma de los pagos completados.
export async function calcularSaldoPendiente(compraId: number) {
  const { data: compra, error: compraError } = await supabase
    .from('compras')
    .select('id, lote_id, lotes(valor_total)')
    .eq('id', compraId)
    .single();

  if (compraError || !compra) {
    throw compraError || new Error('Compra no encontrada');
  }

  const valorTotal = (compra.lotes as any).valor_total;

  const { data: pagos, error: pagosError } = await supabase
    .from('pagos')
    .select('monto_abonado')
    .eq('compra_id', compraId)
    .eq('estado', 'completado');

  if (pagosError) {
    throw pagosError;
  }

  const totalPagado = (pagos || []).reduce((sum, p) => sum + p.monto_abonado, 0);
  return valorTotal - totalPagado;
}
