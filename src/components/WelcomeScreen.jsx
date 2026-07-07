import { motion } from "framer-motion";

export default function WelcomeScreen({ data, onNext }) {
  return (
    <motion.div
      className="flex flex-col items-start justify-center max-w-2xl mx-auto px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-12 h-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xl backdrop-blur-md shadow-sm">
          <span className="opacity-80">☁️</span>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-4 text-[var(--color-text-primary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {data.headline}
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-12 font-light tracking-wide flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="w-2 h-2 rounded-full bg-[var(--color-border-active)]"></span>
        {data.subtext}
      </motion.p>

      <motion.button
        id="btn-start-survey"
        onClick={onNext}
        className="group relative px-8 py-3 bg-[var(--color-text-primary)] text-[var(--color-background)] font-medium text-sm sm:text-base rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {data.buttonText}
      </motion.button>

      <motion.p
        className="mt-6 text-xs text-[var(--color-text-muted)] tracking-wider uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Press <span className="kbd ml-1">Enter</span>
      </motion.p>
    </motion.div>
  );
}
