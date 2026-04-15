'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Compra {
  id: number;
  lote_numero: string;
  valor_total: number;
  fecha_compra: string;
  estado: string;
}

interface PagoInfo {
  compra_id: number;
  total_pagado: number;
  saldo_pendiente: number;
  ultimo_pago?: string;
  proxima_cuota?: {
    monto: number;
    fecha: string;
  };
}

export function EstadoCuentaCliente({ compraId }: { compraId: number }) {
  const [pagoInfo, setPagoInfo] = useState<PagoInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadoCuenta = async () => {
      try {
        const response = await fetch(`/api/pagos/estado-cuenta?compra_id=${compraId}`);
        const data = await response.json();
        setPagoInfo(data);
      } catch (error) {
        console.error('Error fetching estado cuenta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadoCuenta();
  }, [compraId]);

  if (loading) {
    return <div className="text-center py-8">Cargando información...</div>;
  }

  if (!pagoInfo) {
    return <div className="text-center py-8">No hay información disponible</div>;
  }

  const porcentajePagado = pagoInfo.total_pagado + pagoInfo.saldo_pendiente > 0 ? (pagoInfo.total_pagado / (pagoInfo.total_pagado + pagoInfo.saldo_pendiente)) * 100 : 0;

  return (
    <div className="space-y-6 notranslate">
      {/* Tarjeta principal de saldo */}
      <Card className="border-2 border-bolivar-verde bg-gradient-to-br from-bolivar-verde/10 via-bolivar-amarillo/10 to-bolivar-amarillo/10 shadow-bolivar-verde/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo bg-clip-text text-transparent">Estado de Cuenta MonteVerde</CardTitle>
          <CardDescription className="text-gray-600 text-base">Resumen de tu inversión y pagos realizados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información de pagos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-2 font-semibold">Valor Total del Lote</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(pagoInfo.total_pagado + pagoInfo.saldo_pendiente).toLocaleString('es-CO')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-bolivar-verde/10 to-bolivar-amarillo/10 rounded-xl border border-bolivar-verde/30 p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-2 font-semibold">Total Pagado</p>
              <p className="text-3xl font-bold text-green-600">
                ${pagoInfo.total_pagado.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-green-700 mt-1">✓ Completado</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-300 p-5 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-2 font-semibold">Saldo Pendiente</p>
              <p className="text-3xl font-bold text-yellow-600">
                ${pagoInfo.saldo_pendiente.toLocaleString('es-CO')}
              </p>
              <p className="text-xs text-yellow-700 mt-1">{pagoInfo.saldo_pendiente > 0 ? '⏳ Por pagar' : '✅ Pagado'}</p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-3 bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold text-gray-800">Progreso de Pago</p>
              <span className="text-lg font-bold bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo bg-clip-text text-transparent">{Math.round(porcentajePagado)}%</span>
            </div>
            <div className="h-4 rounded-full bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, porcentajePagado))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Inicio</span>
              <span>En progreso</span>
              <span>Completado</span>
            </div>
          </div>

          {/* Próxima cuota */}
          {pagoInfo.proxima_cuota && (
            <Alert className="border-blue-300 bg-blue-50 rounded-xl">
              <Clock className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-900 ml-2">
                <strong>Próxima cuota:</strong> ${pagoInfo.proxima_cuota.monto.toLocaleString('es-CO')} 
                vencimiento: {new Date(pagoInfo.proxima_cuota.fecha).toLocaleDateString('es-CO')}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo hover:from-bolivar-verde/90 hover:to-bolivar-amarillo/90 font-bold text-base">Realizar Pago</Button>
            <Button variant="outline" className="flex-1 font-bold text-base">Ver Comprobantes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de pagos */}
      <Card className="border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>Últimas transacciones registradas en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Ejemplo de registro - será dinámico */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Pago completado</p>
                  <p className="text-sm text-gray-500">12 de marzo de 2025</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+$500,000</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 font-semibold">
            Ver todo el historial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
