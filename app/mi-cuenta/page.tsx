'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EstadoCuentaCliente } from '@/components/estado-cuenta';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MiCuentaPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [compras, setCompras] = useState<any[]>([]);
  const [selectedCompra, setSelectedCompra] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('lotes');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        window.location.href = '/login';
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      // Obtener compras
      fetch(`/api/compras?user_id=${user.id}`)
        .then((r) => r.json())
        .then((data) => setCompras(data || []))
        .catch(console.error);

      // Obtener perfil del usuario
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error loading profile:', error);
          } else {
            setProfile(data);
          }
        });
    }
  }, [user]);

  if (!user) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'lotes'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Mis Lotes
        </button>
        <button
          onClick={() => setActiveTab('pagos')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'pagos'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Pagos
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'perfil'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Perfil
        </button>
      </div>

      {/* Mis Lotes */}
      {activeTab === 'lotes' && (
        <div>
          {compras.length === 0 ? (
            <Card className="p-4">
              <p>No has realizado ninguna compra aun.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {compras.map((compra) => (
                  <Button
                    key={compra.id}
                    variant={selectedCompra === compra.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCompra(compra.id)}
                  >
                    Lote {compra.numero_lote}
                  </Button>
                ))}
              </div>
              {selectedCompra && <EstadoCuentaCliente compraId={selectedCompra} />}
            </div>
          )}
        </div>
      )}

      {/* Pagos */}
      {activeTab === 'pagos' && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Ver todos tus pagos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {compras.length === 0 ? (
              <p className="text-gray-500">No hay compras registradas.</p>
            ) : (
              <div className="space-y-3">
                {compras.map((compra) => (
                  <Card key={compra.id} className="p-4 bg-gray-50">
                    <p className="font-semibold">Lote {compra.numero_lote}</p>
                    <p className="text-sm text-gray-600">
                      Saldo Pendiente: ${compra.saldo_pendiente?.toLocaleString('es-CO') || '0'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Pagado: ${compra.total_pagado?.toLocaleString('es-CO') || '0'}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Perfil */}
      {activeTab === 'perfil' && (
        <Card>
          <CardHeader>
            <CardTitle>Informacion de Perfil</CardTitle>
            <CardDescription>Tus datos personales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Correo</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            {profile && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-semibold">{profile.nombre_completo || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefono</p>
                  <p className="font-semibold">{profile.telefono || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ciudad</p>
                  <p className="font-semibold">{profile.ciudad || 'No especificado'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
