import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SelectQuestion({ data, value, onChange, onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setTimeout(onNext, 400);
  };

  return (
    <div className="w-full max-w-xl mx-auto relative" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <motion.button
        id={`btn-select-${data.id}`}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-5 py-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center justify-between ${
          value || isOpen
            ? "bg-[var(--color-surface-hover)] border-[var(--color-border-active)] text-[var(--color-text-primary)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-base font-medium">
          {value || "Select an option..."}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[var(--color-text-muted)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.span>
      </motion.button>

      {/* Dropdown options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-xl overflow-hidden shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
          >
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar py-2">
              {data.options.map((opt, i) => (
                <button
                  key={opt}
                  id={`option-${data.id}-${i}`}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-5 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-150 ${
                    value === opt
                      ? "bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <span className="kbd text-[10px] opacity-70">{i + 1}</span>
                  <span className="text-sm font-medium">{opt}</span>
                  {value === opt && (
                    <span className="ml-auto text-[var(--color-text-primary)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
