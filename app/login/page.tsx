'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isRegister) {
      // Validar que username no esté vacío en registro
      if (!username.trim()) {
        setError('Por favor ingresa un nombre de usuario');
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Guardar el perfil del usuario con el nombre de usuario
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: username,
            role: 'cliente',
          });

        if (profileError) {
          setError('Error al guardar el perfil: ' + profileError.message);
          setLoading(false);
          return;
        }
      }

      // Limpiar formulario y redirigir
      setEmail('');
      setPassword('');
      setUsername('');
      router.push('/');
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bolivar-verde/10 to-bolivar-amarillo/10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo text-white rounded-t-lg">
          <CardTitle>{isRegister ? 'Registrarse en MonteVerde' : 'Iniciar Sesión'}</CardTitle>
          <CardDescription className="text-bolivar-amarillo">
            {isRegister ? 'Crea una cuenta nueva' : 'Ingresa tu correo y contraseña'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-300">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isRegister}
                  className="border-bolivar-verde/30 focus:border-bolivar-verde"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-bolivar-verde/30 focus:border-bolivar-verde"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-bolivar-verde/30 focus:border-bolivar-verde"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo hover:from-bolivar-verde/90 hover:to-bolivar-amarillo/90 font-bold"
              disabled={loading}
            >
              {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
            </Button>
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm text-bolivar-verde hover:text-bolivar-verde/80 hover:underline font-medium"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setError(null);
                }}
              >
                {isRegister
                  ? '¿Ya tienes una cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
