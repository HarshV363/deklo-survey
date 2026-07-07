import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScaleQuestion({ data, value, onChange, onNext }) {
  const [localVal, setLocalVal] = useState(value || 3);

  useEffect(() => {
    if (value) setLocalVal(value);
  }, [value]);

  const handleChange = (val) => {
    setLocalVal(val);
    onChange(val);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Visual Feedback */}
      <motion.div
        className="text-center mb-10 h-24 flex flex-col items-center justify-end"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        key={localVal}
      >
        <motion.span 
          className="text-5xl block mb-2 filter grayscale brightness-150 contrast-125"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {data.emojis[localVal - 1]}
        </motion.span>
        <p className="text-sm font-medium text-[var(--color-text-secondary)] tracking-wide uppercase">
          {data.labels[localVal - 1]}
        </p>
      </motion.div>

      {/* Scale buttons */}
      <motion.div
        className="flex items-center justify-center gap-2 sm:gap-4 mb-8 w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: data.max - data.min + 1 }, (_, i) => i + data.min).map(
          (num) => {
            const isSelected = localVal === num;
            return (
              <motion.button
                key={num}
                id={`btn-scale-${num}`}
                onClick={() => handleChange(num)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full font-medium text-lg cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? "bg-[var(--color-text-primary)] text-[var(--color-background)] scale-110 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]"
                }`}
                whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {num}
              </motion.button>
            );
          }
        )}
      </motion.div>

      {/* Labels */}
      <motion.div
        className="flex justify-between w-full px-2 mb-10 text-xs text-[var(--color-text-muted)] tracking-wider uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span>{data.labels[0]}</span>
        <span>{data.labels[data.labels.length - 1]}</span>
      </motion.div>

      {/* Next button */}
      <motion.div
        className="flex items-center gap-4 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          id={`btn-next-${data.id}`}
          onClick={onNext}
          className="px-6 py-2.5 rounded-full font-medium text-sm bg-[var(--color-text-primary)] text-[var(--color-background)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          OK 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          press <span className="kbd ml-1">Enter</span>
        </span>
      </motion.div>
    </div>
  );
}
