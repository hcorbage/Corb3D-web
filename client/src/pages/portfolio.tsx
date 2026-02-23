import { motion } from "framer-motion";
import { ArrowLeft, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

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

const placeholderProjects = [
  { id: 1, title: "Em breve", category: "Portfolio" },
  { id: 2, title: "Em breve", category: "Portfolio" },
  { id: 3, title: "Em breve", category: "Portfolio" },
  { id: 4, title: "Em breve", category: "Portfolio" },
  { id: 5, title: "Em breve", category: "Portfolio" },
  { id: 6, title: "Em breve", category: "Portfolio" },
];

export default function Portfolio() {
  const [, setLocation] = useLocation();
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

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {placeholderProjects.map((project, i) => (
            <motion.div key={project.id} variants={fadeInUp} custom={i}>
              <Card
                className="bg-white/[0.03] border-white/[0.06] overflow-hidden hover-elevate group"
                data-testid={`card-project-${project.id}`}
              >
                <div className="aspect-[4/3] bg-white/[0.02] flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-xs text-white/20">Foto do projeto</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[hsl(192,85%,50%)]/60 mb-1">{project.category}</p>
                  <h3 className="text-sm font-semibold text-white/40" data-testid={`text-project-title-${project.id}`}>
                    {project.title}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 py-12 border border-dashed border-white/10 rounded-lg"
          data-testid="portfolio-coming-soon"
        >
          <Image className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/40 mb-2">Portfolio em Construcao</h3>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            Estamos preparando fotos dos nossos melhores projetos. Em breve voce podera conferir todo o nosso trabalho aqui.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
