/**
 * Utilidades para cálculos de pagos y gestión de compras
 */

/**
 * Calcula el saldo pendiente de una compra
 * @param valorTotal - Valor total del lote
 * @param totalPagado - Suma de todos los pagos completados
 * @returns Saldo pendiente (puede ser negativo si hay sobrepago)
 */
export function calcularSaldoPendiente(
  valorTotal: number,
  totalPagado: number
): number {
  return Math.max(0, valorTotal - totalPagado);
}

/**
 * Calcula el porcentaje de pago completado
 * @param totalPagado - Suma de pagos
 * @param valorTotal - Valor total
 * @returns Porcentaje entre 0 y 100
 */
export function calcularPorcentajePago(
  totalPagado: number,
  valorTotal: number
): number {
  if (valorTotal === 0) return 0;
  return Math.min(100, (totalPagado / valorTotal) * 100);
}

/**
 * Formatea un número como moneda colombiana
 * @param valor - Valor numérico
 * @returns String formateado
 */
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

/**
 * Calcula la próxima cuota sugerida basada en el saldo
 * @param saldoPendiente - Saldo pendiente
 * @param numeroCuotasRestantes - Cuotas restantes en el plan
 * @returns Monto sugerido para la cuota
 */
export function calcularCuotaSugerida(
  saldoPendiente: number,
  numeroCuotasRestantes: number = 12
): number {
  if (saldoPendiente <= 0) return 0;
  return Math.ceil(saldoPendiente / numeroCuotasRestantes);
}

/**
 * Valida si un monto de pago es válido
 * @param monto - Monto a validar
 * @param saldoPendiente - Saldo pendiente de la compra
 * @returns true si el pago es válido
 */
export function validarMontoPago(
  monto: number,
  saldoPendiente: number
): boolean {
  return monto > 0 && monto <= saldoPendiente + 1000000; // Permite sobrepago hasta 1M
}

/**
 * Genera un número de referencia de pago
 * @param compraId - ID de la compra
 * @param numeroIntento - Número de intento
 * @returns Referencia para el pago
 */
export function generarReferenciaPago(
  compraId: number,
  numeroIntento: number = 1
): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `PAG-${compraId}-${fecha}-${numeroIntento}`;
}

/**
 * Calcula el estado de la compra basado en el saldo
 * @param saldoPendiente - Saldo pendiente
 * @returns 'pagado' | 'parcial' | 'pendiente'
 */
export function calcularEstadoCompra(saldoPendiente: number): 'pagado' | 'parcial' | 'pendiente' {
  if (saldoPendiente === 0) return 'pagado';
  if (saldoPendiente < 0) return 'pagado'; // Sobrepagado
  return saldoPendiente > 0 ? 'pendiente' : 'parcial';
}

/**
 * Formatea una fecha en formato colombiano
 * @param fecha - Fecha a formatear
 * @returns String con formato dd/mm/yyyy
 */
export function formatearFecha(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Calcula el valor de la cuota inicial típica (20% del valor)
 * @param valorTotal - Valor total del lote
 * @returns Valor de la cuota inicial
 */
export function calcularCuotaInicial(valorTotal: number): number {
  return valorTotal * 0.2; // 20%
}

/**
 * Calcula las cuotas restantes
 * @param valorTotal - Valor total
 * @param cuotaInicial - Monto de cuota inicial
 * @param numeroCuotas - Número total de cuotas (incluyendo inicial)
 * @returns Monto por cada cuota restante
 */
export function calcularCuotasRestantes(
  valorTotal: number,
  cuotaInicial: number,
  numeroCuotas: number = 12
): number {
  const saldoRestante = valorTotal - cuotaInicial;
  const cuotasContiuidad = numeroCuotas - 1; // Restamos la inicial
  return cuotasContiuidad > 0 ? saldoRestante / cuotasContiuidad : 0;
}

/**
 * Genera un plan de pagos
 * @param valorTotal - Valor total del lote
 * @param numeroCuotas - Número de cuotas
 * @param fechaInicio - Fecha de inicio del primer pago
 * @returns Array con detalles de cada cuota
 */
export function generarPlanPagos(
  valorTotal: number,
  numeroCuotas: number = 12,
  fechaInicio: Date = new Date()
) {
  const cuotaInicial = calcularCuotaInicial(valorTotal);
  const cuotaRegular = calcularCuotasRestantes(valorTotal, cuotaInicial, numeroCuotas);

  return Array.from({ length: numeroCuotas }, (_, index) => {
    const esCuotaInicial = index === 0;
    const monto = esCuotaInicial ? cuotaInicial : cuotaRegular;
    
    const fechaCuota = new Date(fechaInicio);
    fechaCuota.setMonth(fechaCuota.getMonth() + index);

    return {
      numero: index + 1,
      monto: Math.round(monto),
      fecha: fechaCuota,
      estado: 'pendiente' as const,
      descripcion: esCuotaInicial ? 'Cuota Inicial' : `Cuota ${index} de ${numeroCuotas - 1}`
    };
  });
}

/**
 * Valida un numero de documento colombiano
 * @param documento - Número a validar
 * @returns true si el formato es válido
 */
export function validarDocumentoColombia(documento: string): boolean {
  // Acepta cédula (6-10 dígitos) o pasaporte
  const cedula = /^\d{6,10}$/.test(documento);
  const pasaporte = /^[A-Z]{1,2}\d{5,8}$/.test(documento);
  return cedula || pasaporte;
}

/**
 * Genera información de resumen de pago para correo
 */
export interface ResumenPago {
  lotNumero: string;
  montoAbonado: string;
  totalPagado: string;
  saldoPendiente: string;
  porcentajePago: number;
  fechaPago: string;
  proximaCuota?: {
    monto: string;
    fecha: string;
  };
}

export function generarResumenPago(
  lotNumero: string,
  montoAbonado: number,
  totalPagado: number,
  valorTotal: number,
  fechaPago: Date = new Date(),
  proximaCuota?: Date
): ResumenPago {
  const saldoPendiente = calcularSaldoPendiente(valorTotal, totalPagado);
  const porcentajePago = calcularPorcentajePago(totalPagado, valorTotal);

  return {
    lotNumero,
    montoAbonado: formatearMoneda(montoAbonado),
    totalPagado: formatearMoneda(totalPagado),
    saldoPendiente: formatearMoneda(saldoPendiente),
    porcentajePago: Math.round(porcentajePago),
    fechaPago: formatearFecha(fechaPago),
    proximaCuota: proximaCuota ? {
      monto: formatearMoneda(calcularCuotaSugerida(saldoPendiente)),
      fecha: formatearFecha(proximaCuota)
    } : undefined
  };
}
