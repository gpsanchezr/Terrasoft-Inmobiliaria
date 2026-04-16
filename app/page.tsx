'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoteCard } from '@/components/lote-card';
import { EtapasTimeline } from '@/components/etapas-timeline';
import { ChatbotModal } from '@/components/chatbot-modal';
import { FormularioPQRS } from '@/components/formulario-pqrs';
import { MapPin, TrendingUp, Users, Shield, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

interface Lote {
  id: number;
  numero_lote: string;
  etapa: string;
  area_m2: number;
  ubicacion: string;
  valor_total: number;
  estado: 'disponible' | 'reservado' | 'vendido';
  descripcion?: string;
}

export const dynamic = 'force-dynamic';

export default function Home() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEtapa, setFiltroEtapa] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const params = new URLSearchParams();
        params.append('estado', 'disponible');
        if (filtroEtapa) params.append('etapa', filtroEtapa);

        const response = await fetch(`/api/lotes?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setLotes(data || []);
      } catch (error) {
        console.error('Error fetching lotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLotes();
  }, [filtroEtapa]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage(null);
    setRegisterLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      setRegisterMessage({
        type: 'success',
        text: '¡Usuario registrado exitosamente! Revisa tu email para confirmar la cuenta.',
      });

      setRegisterForm({
        email: '',
        password: '',
        username: '',
      });

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setRegisterMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error desconocido al registrar usuario',
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
        {/* Logo fijo */}
        <div className="logo-seguros bg-white p-2 rounded-lg shadow-sm border border-emerald-100 flex items-center justify-center w-[120px] h-[40px]">
          <span className="font-bold text-emerald-700 text-sm">Seguros Bolívar</span>
        </div>
        {/* Fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-emerald-50" />
        
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-emerald-900 mb-2 font-[800] drop-shadow-md tracking-tight">
              MonteVerde
            </h1>
            <div className="mt-3 flex justify-center">
              <div className='bg-white p-2 rounded-lg shadow-sm border border-emerald-100 flex items-center justify-center w-40 h-16'>
                <span className='font-bold text-emerald-700'>Seguros Bolívar</span>
              </div>
            </div>
            <p className="text-emerald-800 font-light tracking-widest mt-3 text-xl">RESERVA INMOBILIARIA DE LUJO</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Respaldo Aseguradora Bolívar</p>
          </div>

          <div className="backdrop-blur-md bg-white/80 border border-slate-200 rounded-3xl px-8 md:px-12 py-12 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 border-opacity-50">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Tu Futuro Hogar en el Mejor Proyecto
            </h2>
            <p className="text-lg text-slate-700 mb-8 font-light">
              Invierte en lotes en una comunidad exclusiva con seguridad garantizada y valorización constante
            </p>

            <div className="my-6 py-4 border-t border-b border-slate-200">
              <p className="text-sm text-emerald-700 font-semibold">✓ Respaldo Aseguradora Bolívar</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#catalogo">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-full font-bold text-base shadow-md px-8"
                >
                  Explorar Catálogo
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 hover:shadow-md hover:scale-105 transition-all duration-300 rounded-full font-bold text-base shadow-md px-8"
                >
                  Acceso Clientes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-emerald-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Registro */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-50 to-slate-50">
        <div className="max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
              <CardTitle className="text-center">Regístrate en MonteVerde</CardTitle>
              <CardDescription className="text-center text-emerald-100">
                Crea tu cuenta para acceder a todas las funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 p-8">
              {registerMessage && (
                <Alert className={`mb-4 ${registerMessage.type === 'success' ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {registerMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={registerMessage.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
                      {registerMessage.text}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={registerLoading}
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={registerLoading}
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={registerLoading}
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md hover:shadow-lg transition-all rounded-full"
                  disabled={registerLoading}
                >
                  {registerLoading ? 'Registrando...' : 'Crear cuenta'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900 drop-shadow-md">¿Por qué elegir MonteVerde?</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto text-lg font-light">Más que un proyecto inmobiliario, es tu inversión en futuro</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Mejor Inversión',
                description: 'Valorización garantizada año a año'
              },
              {
                icon: MapPin,
                title: 'Ubicación Premium',
                description: 'Acceso estratégico y conectividad total'
              },
              {
                icon: Shield,
                title: 'Seguridad 24/7',
                description: 'Control de acceso y vigilancia profesional'
              },
              {
                icon: Users,
                title: 'Comunidad Selecta',
                description: 'Hogares para familias de confianza'
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="bg-white border-slate-200 hover:shadow-emerald-100/50 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-emerald-600 mb-3 mx-auto" />
                    <CardTitle className="text-slate-900 text-lg font-bold text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-600 font-light">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <EtapasTimeline />

      <section className="py-8 px-4 bg-amber-100 border-y border-amber-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-amber-900">
            <Gift className="w-10 h-10 text-amber-600" />
            <span>¡Obsequio especial! Recibe gratis los planos habitacionales por tu compra</span>
            <Gift className="w-10 h-10 text-amber-600" />
          </div>
        </div>
      </section>

      <section id="catalogo" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-slate-900 text-center drop-shadow-md">Catálogo de Lotes</h2>
          <p className="text-slate-600 mb-8 text-lg text-center max-w-2xl mx-auto font-light">
            Selecciona el lote perfecto para tu inversión en MonteVerde
          </p>

          <div className="flex gap-3 mb-12 overflow-x-auto pb-2 justify-center">
            <Button
              variant={filtroEtapa === null ? 'default' : 'outline'}
              onClick={() => setFiltroEtapa(null)}
              className="whitespace-nowrap rounded-full"
            >
              Todos
            </Button>
            {['Lanzamiento', 'Preventa', 'Construcción', 'Entrega'].map(etapa => (
              <Button
                key={etapa}
                variant={filtroEtapa === etapa ? 'default' : 'outline'}
                onClick={() => setFiltroEtapa(etapa)}
                className="whitespace-nowrap rounded-full"
              >
                {etapa}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-600 text-xl">Cargando lotes premium...</div>
          ) : lotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lotes.map(lote => (
                <LoteCard
                  key={lote.id}
                  {...lote}
                  onSelect={() => {
                    window.location.href = `/lotes/${lote.id}`;
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-20 bg-slate-50 border-slate-200 shadow-sm max-w-2xl mx-auto">
              <p className="text-slate-600 text-xl font-medium">No hay lotes disponibles en esta etapa</p>
            </Card>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">¿Listo para invertir en tu futuro?</h2>
          <p className="text-emerald-100 mb-8 text-lg font-light">
            Contacta con nuestro equipo de vendedores especializados en MonteVerde
          </p>
          <Button 
            onClick={() => setIsChatbotOpen(true)}
            size="lg" 
            className="bg-white text-emerald-700 hover:bg-slate-100 hover:scale-105 transition-all duration-300 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 px-10">
            Solicitar Información
          </Button>
        </div>
      </section>

      <section id="pqrs" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-center text-slate-900 drop-shadow-md">Peticiones, Quejas, Reclamos y Sugerencias</h2>
          <p className="text-center text-slate-600 mb-12 text-lg font-light">
            Tu opinión es importante para nosotros. Cuéntanos cómo podemos mejorar tu experiencia en MonteVerde
          </p>
          <FormularioPQRS />
        </div>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
