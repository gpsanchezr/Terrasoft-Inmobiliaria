'use client';

import Image from 'next/image';
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

export default function Home() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEtapa, setFiltroEtapa] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Estado para formulario de registro
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

  // Función para manejar registro con finally para asegurar que loading se desactive
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

      // Registro exitoso
      setRegisterMessage({
        type: 'success',
        text: '¡Usuario registrado exitosamente! Revisa tu email para confirmar la cuenta.',
      });

      // Limpiar formulario
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
      // Este bloque finally asegura que loading se desactive SIEMPRE,
      // independientemente de si el registro fue exitoso o falló
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bolivar-verde/10 via-bolivar-amarillo/10 to-white notranslate">
      {/* Hero Section - Lujo MonteVerde */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
        {/* Logo fijo de Seguros Bolívar */}
        <Image
          src="/images/seguros-bolivar-logo.png"
          alt="Seguros Bolívar"
          width={120}
          height={40}
          className="logo-seguros"
          priority
        />
        {/* Fondo Gradiente Premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-bolivar-verde via-bolivar-amarillo to-bolivar-verde opacity-90" />
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-bolivar-verde rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-bolivar-amarillo rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-bolivar-verde rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />

        {/* Contenido Central - Glassmorphism Card */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          {/* Logo Superior */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bolivar-verde via-bolivar-amarillo to-bolivar-verde mb-2">
              MonteVerde
            </h1>
            <div className="mt-3 flex justify-center">
              <Image
                src="/images/seguros-bolivar-seeklogo.png"
                alt="Seguros Bolívar"
                width={180}
                height={54}
                className="rounded-lg border-2 border-bolivar-amarillo/70"
              />
            </div>
            <p className="text-bolivar-verde font-light tracking-widest mt-3">RESERVA INMOBILIARIA DE LUJO</p>
            <p className="text-xs text-bolivar-amarillo/80 mt-1 font-medium">Respaldo Aseguradora Bolívar</p>
          </div>

          {/* Glassmorphism Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl px-8 md:px-12 py-12 shadow-2xl hover:shadow-bolivar-verde/20 transition-all duration-500">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Tu Futuro Hogar en el Mejor Proyecto
            </h2>
            <p className="text-lg text-bolivar-verde mb-8 font-light">
              Invierte en lotes en una comunidad exclusiva con seguridad garantizada y valorización constante
            </p>

            {/* Respaldo Logo */}
            <div className="my-6 py-4 border-t border-b border-white/20">
              <p className="text-sm text-bolivar-verde font-semibold">✓ Respaldo Aseguradora Bolívar</p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#catalogo">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo text-white hover:shadow-bolivar-verde/50 hover:shadow-lg font-bold text-base"
                >
                  Explorar Catálogo
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white/20 border border-white/50 text-white hover:bg-white/30 hover:border-white/70 font-bold text-base transition-all duration-300"
                >
                  Acceso Clientes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-bolivar-amarillo">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Sección de Registro Rápido */}
      <section className="py-16 px-4 bg-gradient-to-r from-bolivar-verde/10 to-bolivar-amarillo/10 notranslate">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo text-white rounded-t-lg">
              <CardTitle className="text-center">Regístrate en MonteVerde</CardTitle>
              <CardDescription className="text-center text-bolivar-amarillo/80">
                Crea tu cuenta para acceder a todas las funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {registerMessage && (
                <Alert className={`mb-4 ${registerMessage.type === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-2">
                    {registerMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={registerMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
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
                    className="border-bolivar-verde/30 focus:border-bolivar-verde"
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
                    className="border-bolivar-verde/30 focus:border-bolivar-verde"
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
                    className="border-bolivar-verde/30 focus:border-bolivar-verde"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-bolivar-verde hover:bg-bolivar-verde/90 font-bold"
                  disabled={registerLoading}
                >
                  {registerLoading ? 'Registrando...' : 'Crear cuenta'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-bolivar-verde hover:text-bolivar-verde/80 font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">¿Por qué elegir MonteVerde?</h2>
          <p className="text-center text-bolivar-verde/80 mb-12 max-w-2xl mx-auto text-lg">Más que un proyecto inmobiliario, es tu inversión en futuro</p>
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
                <Card key={i} className="bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  <CardHeader>
                    <Icon className="w-10 h-10 text-bolivar-verde mb-3" />
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-bolivar-verde/70 font-light">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Etapas del Proyecto - Mejorado */}
      <EtapasTimeline />

      {/* Banner Regalo */}
      <section className="py-8 px-4 bg-amber-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-bold text-amber-900">
            <Gift className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
            <span>¡Obsequio especial! Recibe gratis los planos habitacionales por tu compra</span>
            <Gift className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
          </div>
        </div>
      </section>

      {/* Lotes Disponibles */}
      <section id="catalogo" className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 notranslate">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-slate-900">Catálogo de Lotes</h2>
          <p className="text-gray-600 mb-8 text-lg">Selecciona el lote perfecto para tu inversión en MonteVerde</p>

          {/* Filtros */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2 notranslate">
            <Button
              variant={filtroEtapa === null ? 'default' : 'outline'}
              onClick={() => setFiltroEtapa(null)}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            {['Lanzamiento', 'Preventa', 'Construcción', 'Entrega'].map(etapa => (
              <Button
                key={etapa}
                variant={filtroEtapa === etapa ? 'default' : 'outline'}
                onClick={() => setFiltroEtapa(etapa)}
                className="whitespace-nowrap"
              >
                {etapa}
              </Button>
            ))}
          </div>

          {/* Grid de Lotes */}
          {loading ? (
            <div className="text-center py-12 text-gray-600 text-lg">Cargando lotes premium...</div>
          ) : lotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 notranslate">
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
            <Card className="text-center py-12 bg-blue-50">
              <p className="text-gray-600 text-lg">No hay lotes disponibles en esta etapa</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-bolivar-verde to-bolivar-verde/80 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para invertir en tu futuro?</h2>
          <p className="text-bolivar-verde/70 mb-8 text-lg font-light">
            Contacta con nuestro equipo de vendedores especializados en MonteVerde
          </p>
          <Button 
            onClick={() => setIsChatbotOpen(true)}
            size="lg" 
            className="bg-bolivar-verde hover:bg-bolivar-verde/90 font-bold text-base">
            Solicitar Información
          </Button>
        </div>
      </section>

      {/* Sección PQRS - Con ID para navegación suave */}
      <section id="pqrs" className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white notranslate scroll-smooth">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-center text-slate-900">Peticiones, Quejas, Reclamos y Sugerencias</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Tu opinión es importante para nosotros. Cuéntanos cómo podemos mejorar tu experiencia en MonteVerde
          </p>
          <FormularioPQRS />
        </div>
      </section>

      {/* Chatbot Modal */}
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
