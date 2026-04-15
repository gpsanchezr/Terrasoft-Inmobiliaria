'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, DollarSign, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PanelAdminPagos() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    compra_id: '',
    monto: '',
    metodo: 'transferencia',
    comprobante_url: ''
  });
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await fetch('/api/compras');
      const data = await response.json();
      setCompras(data || []);
    } catch (error) {
      console.error('Error fetching compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.compra_id || !formData.monto) {
      setMensaje({ tipo: 'error', texto: 'Completa todos los campos' });
      return;
    }

    try {
      const response = await fetch('/api/pagos/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compra_id: parseInt(formData.compra_id),
          monto_abonado: parseFloat(formData.monto),
          metodo_pago: formData.metodo,
          comprobante_url: formData.comprobante_url
        })
      });

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: '✅ Pago registrado exitosamente' });
        setFormData({ compra_id: '', monto: '', metodo: 'transferencia', comprobante_url: '' });
        fetchCompras();
      } else {
        setMensaje({ tipo: 'error', texto: '❌ Error al registrar pago' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: '❌ Error de conexión' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Registrar Nuevo Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistrarPago} className="space-y-4">
            {/* Seleccionar Compra */}
            <div>
              <Label htmlFor="compra">Seleccionar Compra</Label>
              <Select
                value={formData.compra_id}
                onValueChange={(value) => setFormData({ ...formData, compra_id: value })}
              >
                <SelectTrigger id="compra">
                  <SelectValue placeholder="Elige una compra" />
                </SelectTrigger>
                <SelectContent>
                  {compras.map((compra) => (
                    <SelectItem key={compra.id} value={compra.id.toString()}>
                      Lote {compra.numero_lote} - ${compra.valor_total.toLocaleString('es-CO')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Monto */}
              <div>
                <Label htmlFor="monto">Monto Pagado</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="250000"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  step="1000"
                />
              </div>

              {/* Método de Pago */}
              <div>
                <Label htmlFor="metodo">Método de Pago</Label>
                <Select
                  value={formData.metodo}
                  onValueChange={(value) => setFormData({ ...formData, metodo: value })}
                >
                  <SelectTrigger id="metodo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* URL de Comprobante */}
            <div>
              <Label htmlFor="comprobante">URL del Comprobante (opcional)</Label>
              <Input
                id="comprobante"
                type="url"
                placeholder="https://..."
                value={formData.comprobante_url}
                onChange={(e) => setFormData({ ...formData, comprobante_url: e.target.value })}
              />
            </div>

            {/* Mensaje de estado */}
            {mensaje && (
              <Alert className={mensaje.tipo === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                {mensaje.tipo === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>{mensaje.texto}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Registrar Pago
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Compras Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Compras y Saldos Pendientes</CardTitle>
          <CardDescription>Gestiona el estado de pagos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando compras...</div>
          ) : compras.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compras.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell className="font-medium">{compra.numero_lote}</TableCell>
                      <TableCell>${compra.valor_total.toLocaleString('es-CO')}</TableCell>
                      <TableCell>{compra.cliente_nombre || 'Sin asignar'}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          compra.saldo_pendiente === 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {compra.saldo_pendiente === 0 ? 'Pagado' : `$${compra.saldo_pendiente.toLocaleString('es-CO')}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setFormData({ ...formData, compra_id: compra.id.toString() })}
                        >
                          Registrar Pago
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No hay compras registradas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function PanelAdminPQRS() {
  const [pqrs, setPQRS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPQRS, setSelectedPQRS] = useState<any | null>(null);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    fetchPQRS();
  }, []);

  const fetchPQRS = async () => {
    try {
      const response = await fetch('/api/pqrs');
      const data = await response.json();
      setPQRS(data || []);
    } catch (error) {
      console.error('Error fetching PQRS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async () => {
    if (!selectedPQRS || !respuesta) return;

    try {
      // Aquí irá la lógica para guardar la respuesta
      setSelectedPQRS(null);
      setRespuesta('');
      fetchPQRS();
    } catch (error) {
      console.error('Error respondiendo PQRS:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de PQRS */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PQRS Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <div className="space-y-2">
              {pqrs
                .filter((p) => p.estado === 'abierta' || p.estado === 'en_proceso')
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPQRS(p)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      selectedPQRS?.id === p.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm">{p.asunto}</p>
                    <p className="text-xs text-gray-500 mt-1">Tipo: {p.tipo}</p>
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalle y Respuesta */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Responder PQRS</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPQRS ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Asunto</p>
                <p className="font-semibold">{selectedPQRS.asunto}</p>

                <p className="text-sm text-gray-500 mt-4">Descripción</p>
                <p className="text-gray-700">{selectedPQRS.descripcion}</p>

                <p className="text-sm text-gray-500 mt-4">Estado</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  {selectedPQRS.estado}
                </span>
              </div>

              <div>
                <Label htmlFor="respuesta">Tu Respuesta</Label>
                <Textarea
                  id="respuesta"
                  placeholder="Escribe aquí tu respuesta..."
                  rows={5}
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
              </div>

              <Button onClick={handleResponder} className="w-full">
                Guardar Respuesta y Cerrar
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Selecciona una PQRS para responder
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
