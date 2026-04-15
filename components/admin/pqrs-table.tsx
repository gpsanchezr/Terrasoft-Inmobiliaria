'use client'

import { useState, useEffect } from 'react'
import { getAllPQRS, updatePQRSStatus, PQRS } from '@/lib/pqrs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function PQRSTable() {
  const [pqrsData, setPQRSData] = useState<PQRS[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadPQRS()
  }, [])

  const loadPQRS = async () => {
    setLoading(true)
    const { data, error } = await getAllPQRS()
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    } else if (data) {
      setPQRSData(data)
    }
    setLoading(false)
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdating(id)
    const response = await updatePQRSStatus(
      id,
      newStatus as 'Pendiente' | 'En Proceso' | 'Resuelto'
    )

    if (response.success) {
      setPQRSData(
        pqrsData.map((pqrs) =>
          pqrs.id === id ? { ...pqrs, estado: newStatus as any } : pqrs
        )
      )
      toast({
        title: 'Éxito',
        description: 'Estado actualizado correctamente',
      })
    } else {
      toast({
        title: 'Error',
        description: response.error || 'Error al actualizar el estado',
        variant: 'destructive',
      })
    }
    setUpdating(null)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800'
      case 'Resuelto':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'Petición':
        return 'bg-purple-100 text-purple-800'
      case 'Queja':
        return 'bg-red-100 text-red-800'
      case 'Reclamo':
        return 'bg-orange-100 text-orange-800'
      case 'Sugerencia':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PQRS Recibidas</CardTitle>
        <CardDescription>
          Gestiona las peticiones, quejas, reclamos y sugerencias de los clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Cargando PQRS...</div>
        ) : pqrsData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay PQRS registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pqrsData.map((pqrs) => (
                  <TableRow key={pqrs.id}>
                    <TableCell className="font-medium">{pqrs.id}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(pqrs.tipo)}>{pqrs.tipo}</Badge>
                    </TableCell>
                    <TableCell>{pqrs.nombre}</TableCell>
                    <TableCell className="text-sm">{pqrs.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{pqrs.asunto}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-gray-600">
                      {pqrs.descripcion}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={pqrs.estado || 'Pendiente'}
                        onValueChange={(value) => handleStatusChange(pqrs.id!, value)}
                        disabled={updating === pqrs.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Resuelto">Resuelto</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">
                      {pqrs.created_at
                        ? new Date(pqrs.created_at).toLocaleDateString('es-ES')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4">
          <Button variant="outline" onClick={loadPQRS} disabled={loading}>
            {loading ? 'Recargando...' : 'Recargar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
