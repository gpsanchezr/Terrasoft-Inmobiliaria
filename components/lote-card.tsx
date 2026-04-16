'use client';

import { Banknote, MapPin, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LoteCardProps {
  id: string;
  numero_lote: string;
  etapa: string;
  area_m2: number;
  ubicacion: string;
  valor_total: number;
  estado: 'disponible' | 'reservado' | 'vendido';
  descripcion?: string;
  imagen_url?: string;
  mapa_url?: string;
  onSelect?: () => void;
}

function getAccionBotones(etapa: string, estado: string) {
  if (estado !== 'disponible') {
    return <Button className="w-full opacity-50 cursor-not-allowed" disabled>No disponible</Button>;
  }

  switch (etapa) {
    case 'Lanzamiento':
      return <Button className="w-full bg-green-800 hover:bg-green-900">Solicitar Cotización</Button>;
    case 'Preventa':
      return (
        <div className="space-y-2">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Reservar Ahora</Button>
          <Button variant="outline" className="w-full">Ver Tour Virtual</Button>
        </div>
      );
    case 'Construccion':
      return <Button variant="outline" className="w-full border-2 border-gray-300">Agendar Visita</Button>;
    case 'Entrega':
      return (
        <div className="space-y-2">
          <Button variant="outline" className="w-full">Agendar Visita</Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Descargar Planos</Button>
        </div>
      );
    default:
      return <Button className="w-full">Ver Detalles</Button>;
  }
}

export function LoteCard({
  numero_lote,
  etapa,
  area_m2,
  ubicacion,
  valor_total,
  estado,
  descripcion,
  imagen_url,
  mapa_url,
  onSelect
}: LoteCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto">
      {/* Badge Active */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-green-500 text-white shadow-md">active</Badge>
      </div>

      {/* Imagen grande */}
      <div className="h-64 overflow-hidden bg-gradient-to-br from-gray-50">
        <img
          src={imagen_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
          alt={`Lote ${numero_lote}`}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Header nombre + precio */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Lote {numero_lote}</h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">{etapa}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ${valor_total.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{descripcion}</p>
        )}

        {/* Mini Google Maps */}
        <div className="bg-gray-50 rounded-xl p-3">
          <img
            src={mapa_url || `https://via.placeholder.com/300x120/4f46e5/ffffff?text=${ubicacion}`}
            alt="Ubicación"
            className="w-full h-24 object-cover rounded-lg"
          />
        </div>

        {/* Detalles área + ubicación */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Ruler className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{area_m2} m²</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{ubicacion}</span>
          </div>
        </div>

        {/* Botones dinámicos */}
        <div className="pt-4 border-t border-gray-100">
          {getAccionBotones(etapa, estado)}
        </div>
      </div>
    </div>
  );
}
