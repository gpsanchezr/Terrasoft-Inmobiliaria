'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Menu, X, Home, FileText, DollarSign, Inbox, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarCliente() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: FileText, label: 'Mis Lotes', href: '/mi-cuenta' },
    { icon: DollarSign, label: 'Pagos', href: '/mi-cuenta#pagos' },
    { icon: Inbox, label: 'PQRS', href: '/pqrs' },
    { icon: User, label: 'Perfil', href: '/mi-cuenta#perfil' }
  ];

  return (
    <>
      {/* Botón hamburguesa - visible en móvil */}
      <div className="md:hidden fixed bottom-4 right-4 z-40 notranslate">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-screen w-64 bg-blue-50 border-r border-gray-200 p-4 transform transition-transform duration-300 z-30 md:translate-x-0 notranslate ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors"
                >
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay para cerrar sidebar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
