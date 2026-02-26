import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const CYAN_CLASS = "text-[hsl(192,85%,50%)]";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Sobre() {
  const [, setLocation] = useLocation();

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/settings/about"],
    queryFn: async () => {
      const res = await fetch("/api/settings/about");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const title = settings?.about_title || "Nossa Historia";
  const content = settings?.about_content || "";
  const image1 = settings?.about_image_1 || "";
  const image2 = settings?.about_image_2 || "";
  const image3 = settings?.about_image_3 || "";
  const images = [image1, image2, image3].filter(Boolean);
  const hasContent = content || images.length > 0;

  return (
    <div className="bg-[#0a0e17] min-h-screen text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white mb-8"
          data-testid="button-back-home"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar
        </Button>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-sobre">
            <BookOpen className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
            <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Sobre Nos</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-bold text-white mb-4" data-testid="text-sobre-title">
            {title}
          </motion.h1>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
            <div className="h-64 bg-white/[0.03] rounded-lg" />
          </div>
        ) : hasContent ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {images.length > 0 && (
              <motion.div
                variants={fadeInUp}
                custom={2}
                className={`grid gap-4 mb-12 ${images.length === 1 ? "max-w-2xl mx-auto" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}
              >
                {images.map((img, idx) => (
                  <div key={idx} className={`rounded-lg overflow-hidden ${images.length === 3 && idx === 0 ? "col-span-2 md:col-span-1" : ""}`}>
                    <img
                      src={img}
                      alt={`Sobre Corb3D ${idx + 1}`}
                      className="w-full h-64 object-cover"
                      data-testid={`img-about-${idx}`}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {content && (
              <motion.div variants={fadeInUp} custom={3} className="max-w-3xl mx-auto">
                <div className="prose prose-invert max-w-none">
                  {content.split("\n").map((paragraph, idx) => (
                    paragraph.trim() ? (
                      <p key={idx} className="text-white/70 leading-relaxed text-lg mb-6" data-testid={`text-about-paragraph-${idx}`}>
                        {paragraph}
                      </p>
                    ) : null
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 border border-dashed border-white/10 rounded-lg"
            data-testid="about-coming-soon"
          >
            <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/40 mb-2">Em breve</h3>
            <p className="text-sm text-white/30 max-w-md mx-auto">
              Estamos preparando o conteudo da nossa historia. Volte em breve para conhecer mais sobre a Corb3D.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
