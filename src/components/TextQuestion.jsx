import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TextQuestion({ data, value, onChange, onNext }) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <input
          ref={inputRef}
          id={`input-${data.id}`}
          type={data.type === "email" ? "email" : "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (value || data.optional)) {
              onNext();
            }
          }}
          placeholder={data.placeholder}
          className="w-full bg-transparent border-0 border-b border-[var(--color-border)] text-2xl sm:text-3xl font-light text-[var(--color-text-primary)] py-4 focus:outline-none transition-colors duration-300 placeholder:text-[var(--color-text-muted)]"
          autoComplete={data.type === "email" ? "email" : "off"}
        />
        
        {/* Animated focus underline */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--color-text-primary)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
        />
      </motion.div>

      <motion.div
        className="mt-8 flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button
          id={`btn-next-${data.id}`}
          onClick={() => {
            if (value || data.optional) onNext();
          }}
          disabled={!value && !data.optional}
          className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
            value || data.optional
              ? "bg-[var(--color-text-primary)] text-[var(--color-background)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] cursor-not-allowed"
          }`}
        >
          {data.optional ? "Submit" : "OK"} 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          press <span className="kbd ml-1">Enter</span>
        </span>
      </motion.div>

      {data.optional && (
        <motion.p
          className="mt-4 text-xs text-[var(--color-text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Optional — press Enter to skip
        </motion.p>
      )}
    </div>
  );
}
