import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const { data } = useQuery<{ whatsappNumber: string }>({
    queryKey: ["/api/settings/whatsapp"],
  });

  const number = data?.whatsappNumber;
  if (!number) return null;

  const cleanNumber = number.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all hover:scale-110 group"
      title="Fale conosco pelo WhatsApp"
      data-testid="button-whatsapp-float"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 3.2C9.044 3.2 3.4 8.844 3.4 15.804c0 2.22.58 4.392 1.684 6.308L3.2 28.8l6.888-1.808a12.53 12.53 0 006.916 2.012h.004c6.96 0 12.596-5.644 12.596-12.604 0-3.368-1.308-6.532-3.684-8.912A12.52 12.52 0 0016.004 3.2zm0 23.044a10.37 10.37 0 01-5.576-1.616l-.4-.236-4.148 1.088 1.108-4.048-.26-.412a10.38 10.38 0 01-1.592-5.52c0-5.772 4.696-10.468 10.472-10.468a10.4 10.4 0 017.404 3.068 10.4 10.4 0 013.064 7.404c0 5.776-4.7 10.472-10.472 10.472v-.032zm5.74-7.84c-.316-.156-1.86-.916-2.148-1.02-.288-.108-.496-.156-.708.156-.208.316-.816 1.02-.996 1.228-.184.208-.364.236-.68.08-.316-.156-1.332-.492-2.54-1.568-.94-.836-1.572-1.872-1.756-2.188-.184-.316-.02-.488.14-.644.14-.14.316-.364.472-.548.16-.184.208-.316.316-.524.104-.208.052-.392-.028-.548-.08-.156-.708-1.708-.972-2.34-.256-.612-.516-.528-.708-.54h-.604c-.208 0-.548.08-.836.392-.288.316-1.1 1.076-1.1 2.62s1.128 3.04 1.284 3.248c.156.208 2.22 3.388 5.38 4.752.752.324 1.34.516 1.796.66.756.24 1.444.208 1.988.128.608-.092 1.86-.76 2.124-1.496.26-.736.26-1.368.184-1.496-.08-.132-.288-.212-.604-.372z"/>
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
    </a>
  );
}
