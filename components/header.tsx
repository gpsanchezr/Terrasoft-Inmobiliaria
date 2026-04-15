'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      // obtener sesión existente
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        setUser(data.session.user);
        
        // Obtener el nombre de usuario del perfil
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', data.session.user.id)
          .single();
        
        if (profile?.full_name) {
          setUsername(profile.full_name);
        }
      }
      setLoading(false);
    };

    initUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Obtener el nombre de usuario del perfil
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.full_name) {
          setUsername(profile.full_name);
        }
      } else {
        setUser(null);
        setUsername(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername(null);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <header className="border-b bg-white/90 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50 notranslate shadow-lg">
        <div className="flex items-center gap-3">
          <div className="font-bold text-3xl text-[#808080]">MonteVerde</div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white/90 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50 notranslate shadow-lg">
      {/* Logo y Sello - Izquierda */}
      <div className="flex items-center gap-3">
        <Link href="/" className="font-bold text-3xl text-bolivar-verde hover:text-bolivar-amarillo transition duration-300 notranslate">
          MonteVerde
        </Link>
        
        {/* Sello de Bolívar - Discreto */}
        <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-300">
          <Shield className="w-4 h-4 text-bolivar-verde" />
          <span className="text-xs text-gray-600 font-semibold notranslate">Respaldo Aseguradora Bolívar</span>
        </div>

      </div>

      {/* Navegación - Derecha */}
      <nav className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {/* Botón PQRS */}
            <Link href="#pqrs" className="notranslate">
              <button className="px-4 py-2 text-sm font-semibold border-2 border-bolivar-verde text-bolivar-verde rounded-lg hover:bg-bolivar-verde hover:text-white transition-all duration-300">
                Atención al Cliente (PQRS)
              </button>
            </Link>
            
            {/* Nombre de Usuario */}
            <span className="text-sm font-semibold text-bolivar-verde bg-bolivar-verde/10 px-3 py-2 rounded-lg">
              👤 {username || user.email}
            </span>
            
            <Link href="/mi-cuenta" className="text-sm text-blue-600 hover:underline font-medium">
              Mi Cuenta
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Botón PQRS */}
            <Link href="#pqrs" className="notranslate">
              <button className="px-4 py-2 text-sm font-semibold border-2 border-bolivar-verde text-bolivar-verde rounded-lg hover:bg-bolivar-verde hover:text-white transition-all duration-300">
                Atención al Cliente (PQRS)
              </button>
            </Link>

            {/* Botón Login */}
            <Link href="/login" className="notranslate">
              <button className="px-4 py-2 text-sm font-semibold border-2 border-bolivar-amarillo text-bolivar-amarillo rounded-lg hover:bg-bolivar-amarillo hover:text-white transition-all duration-300">
                INICIO DE CESSION
              </button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
