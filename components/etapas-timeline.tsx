'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface Etapa {
  id: number;
  titulo: string;
  descripcion: string;
  fecha?: string;
}

const etapas: Etapa[] = [
  {
    id: 1,
    titulo: 'Lanzamiento',
    descripcion: 'Definición del proyecto. Conoce nuestra visión y objetivos.',
    fecha: '2025 - Inicio'
  },
  {
    id: 2,
    titulo: 'Preventa',
    descripcion: 'Compra a mejores precios. Aprovecha precios especiales de lanzamiento.',
    fecha: '2025 - Q2'
  },
  {
    id: 3,
    titulo: 'Construcción',
    descripcion: 'Inicio de obras. Monitorea el progreso del proyecto.',
    fecha: '2025 - Q3'
  },
  {
    id: 4,
    titulo: 'Entrega',
    descripcion: 'Cesión de derechos y posesión. Materializa tu inversión.',
    fecha: '2026 - Q1'
  }
];

export function EtapasTimeline() {
  return (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-bolivar-verde/10 to-bolivar-amarillo/10 notranslate">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Etapas de MonteVerde</h2>
          <p className="text-gray-600 text-lg font-light">
            Un proyecto estructurado en 4 etapas claras hacia tu futuro
          </p>
        </div>

        <div className="relative">
          {/* Línea conectora */}
          <div className="absolute left-6 top-20 bottom-0 w-1 bg-gradient-to-b from-bolivar-verde via-bolivar-amarillo to-bolivar-verde hidden md:block" />

          {/* Etapas */}
          <div className="space-y-10">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="relative pl-20 md:pl-0 md:mb-6">
                {/* Punto en la línea */}
                <div className="absolute left-0 md:left-0 md:-ml-2">
                  <div className="flex items-center justify-center w-14 h-14">
                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      index < 2
                        ? 'bg-gradient-to-br from-bolivar-verde to-bolivar-amarillo border-bolivar-verde shadow-bolivar-verde/30'
                        : 'bg-white border-bolivar-verde shadow-bolivar-verde/20'
                    } shadow-lg hover:scale-110`}>
                      {index < 2 ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : (
                        <Circle className="w-6 h-6 text-bolivar-verde" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className={`md:ml-24 rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
                  index < 2
                    ? 'bg-gradient-to-br from-bolivar-verde/10 to-bolivar-amarillo/10 border-bolivar-verde/20 hover:shadow-bolivar-verde/30'
                    : 'bg-white border-bolivar-verde/20 hover:shadow-bolivar-verde/30'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{etapa.titulo}</h3>
                      <p className="text-gray-700 mt-2 font-light leading-relaxed">{etapa.descripcion}</p>
                    </div>
                    {etapa.fecha && (
                      <div className="flex-shrink-0">
                        <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap ${
                          index < 2
                            ? 'bg-bolivar-amarillo text-white'
                            : 'bg-bolivar-verde/20 text-bolivar-verde'
                        }`}>
                          {etapa.fecha}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
