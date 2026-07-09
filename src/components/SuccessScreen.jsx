import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#ffffff", "#d4d4d8", "#a1a1aa", "#71717a"][
        Math.floor(Math.random() * 4)
      ],
      delay: Math.random() * 1.5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 4,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SuccessScreen({ isWarmLead }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        className="flex flex-col items-center justify-center text-center max-w-xl mx-auto px-6"
        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(5px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border backdrop-blur-md shadow-lg ${
              isWarmLead
                ? "bg-[var(--color-surface)] border-[var(--color-border-active)] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                : "bg-[var(--color-surface)] border-[var(--color-border)]"
            }`}
          >
            <span className="opacity-80 grayscale contrast-125">
              {isWarmLead ? "🚀" : "🙏"}
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-[var(--color-text-primary)]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {isWarmLead ? "You're in." : "Thank You."}
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg leading-relaxed text-[var(--color-text-secondary)] font-light max-w-xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isWarmLead ? (
            <>
              Thanks! Your form reward is on the way. <br />
              <br />
              <span className="text-[var(--color-text-primary)] font-medium">Want to unlock an extra ₹500 in credits and free premium onboarding?</span><br />
              Keep an eye on your inbox — we'll be sending you an invite to grab a quick 15-minute slot for an architecture/strategy review soon!
            </>
          ) : (
            "Thanks for the honest feedback. It helps us build a better cloud platform for developers."
          )}
        </motion.p>

        {/* Deklo branding */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <a 
            href="https://deklo-ui-info.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <img 
              src="./logo.png" 
              alt="Deklo." 
              className="h-12 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 invert brightness-0 group-hover:scale-105" 
            />
            <span className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide group-hover:text-[var(--color-text-primary)] transition-colors duration-300 uppercase">
              Want to know more?
            </span>
          </a>
        </motion.div>
      </motion.div>
    </>
  );
}
