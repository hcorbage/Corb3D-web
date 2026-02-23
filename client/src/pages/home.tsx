import { motion } from "framer-motion";
import { Printer, Layers, Shield, Zap, ArrowRight, ChevronDown, Box, Settings, Award, Clock, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

const CYAN = "hsl(192 85% 50%)";
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
  visible: { transition: { staggerChildren: 0.12 } },
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
        <div className="flex items-center gap-3" data-testid="navbar-brand">
          <img
            src="/images/corb3d-icon-v3.png"
            alt="Corb3D"
            className="h-12 w-12 object-contain"
            data-testid="img-logo-icon"
          />
          <span className="text-3xl font-bold tracking-tight text-white" data-testid="text-brand-name">
            CORB<span className={CYAN_CLASS}>3D</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#servicos" className="text-sm text-white/70" data-testid="link-servicos">
            Servicos
          </a>
          <a href="#sobre" className="text-sm text-white/70" data-testid="link-sobre">
            Sobre
          </a>
          <a href="#diferenciais" className="text-sm text-white/70" data-testid="link-diferenciais">
            Diferenciais
          </a>
          <a href="#contato" className="text-sm text-white/70" data-testid="link-contato">
            Contato
          </a>
        </div>
        <Button variant="default" size="sm" data-testid="button-orcamento-nav">
          Solicitar Orcamento
        </Button>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg-v2.png"
          alt=""
          className="w-full h-full object-cover"
          data-testid="img-hero-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/60 via-[#0a0e17]/40 to-[#0a0e17]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(192,85%,48%)]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(210,85%,45%)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} custom={0}>
            <div className="flex flex-col items-center gap-4">
              <img
                src="/images/corb3d-icon-v3.png"
                alt="Corb3D Icon"
                className="h-32 md:h-44 object-contain drop-shadow-2xl"
                data-testid="img-hero-icon"
              />
              <span className="text-4xl md:text-5xl font-bold tracking-widest text-white drop-shadow-2xl" data-testid="img-hero-logo">
                CORB<span className={CYAN_CLASS}>3D</span>
              </span>
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            custom={1}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            Transformamos suas ideias em realidade com{" "}
            <span className={`${CYAN_CLASS} font-semibold`}>precisao</span>,{" "}
            <span className={`${CYAN_CLASS} font-semibold`}>qualidade</span> e{" "}
            <span className={`${CYAN_CLASS} font-semibold`}>compromisso</span>.
            Impressao 3D profissional para projetos que exigem excelencia.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            custom={2}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="font-bold text-base px-8"
              data-testid="button-orcamento-hero"
            >
              Solicitar Orcamento
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white bg-white/5 backdrop-blur-sm font-semibold text-base px-8"
              data-testid="button-portfolio"
            >
              Ver Portfolio
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            custom={3}
            className="flex items-center justify-center gap-8 pt-8 flex-wrap"
          >
            {[
              { value: "500+", label: "Projetos Entregues" },
              { value: "99%", label: "Satisfacao" },
              { value: "24h", label: "Resposta Rapida" },
            ].map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          data-testid="icon-scroll-down"
        >
          <ChevronDown className="w-6 h-6 text-white/30 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: Printer,
      title: "Impressao FDM",
      description:
        "Impressao 3D em alta resolucao com materiais como PLA, PETG e ABS. Ideal para prototipos funcionais e pecas de producao.",
    },
    {
      icon: Layers,
      title: "Impressao em Resina",
      description:
        "Acabamento ultra fino com resina SLA/DLP. Perfeito para modelos detalhados, joalheria e aplicacoes dentarias.",
      comingSoon: true,
    },
    {
      icon: Box,
      title: "Modelagem 3D",
      description:
        "Criamos ou adaptamos seu modelo 3D para garantir a melhor qualidade de impressao e otimizacao de material.",
    },
    {
      icon: ScanLine,
      title: "Escaneamento 3D",
      description:
        "Digitalizacao precisa de objetos fisicos para criacao de modelos 3D. Ideal para engenharia reversa e replicacao de pecas.",
    },
    {
      icon: Settings,
      title: "Pos-Processamento",
      description:
        "Lixamento, pintura, acetona smoothing e acabamentos profissionais para resultados impecaveis.",
    },
  ];

  return (
    <section id="servicos" className="py-24 bg-[#0a0e17] relative" data-testid="section-servicos">
      <div className="absolute inset-0 pointer-events-none">
        <img src="/images/bg-services.png" alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-transparent to-[#0a0e17]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-servicos">
            <Printer className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
            <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Nossos Servicos</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-servicos-title">
            Solucoes Completas em Impressao 3D
          </motion.h2>
          <motion.p variants={fadeInUp} custom={2} className="text-white/50 max-w-xl mx-auto" data-testid="text-servicos-desc">
            Da ideia ao produto final, oferecemos todo o suporte que voce precisa.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <motion.div key={service.title} variants={fadeInUp} custom={i}>
              <Card
                className={`bg-white/[0.03] border-white/[0.06] p-6 h-full hover-elevate relative ${service.comingSoon ? "opacity-70" : ""}`}
                data-testid={`card-service-${i}`}
              >
                {service.comingSoon && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-[hsl(192,85%,48%)]/15 text-[hsl(192,85%,50%)] px-2.5 py-1 rounded-full border border-[hsl(192,85%,48%)]/20" data-testid={`badge-coming-soon-${i}`}>
                    Em Breve
                  </span>
                )}
                <div className="w-12 h-12 rounded-md bg-[hsl(192,85%,48%)]/10 flex items-center justify-center mb-5">
                  <service.icon className={`w-6 h-6 ${CYAN_CLASS}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3" data-testid={`text-service-title-${i}`}>
                  {service.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed" data-testid={`text-service-desc-${i}`}>
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="sobre" className="py-24 bg-[#080c14] relative" data-testid="section-sobre">
      <div className="absolute inset-0 pointer-events-none">
        <img src="/images/bg-about.png" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14] via-transparent to-[#080c14]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-sobre">
              <Award className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
              <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Sobre Nos</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mb-6" data-testid="text-sobre-title">
              Excelencia em Cada Camada
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2} className="text-white/60 leading-relaxed mb-6" data-testid="text-sobre-p1">
              A Corb3D nasceu da paixao por tecnologia e pela busca constante de qualidade.
              Somos especializados em impressao 3D profissional, atendendo desde prototipagem
              rapida ate producao em serie com os mais altos padroes de qualidade.
            </motion.p>
            <motion.p variants={fadeInUp} custom={3} className="text-white/60 leading-relaxed mb-8" data-testid="text-sobre-p2">
              Nossa equipe combina conhecimento tecnico avancado com atendimento personalizado,
              garantindo que cada projeto seja tratado com a dedicacao e o profissionalismo que
              merece.
            </motion.p>
            <motion.div variants={fadeInUp} custom={4}>
              <Button className="font-semibold" data-testid="button-conheca-mais">
                Conheca Nossa Historia
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} custom={2} className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, title: "Qualidade Garantida", desc: "Controle rigoroso em cada impressao" },
              { icon: Clock, title: "Prazos Cumpridos", desc: "Entrega pontual sempre" },
              { icon: Zap, title: "Tecnologia de Ponta", desc: "Equipamentos de ultima geracao" },
              { icon: Award, title: "Suporte Dedicado", desc: "Acompanhamento personalizado" },
            ].map((item, i) => (
              <Card
                key={item.title}
                className="bg-white/[0.03] border-white/[0.06] p-5 hover-elevate"
                data-testid={`card-about-${i}`}
              >
                <item.icon className={`w-8 h-8 ${CYAN_CLASS} mb-3`} />
                <h4 className="text-sm font-semibold text-white mb-1" data-testid={`text-about-title-${i}`}>{item.title}</h4>
                <p className="text-xs text-white/40" data-testid={`text-about-desc-${i}`}>{item.desc}</p>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DifferentialsSection() {
  const items = [
    {
      number: "01",
      title: "Precisao Milimetrica",
      description: "Impressoras calibradas e mantidas para garantir tolerancias apertadas e encaixes perfeitos em cada peca.",
    },
    {
      number: "02",
      title: "Materiais Premium",
      description: "Utilizamos apenas filamentos e resinas de primeira linha, certificados para aplicacoes profissionais.",
    },
    {
      number: "03",
      title: "Atendimento Especializado",
      description: "Consultoria tecnica em cada etapa do projeto, desde a concepcao ate a entrega final.",
    },
    {
      number: "04",
      title: "Entrega Expressa",
      description: "Opcoes de producao acelerada para projetos urgentes sem comprometer a qualidade.",
    },
  ];

  return (
    <section id="diferenciais" className="py-24 bg-[#0a0e17] relative" data-testid="section-diferenciais">
      <div className="absolute inset-0 pointer-events-none">
        <img src="/images/bg-differentials.png" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-transparent to-[#0a0e17]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-diferenciais">
            <Zap className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
            <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Diferenciais</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-diferenciais-title">
            Por Que Escolher a Corb3D?
          </motion.h2>
          <motion.p variants={fadeInUp} custom={2} className="text-white/50 max-w-xl mx-auto" data-testid="text-diferenciais-desc">
            Compromisso com resultados excepcionais em cada projeto.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="space-y-4"
        >
          {items.map((item, i) => (
            <motion.div key={item.number} variants={fadeInUp} custom={i}>
              <div
                className="flex items-start gap-6 p-6 rounded-md bg-white/[0.02] border border-white/[0.04] hover-elevate"
                data-testid={`differential-${i}`}
              >
                <span className="text-3xl font-bold text-[hsl(192,85%,48%)]/30 font-mono shrink-0">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2" data-testid={`text-diff-title-${i}`}>{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed" data-testid={`text-diff-desc-${i}`}>{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contato" className="py-24 bg-[#080c14]" data-testid="section-contato">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp} custom={0} className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-[hsl(192,85%,48%)]/5 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <img
                src="/images/corb3d-icon-v3.png"
                alt="Corb3D"
                className="w-20 h-20 mx-auto mb-8 opacity-60"
                data-testid="img-cta-logo"
              />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" data-testid="text-cta-title">
                Pronto Para Dar Vida<br />ao Seu Projeto?
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-10 text-lg" data-testid="text-cta-desc">
                Entre em contato e receba um orcamento personalizado.
                Estamos prontos para transformar sua ideia em realidade.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="font-bold text-base px-10"
                  data-testid="button-orcamento-cta"
                >
                  Solicitar Orcamento Gratis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white bg-white/5 font-semibold text-base px-8"
                  data-testid="button-whatsapp"
                >
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 bg-[#060a12] border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3" data-testid="footer-brand">
            <img
              src="/images/corb3d-icon-v3.png"
              alt="Corb3D"
              className="h-10 w-10 object-contain opacity-60"
              data-testid="img-footer-logo"
            />
            <span className="text-sm font-semibold text-white/60" data-testid="text-footer-brand">
              CORB<span className={CYAN_CLASS}>3D</span>
            </span>
          </div>
          <p className="text-xs text-white/30" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} Corb3D. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <a href="#" className="text-xs text-white/40" data-testid="link-termos">Termos de Uso</a>
            <a href="#" className="text-xs text-white/40" data-testid="link-privacidade">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0a0e17] min-h-screen text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <DifferentialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
