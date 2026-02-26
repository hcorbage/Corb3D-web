import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ArrowRight, Lock } from "lucide-react";
import { SiInstagram } from "react-icons/si";
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0e17]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3" data-testid="navbar-brand">
          <img src="/images/corb3d-robot-cropped.png" alt="Corb3D" className="h-12 w-12 object-contain" data-testid="img-logo-icon" />
          <span className="text-3xl font-bold tracking-tight text-white" data-testid="text-brand-name">
            CORB<span className={CYAN_CLASS}>3D</span>
          </span>
        </a>
        <a href="/">
          <Button variant="default" size="sm" data-testid="button-voltar-nav">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao Inicio
          </Button>
        </a>
      </div>
    </motion.nav>
  );
}

function Footer() {
  return (
    <footer className="py-10 bg-[#060a12] border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3" data-testid="footer-brand">
            <img src="/images/corb3d-robot-cropped.png" alt="Corb3D" className="h-10 w-10 object-contain opacity-60" data-testid="img-footer-logo" />
            <span className="text-sm font-semibold text-white/60" data-testid="text-footer-brand">
              CORB<span className={CYAN_CLASS}>3D</span>
            </span>
          </div>
          <p className="text-xs text-white/50" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} Corb3D. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="https://instagram.com/corb3d_br" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors" data-testid="link-instagram">
              <SiInstagram className="w-4 h-4" />
              <span className="text-xs">@corb3d_br</span>
            </a>
            <a href="/admin" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors" data-testid="link-admin">
              <Lock className="w-3 h-3" />
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      <Navbar />

      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/bg-about.png" alt="" className="w-full h-full object-cover opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-transparent to-[#0a0e17]" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(192,85%,48%)]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[hsl(210,85%,45%)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
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
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              {images.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  custom={2}
                  className={`grid gap-4 mb-14 ${images.length === 1 ? "max-w-2xl mx-auto" : images.length === 2 ? "grid-cols-2 max-w-4xl mx-auto" : "grid-cols-3"}`}
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/40 group">
                      <img
                        src={img}
                        alt={`Sobre Corb3D ${idx + 1}`}
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                        data-testid={`img-about-${idx}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ))}
                </motion.div>
              )}

              {content && (
                <motion.div variants={fadeInUp} custom={3} className="max-w-3xl mx-auto">
                  {content.split("\n").map((paragraph, idx) => (
                    paragraph.trim() ? (
                      <p key={idx} className="text-white/65 leading-relaxed text-lg mb-6" data-testid={`text-about-paragraph-${idx}`}>
                        {paragraph}
                      </p>
                    ) : null
                  ))}
                </motion.div>
              )}

              <motion.div variants={fadeInUp} custom={4} className="text-center mt-12">
                <Button className="font-semibold" data-testid="button-contato-sobre" onClick={() => setLocation("/")}>
                  Fale Conosco
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.01]"
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
      </section>

      <Footer />
    </div>
  );
}
