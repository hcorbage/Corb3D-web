import { motion } from "framer-motion";
import { Printer, Layers, Shield, Zap, ArrowRight, ChevronDown, Box, Settings, Award, Clock, ScanLine, Calculator, Mail, MessageCircle, Send, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { SiInstagram } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

const CYAN = "hsl(192 85% 50%)";
const CYAN_CLASS = "text-[hsl(192,85%,50%)]";

const floatAnimation = (delay: number, duration: number, y: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: [0, 0.12, 0.12, 0],
    y: [y, y - 15, y + 10, y],
    transition: {
      delay,
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

const heroObjects = [
  { src: "/images/enterprise-wireframe.png", className: "top-[6%] right-[4%] w-[20%]", delay: 0, duration: 12, y: 0, testId: "img-enterprise-overlay" },
  { src: "/images/shuttle-wireframe.png", className: "top-[12%] left-[4%] w-[16%]", delay: 2, duration: 14, y: 0, testId: "img-shuttle-overlay" },
  { src: "/images/cristo-wireframe.png", className: "bottom-[10%] right-[6%] w-[11%]", delay: 4, duration: 16, y: 0, testId: "img-cristo-overlay" },
  { src: "/images/ship-wireframe.png", className: "bottom-[15%] left-[6%] w-[15%]", delay: 1, duration: 13, y: 0, testId: "img-ship-overlay" },
  { src: "/images/charrete-wireframe.png", className: "bottom-[6%] left-[40%] w-[13%]", delay: 3, duration: 15, y: 0, testId: "img-charrete-overlay" },
];

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

function PortfolioLink() {
  const [, setLocation] = useLocation();
  return (
    <Button
      variant="outline"
      size="lg"
      className="border-white/20 text-white bg-white/5 backdrop-blur-sm font-semibold text-base px-8"
      data-testid="button-portfolio"
      onClick={() => setLocation("/portfolio")}
    >
      Ver Portfolio
    </Button>
  );
}

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
            src="/images/corb3d-robot-cropped.png"
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
        <a href="#contato">
          <Button variant="default" size="sm" data-testid="button-orcamento-nav">
            Solicitar Orcamento
          </Button>
        </a>
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
          src="/images/hero-bg-v10.png"
          alt=""
          className="w-full h-full object-cover"
          data-testid="img-hero-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/60 via-[#0a0e17]/40 to-[#0a0e17]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heroObjects.map((obj) => {
          const anim = floatAnimation(obj.delay, obj.duration, obj.y);
          return (
            <motion.img
              key={obj.testId}
              src={obj.src}
              alt=""
              className={`absolute ${obj.className}`}
              initial={anim.initial}
              animate={anim.animate}
              data-testid={obj.testId}
            />
          );
        })}
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
                src="/images/corb3d-robot-cropped.png"
                alt="Corb3D Robot"
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
            <a href="#contato">
              <Button
                size="lg"
                className="font-bold text-base px-8"
                data-testid="button-orcamento-hero"
              >
                Solicitar Orcamento
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <PortfolioLink />
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
                <div className="text-xs text-white/65 mt-1">{stat.label}</div>
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
    {
      icon: Calculator,
      title: "Corb3D Manager",
      description:
        "Sistema completo para profissionais e empresas de impressao 3D. Controle de impressoes, calculo de custos, orcamentos e gestao do seu negocio.",
      link: "https://solid3d.replit.app",
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
          <motion.p variants={fadeInUp} custom={2} className="text-white/65 max-w-xl mx-auto" data-testid="text-servicos-desc">
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
          {services.map((service, i) => {
            const cardContent = (
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
                <p className="text-sm text-white/65 leading-relaxed" data-testid={`text-service-desc-${i}`}>
                  {service.description}
                </p>
                {service.link && (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 no-underline hover:gap-3 transition-all duration-300"
                    data-testid={`link-service-${i}`}
                  >
                    <span className={`text-sm font-medium ${CYAN_CLASS}`}>Acessar</span>
                    <ArrowRight className={`w-4 h-4 ${CYAN_CLASS}`} />
                  </a>
                )}
              </Card>
            );

            return (
              <motion.div key={service.title} variants={fadeInUp} custom={i}>
                {cardContent}
              </motion.div>
            );
          })}
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
              <Button className="font-semibold" data-testid="button-conheca-mais" onClick={() => setLocation("/sobre")}>
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
                <p className="text-xs text-white/60" data-testid={`text-about-desc-${i}`}>{item.desc}</p>
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
          <motion.p variants={fadeInUp} custom={2} className="text-white/65 max-w-xl mx-auto" data-testid="text-diferenciais-desc">
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
                  <p className="text-sm text-white/65 leading-relaxed" data-testid={`text-diff-desc-${i}`}>{item.description}</p>
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
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const WHATSAPP_NUMBER = "5500000000000";
  const CONTACT_EMAIL = "contato@corb3d.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("POST", "/api/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message,
      });
    } catch (err) {
      console.error("Error saving contact:", err);
    }
    const subject = encodeURIComponent(`Orcamento Corb3D - ${formData.service || "Geral"}`);
    const body = encodeURIComponent(
      `Nome: ${formData.name}\nE-mail: ${formData.email}\nTelefone: ${formData.phone}\nServico: ${formData.service}\n\nMensagem:\n${formData.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Ola! Gostaria de solicitar um orcamento para impressao 3D.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <section id="contato" className="py-24 bg-[#080c14] relative" data-testid="section-contato">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(192,85%,48%)]/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(192,85%,48%)]/20 bg-[hsl(192,85%,48%)]/5 mb-6" data-testid="badge-contato">
            <Mail className={`w-3.5 h-3.5 ${CYAN_CLASS}`} />
            <span className={`text-xs font-medium ${CYAN_CLASS} uppercase tracking-wider`}>Contato</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-contato-title">
            Solicite Seu Orcamento
          </motion.h2>
          <motion.p variants={fadeInUp} custom={2} className="text-white/65 max-w-xl mx-auto" data-testid="text-contato-desc">
            Preencha o formulario abaixo ou fale diretamente pelo WhatsApp.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-5 gap-8"
        >
          <motion.div variants={fadeInUp} custom={0} className="lg:col-span-3">
            <Card className="bg-white/[0.03] border-white/[0.06] p-6 md:p-8" data-testid="card-contact-form">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Nome</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
                      placeholder="Seu nome"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">E-mail</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
                      placeholder="seu@email.com"
                      data-testid="input-email"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Telefone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
                      placeholder="(00) 00000-0000"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block">Servico</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors"
                      data-testid="select-service"
                    >
                      <option value="" className="bg-[#0a0e17]">Selecione um servico</option>
                      <option value="Impressao FDM" className="bg-[#0a0e17]">Impressao FDM</option>
                      <option value="Modelagem 3D" className="bg-[#0a0e17]">Modelagem 3D</option>
                      <option value="Escaneamento 3D" className="bg-[#0a0e17]">Escaneamento 3D</option>
                      <option value="Pos-Processamento" className="bg-[#0a0e17]">Pos-Processamento</option>
                      <option value="Outro" className="bg-[#0a0e17]">Outro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(192,85%,48%)]/40 transition-colors resize-none"
                    placeholder="Descreva seu projeto, material desejado, quantidade, dimensoes..."
                    data-testid="textarea-message"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold text-base"
                  data-testid="button-submit-orcamento"
                >
                  {sent ? "E-mail aberto! Envie pelo seu app de e-mail." : "Enviar Orcamento"}
                  {!sent && <Send className="ml-2 w-4 h-4" />}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} custom={1} className="lg:col-span-2 space-y-4">
            <Card
              className="bg-white/[0.03] border-white/[0.06] p-6 hover-elevate cursor-pointer"
              onClick={openWhatsApp}
              data-testid="card-whatsapp"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-md bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">WhatsApp</h3>
                  <p className="text-xs text-white/60">Resposta rapida</p>
                </div>
              </div>
              <p className="text-sm text-white/65 mb-4">
                Fale diretamente com nossa equipe pelo WhatsApp para orcamentos rapidos.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
                Iniciar Conversa <ArrowRight className="w-4 h-4" />
              </span>
            </Card>

            <Card className="bg-white/[0.03] border-white/[0.06] p-6" data-testid="card-email-info">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-md bg-[hsl(192,85%,48%)]/10 flex items-center justify-center">
                  <Mail className={`w-6 h-6 ${CYAN_CLASS}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">E-mail</h3>
                  <p className="text-xs text-white/60">Orcamentos detalhados</p>
                </div>
              </div>
              <p className="text-sm text-white/65">
                Envie seu projeto detalhado e receba um orcamento completo.
              </p>
              <p className={`text-sm font-medium ${CYAN_CLASS} mt-3`} data-testid="text-email-address">
                {CONTACT_EMAIL}
              </p>
            </Card>

            <a
              href="https://instagram.com/corb3d_br"
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline"
              data-testid="link-instagram-cta"
            >
              <Card className="bg-white/[0.03] border-white/[0.06] p-6 hover-elevate cursor-pointer" data-testid="card-instagram">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-md bg-pink-500/10 flex items-center justify-center">
                    <SiInstagram className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Instagram</h3>
                    <p className="text-xs text-white/60">@corb3d_br</p>
                  </div>
                </div>
                <p className="text-sm text-white/65">
                  Siga-nos para acompanhar nossos projetos e novidades.
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-400 mt-3">
                  Seguir <ArrowRight className="w-4 h-4" />
                </span>
              </Card>
            </a>

            <Card className="bg-white/[0.03] border-white/[0.06] p-6" data-testid="card-phone-info">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-[hsl(192,85%,48%)]/10 flex items-center justify-center">
                  <Phone className={`w-6 h-6 ${CYAN_CLASS}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Horario de Atendimento</h3>
                  <p className="text-xs text-white/60 mt-1">Seg a Sex, 8h as 18h</p>
                </div>
              </div>
            </Card>
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
              src="/images/corb3d-robot-cropped.png"
              alt="Corb3D"
              className="h-10 w-10 object-contain opacity-60"
              data-testid="img-footer-logo"
            />
            <span className="text-sm font-semibold text-white/60" data-testid="text-footer-brand">
              CORB<span className={CYAN_CLASS}>3D</span>
            </span>
          </div>
          <p className="text-xs text-white/50" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} Corb3D. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="https://instagram.com/corb3d_br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors"
              data-testid="link-instagram"
            >
              <SiInstagram className="w-4 h-4" />
              <span className="text-xs">@corb3d_br</span>
            </a>
            <a href="#" className="text-xs text-white/60" data-testid="link-termos">Termos de Uso</a>
            <a href="#" className="text-xs text-white/60" data-testid="link-privacidade">Privacidade</a>
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
