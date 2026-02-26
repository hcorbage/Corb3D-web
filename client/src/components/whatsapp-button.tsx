import { useQuery } from "@tanstack/react-query";
import { Headphones } from "lucide-react";

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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 group"
      title="Fale conosco pelo WhatsApp"
      data-testid="button-whatsapp-float"
    >
      <Headphones className="w-5 h-5 text-white" />
      <span className="text-sm font-semibold text-white">Fale conosco</span>
    </a>
  );
}
