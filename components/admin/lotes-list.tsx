'use client'

import { useState, useEffect } from 'react'
import { getLotes, Lote } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

export function LotesList() {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadLotes()
  }, [])

  const loadLotes = async () => {
    setLoading(true)
    const { data, error } = await getLotes()
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    } else if (data) {
      setLotes(data)
    }
    setLoading(false)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
case 'disponible':
        return 'bg-green-100 text-green-800'
      case 'reservado':
        return 'bg-blue-100 text-blue-800'
      case 'vendido':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoEmoji = (estado: string) => {
    switch (estado) {
case 'disponible':
        return '✓'
      case 'reservado':
        return '⌛'
      case 'vendido':
        return '✓✓'
      default:
        return '○'
    }
  }

const stats = {
  disponibles: lotes.filter((l) => l.estado === 'disponible').length,
  reservados: lotes.filter((l) => l.estado === 'reservado').length,
  vendidos: lotes.filter((l) => l.estado === 'vendido').length,
}

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.disponibles}</div>
            <p className="text-xs text-gray-500 mt-1">Lotes listos para compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Reservados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.reservados}</div>
            <p className="text-xs text-gray-500 mt-1">En proceso de venta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{stats.vendidos}</div>
            <p className="text-xs text-gray-500 mt-1">Transacciones completadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario de Lotes</CardTitle>
          <CardDescription>Lista completa de todos los lotes y su disponibilidad</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando lotes...</div>
          ) : lotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay lotes registrados</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Número de Lote</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Área (m²)</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lotes.map((lote) => (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium">
                        <span>{lote.id}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span>{lote.numero_lote}</span>
                      </TableCell>
                      <TableCell>
                        <span>{lote.ubicacion || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <span>{lote.etapa}</span>
                      </TableCell>
                      <TableCell>
                        <span>{lote.area_m2.toLocaleString('es-ES')}</span>
                      </TableCell>
                      <TableCell>
                        <span>
                          ${lote.valor_total.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(lote.estado)}>
                          <span>{lote.estado}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4">
            <Button variant="outline" onClick={loadLotes} disabled={loading}>
              {loading ? 'Recargando...' : 'Recargar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
