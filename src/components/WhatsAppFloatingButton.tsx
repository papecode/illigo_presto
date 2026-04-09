import { MessageCircle } from 'lucide-react';

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/221770000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-card" fill="currentColor" />
    </a>
  );
}
