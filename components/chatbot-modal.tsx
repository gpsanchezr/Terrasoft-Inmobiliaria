'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isLink?: boolean }>>([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simular que aparecen los mensajes con delay
      setTimeout(() => {
        setMessages([
          { id: 1, text: '¡Hola! Aquí tienes nuestros datos de contacto:' },
          { id: 2, text: '🏠 Dirección Local: Calle Principal 123, Oficina 456' },
          { id: 3, text: '📧 Correo: contacto@monteverde.com' },
          { id: 4, text: '📱 WhatsApp: +57 300 123 4567', isLink: true },
        ]);
      }, 300);
    }
  }, [isOpen, messages.length]);

  if (!isOpen) return null;

  const whatsappNumber = '+573001234567'; // Número de WhatsApp en formato internacional
  const whatsappMessage = 'Hola, quisiera más información sobre MonteVerde Reserva Inmobiliaria';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 bg-black/50 notranslate z-50 flex items-end justify-end p-4">
      {/* Modal Chatbot */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-96 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold">Atención al Cliente</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message animate-in fade-in duration-500">
              {msg.isLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-bolivar-verde/10 text-bolivar-verde p-3 rounded-lg hover:bg-bolivar-verde/20 transition-colors font-medium"
                >
                  {msg.text}
                </a>
              ) : (
                <div className="bg-blue-100 text-slate-800 p-3 rounded-lg text-sm leading-relaxed">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t p-3">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-bolivar-verde to-bolivar-amarillo text-white hover:shadow-lg"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
