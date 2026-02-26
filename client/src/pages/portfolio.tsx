import { motion } from "framer-motion";
import { ArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";

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

export default function Portfolio() {
  const [, setLocation] = useLocation();

  const { data: items, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const hasItems = items && items.length > 0;

  return (
    <div className="bg-[#0a0e17] min-h-screen text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-portfolio">
            <Image className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
            <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Portfolio</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl md:text-5xl font-bold text-white mb-4" data-testid="text-portfolio-title">
            Nossos Projetos
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="text-white/50 max-w-xl mx-auto text-lg" data-testid="text-portfolio-desc">
            Confira alguns dos projetos que realizamos com qualidade e precisao.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/[0.03] border-white/[0.06] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-white/[0.05]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : hasItems ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, i) => (
              <motion.div key={item.id} variants={fadeInUp} custom={i}>
                <Card
                  className="bg-white/[0.03] border-white/[0.06] overflow-hidden hover-elevate group"
                  data-testid={`card-project-${item.id}`}
                >
                  <div className="aspect-[4/3] bg-white/[0.02] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      data-testid={`img-project-${item.id}`}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[hsl(192,85%,50%)]/60 mb-1">{item.category}</p>
                    <h3 className="text-sm font-semibold text-white/90" data-testid={`text-project-title-${item.id}`}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 border border-dashed border-white/10 rounded-lg"
            data-testid="portfolio-coming-soon"
          >
            <Image className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/40 mb-2">Portfolio em Construcao</h3>
            <p className="text-sm text-white/30 max-w-md mx-auto">
              Estamos preparando fotos dos nossos melhores projetos. Em breve voce podera conferir todo o nosso trabalho aqui.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
