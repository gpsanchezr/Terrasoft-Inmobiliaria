'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FormularioPQRS } from '@/components/formulario-pqrs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PQRSPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        window.location.href = '/login';
      }
    });
  }, []);

  if (!user) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bolivar-verde/10 to-bolivar-amarillo/10 p-8 notranslate">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">PQRS MonteVerde</h1>
          <p className="text-xl text-gray-600 font-light">Peticiones, Quejas, Reclamos y Sugerencias - Tu voz es importante para nosotros</p>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <FormularioPQRS />
          </div>

          {/* Información */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-bolivar-verde/10 to-bolivar-amarillo/10 border-bolivar-verde/20 h-fit sticky top-32">
              <CardHeader>
                <CardTitle className="text-2xl">Tipos de PQRS</CardTitle>
                <CardDescription>Elige la opción que mejor se adapte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-bolivar-verde">🙋 Petición</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Solicitudes de servicios o acciones que corresponde hacer a MonteVerde.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-bolivar-verde">😠 Queja</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Expresión de insatisfacción con el servicio recibido.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-bolivar-verde">💬 Reclamo</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Protesta formal respecto a la prestación del servicio.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-bolivar-verde">💡 Sugerencia</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Propuestas o recomendaciones para mejorar nuestro servicio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-bolivar-verde/10 to-bolivar-amarillo/10 border-bolivar-verde/20">
              <CardHeader>
                <CardTitle>📄 Información Útel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-700"><strong>Correo:</strong> {user?.email}</p>
                </div>
                <div>
                  <p className="text-bolivar-verde font-semibold mt-4">⚠️ Tiempo de respuesta:</p>
                  <p className="text-gray-700">24-48 horas hábiles</p>
                </div>
                <div>
                  <p className="text-bolivar-verde font-semibold mt-4">🔍 Seguimiento:</p>
                  <p className="text-gray-700">Revisa tu correo electrónico para actualizaciones</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
