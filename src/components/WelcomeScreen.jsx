import { motion } from "framer-motion";

export default function WelcomeScreen({ data, onNext }) {
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="mb-10 mx-auto flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <a 
          href="https://deklo-ui-info.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group cursor-pointer block"
        >
          <div className="w-24 h-24 p-2">
            <img 
              src="./logo.png" 
              alt="Deklo Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] invert brightness-0 transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
        </a>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight mb-8 text-[var(--color-text-primary)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {data.headline}
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] pb-16 font-light tracking-wide flex justify-center items-center gap-2 sm:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-active)]"></span>
        {data.subtext}
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 pt-8 w-full relative z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => onNext('cloud')}
          className="group relative flex-1 min-w-[280px] max-w-[400px] px-6 py-5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 hover:-translate-y-2 active:scale-95 active:translate-y-0 shadow-sm flex flex-col items-center text-center gap-2"
        >
          <span className="text-xl">☁️ I want Cloud Hosting</span>
          <span className="text-sm text-[var(--color-text-muted)] font-normal">For Web Apps, APIs, and Databases</span>
        </button>

        <button
          onClick={() => onNext('node')}
          className="group relative flex-1 min-w-[280px] max-w-[400px] px-6 py-5 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 hover:-translate-y-2 active:scale-95 active:translate-y-0 shadow-sm flex flex-col items-center text-center gap-2"
        >
          <span className="text-xl">⚡ I want to Host a Node</span>
          <span className="text-sm text-[var(--color-text-muted)] font-normal">For Validators, Scrapers, and Streaming</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
