'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useParams } from 'next/navigation';

interface Lote {
  id: number;
  numero_lote: string;
  etapa: string;
  area_m2: number;
  ubicacion: string;
  valor_total: number;
  estado: string;
  descripcion?: string;
  imagen_url?: string;
}

export default function LoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    fetch(`/api/lotes?estado=disponible`).then(r => r.json()).then((data) => {
      const found = (data || []).find((l: any) => l.id.toString() === id.toString());
      setLote(found || null);
      setLoading(false);
    });
  }, [params]);

  const handleComprar = async () => {
    if (!user || !lote) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch('/api/compras/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, lote_id: lote.id })
      });
      const body = await res.json();
      if (res.ok) {
        setMensaje('Compra registrada correctamente. Ve a "Mi Cuenta" para ver tu estado.');
      } else {
        setMensaje('Error al realizar compra: ' + (body.error || '')); 
      }
    } catch (err) {
      setMensaje('Error de conexión');
    }
  };

  if (loading) {
    return <div className="p-8">Cargando lote...</div>;
  }

  if (!lote) {
    return <div className="p-8">Lote no encontrado</div>;
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Lote {lote.numero_lote}</CardTitle>
          <CardDescription>{lote.etapa}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Área: {lote.area_m2} m²</p>
          <p>Ubicación: {lote.ubicacion}</p>
          <p>Valor: ${lote.valor_total.toLocaleString('es-CO')}</p>
          <p>Estado: {lote.estado}</p>
          {mensaje && <p className="text-green-600">{mensaje}</p>}
          <Button
            onClick={handleComprar}
            disabled={lote.estado !== 'disponible'}
          >
            {lote.estado === 'disponible' ? 'Comprar este lote' : 'No disponible'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
