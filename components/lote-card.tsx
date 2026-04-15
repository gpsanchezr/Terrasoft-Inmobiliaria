'use client';

import { Banknote, MapPin, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LoteCardProps {
  id: number;
  numero_lote: string;
  etapa: string;
  area_m2: number;
  ubicacion: string;
  valor_total: number;
  estado: 'disponible' | 'reservado' | 'vendido';
  descripcion?: string;
  imagen_url?: string;
  onSelect?: () => void;
}

const estadoColors = {
  disponible: 'bg-green-100 text-green-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  vendido: 'bg-red-100 text-red-800'
};

const estadoLabels = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido'
};

export function LoteCard({
  numero_lote,
  etapa,
  area_m2,
  ubicacion,
  valor_total,
  estado,
  descripcion,
  imagen_url,
  onSelect
}: LoteCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 notranslate">
      {/* Imagen */}
      {imagen_url && (
        <div className="h-48 bg-gradient-to-br from-bolivar-verde to-bolivar-amarillo overflow-hidden">
          <img
            src={imagen_url}
            alt={`Lote ${numero_lote}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Lote {numero_lote}</h3>
            <p className="text-sm text-gray-500 mt-1">Etapa: {etapa}</p>
          </div>
          <Badge className={estadoColors[estado]}>
            {estadoLabels[estado]}
          </Badge>
        </div>

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-gray-600">{descripcion}</p>
        )}

        {/* Detalles */}
        <div className="space-y-3 border-t border-b border-gray-100 py-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Ruler className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Área</p>
              <p className="font-semibold">{area_m2} m²</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="font-semibold text-sm">{ubicacion}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Banknote className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Valor</p>
              <p className="font-semibold text-lg text-green-600">
                ${valor_total.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>

        {/* Banner especial */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900">
            ✨ ¡Obsequio especial! 
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Por la compra de tu lote, recibe gratis los planos habitacionales para tu futura casa.
          </p>
        </div>

        {/* Botón */}
        <Button
          onClick={onSelect}
          disabled={estado !== 'disponible'}
          className="w-full"
          variant={estado === 'disponible' ? 'default' : 'secondary'}
        >
          {estado === 'disponible' ? 'Ver Detalles' : 'No disponible'}
        </Button>
      </div>
    </div>
  );
}
