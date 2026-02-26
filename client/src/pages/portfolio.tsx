import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Image, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItemWithImages } from "@shared/schema";

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

function Lightbox({ item, onClose }: { item: PortfolioItemWithImages; onClose: () => void }) {
  const allImages = item.images.length > 0
    ? item.images.map(img => img.imageUrl)
    : [item.imageUrl];
  const [currentIndex, setCurrentIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "Escape") onClose();
  };

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center outline-none"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid="lightbox-overlay"
    >
      <div
        className="relative max-w-5xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors z-10"
          data-testid="button-close-lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full flex items-center justify-center">
          {allImages.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-4 z-10 p-2 md:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-all"
              data-testid="button-lightbox-prev"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={allImages[currentIndex]}
              alt={`${item.title} - Foto ${currentIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              data-testid={`img-lightbox-${currentIndex}`}
            />
          </AnimatePresence>

          {allImages.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 md:right-4 z-10 p-2 md:p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-all"
              data-testid="button-lightbox-next"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-white mb-1" data-testid="text-lightbox-title">{item.title}</h3>
          <p className="text-sm text-white/50">{item.category}</p>
          {item.description && (
            <p className="text-sm text-white/60 mt-2 max-w-lg mx-auto">{item.description}</p>
          )}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-[hsl(192,85%,50%)] w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  data-testid={`button-lightbox-dot-${idx}`}
                />
              ))}
            </div>
          )}
          {allImages.length > 1 && (
            <p className="text-xs text-white/30 mt-2">{currentIndex + 1} / {allImages.length}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<PortfolioItemWithImages | null>(null);

  const { data: items, isLoading } = useQuery<PortfolioItemWithImages[]>({
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
                  className="bg-white/[0.03] border-white/[0.06] overflow-hidden hover-elevate group cursor-pointer"
                  data-testid={`card-project-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-[4/3] bg-white/[0.02] overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      data-testid={`img-project-${item.id}`}
                    />
                    {item.images.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium flex items-center gap-1" data-testid={`badge-photo-count-${item.id}`}>
                        <Image className="w-3 h-3" />
                        {item.images.length}
                      </div>
                    )}
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

      <AnimatePresence>
        {selectedItem && (
          <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
