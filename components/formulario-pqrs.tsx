'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import { CheckCircle2, AlertCircle } from 'lucide-react';

type TipoPQRS = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';

export function FormularioPQRS() {
  const [formData, setFormData] = useState({
    tipo: 'reclamo' as TipoPQRS,
    asunto: '',
    descripcion: '',
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user?.id || null,
        }),
      });

      if (response.ok) {
        setMensaje({
          tipo: 'success',
          texto: '✅ Tu PQRS ha sido registrada correctamente. Nos pondremos en contacto pronto a través de tu correo o teléfono.',
        });
        setFormData({ tipo: 'reclamo', asunto: '', descripcion: '' });
        setTimeout(() => setMensaje(null), 5000);
      } else {
        setMensaje({
          tipo: 'error',
          texto: '❌ Error al enviar. Por favor, intenta nuevamente.',
        });
      }
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: '❌ Error de conexión. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl notranslate">
      <CardHeader>
        <CardTitle>Enviar PQRS</CardTitle>
        <CardDescription>
          Peticiones, Quejas, Reclamos o Sugerencias - Tu voz importa en MonteVerde
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de PQRS */}
          <div>
            <Label htmlFor="tipo">Tipo de Solicitud</Label>
            <Select value={formData.tipo} onValueChange={(value) => 
              setFormData({ ...formData, tipo: value as TipoPQRS })
            }>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peticion">Petición - Solicitud de acción</SelectItem>
                <SelectItem value="queja">Queja - Insatisfacción con el servicio</SelectItem>
                <SelectItem value="reclamo">Reclamo - Protesta formal</SelectItem>
                <SelectItem value="sugerencia">Sugerencia - Recomendación de mejora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Asunto */}
          <div>
            <Label htmlFor="asunto">Asunto</Label>
            <Input
              id="asunto"
              placeholder="Brevemente, ¿cuál es tu solicitud?"
              value={formData.asunto}
              onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
              required
              className="notranslate"
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción detallada</Label>
            <Textarea
              id="descripcion"
              placeholder="Cuéntanos con detalle lo que quieres comunicarnos..."
              rows={6}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
              className="notranslate"
            />
          </div>

          {/* Estado de usuario */}
          {user ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">✓ Conectado como: <strong>{user.email}</strong></p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900">Enviarás tu PQRS como usuario anónimo</p>
            </div>
          )}

          {/* Mensaje de estado */}
          {mensaje && (
            <Alert className={mensaje.tipo === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              {mensaje.tipo === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={mensaje.tipo === 'success' ? 'text-green-800' : 'text-red-800'}>
                {mensaje.texto}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón submit */}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo hover:from-bolivar-verde/90 hover:to-bolivar-amarillo/90 font-bold">
            {loading ? 'Enviando...' : '✓ Enviar PQRS'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Promedio de respuesta: 24-48 horas hábiles
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
