import { motion } from "framer-motion";

export default function YesNoQuestion({ data, value, onChange, onNext }) {
  const options = ["Yes", "No"];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3">
      {options.map((opt, i) => {
        const isSelected = value === opt;
        return (
          <motion.button
            key={opt}
            id={`btn-yesno-${opt.toLowerCase()}`}
            onClick={() => {
              onChange(opt);
              setTimeout(onNext, 400);
            }}
            className={`w-full text-left px-6 py-5 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center gap-4 group ${
              isSelected
                ? "bg-[var(--color-accent-subtle)] border-[var(--color-border-active)] text-[var(--color-text-primary)] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span
              className={`kbd text-xs transition-colors duration-300 ${
                isSelected ? "!bg-[var(--color-text-primary)] !text-[var(--color-background)] !border-[var(--color-text-primary)]" : ""
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-lg font-medium transition-colors duration-300 ${isSelected ? "text-[var(--color-text-primary)]" : ""}`}>
              {opt}
            </span>
            {isSelected && (
              <motion.span
                className="ml-auto text-[var(--color-text-primary)]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
