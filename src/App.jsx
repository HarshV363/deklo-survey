import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOUD_QUESTIONS, NODE_QUESTIONS, FORM_ENDPOINT } from "./data/questions";
import WelcomeScreen from "./components/WelcomeScreen";
import YesNoQuestion from "./components/YesNoQuestion";
import SelectQuestion from "./components/SelectQuestion";
import ChoiceQuestion from "./components/ChoiceQuestion";
import TextQuestion from "./components/TextQuestion";
import ScaleQuestion from "./components/ScaleQuestion";
import SuccessScreen from "./components/SuccessScreen";

const slideVariants = {
  enter: (direction) => ({
    y: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // "warm" | "cold" | null

  const [surveyType, setSurveyType] = useState(null); // 'cloud' or 'node'

  const QUESTIONS = surveyType === "node" ? NODE_QUESTIONS : CLOUD_QUESTIONS;
  const TOTAL_QUESTIONS = QUESTIONS.filter((q) => q.type !== "welcome").length;

  const currentQ = QUESTIONS[currentIndex];
  const questionNumber = currentQ?.number || 0;
  const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

  const updateAnswer = useCallback(
    (value) => {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    },
    [currentQ]
  );

  const goNext = useCallback(() => {
    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, QUESTIONS.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = {};
      for (const [key, value] of Object.entries(answers)) {
        const qObj = QUESTIONS.find((q) => q.id === key);
        if (qObj && qObj.question) {
          formattedAnswers[key] = `Q: ${qObj.question}\nA: ${value}`;
        } else {
          formattedAnswers[key] = value;
        }
      }

      const payload = { surveyType, ...formattedAnswers };
      
      const formBody = [];
      for (const property in payload) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(payload[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.join("&"),
      });
    } catch (err) {
      console.warn("Submission error:", err);
    }

    const pitchAnswer = answers.q14 || "";
    const isWarm =
      pitchAnswer.startsWith("Take my money") ||
      pitchAnswer.startsWith("Sounds great") ||
      surveyType === "node";

    setSubmitResult(isWarm ? "warm" : "cold");
    setIsSubmitting(false);
  }, [answers, surveyType]);

  // Handle the "next" action for the last question (q15 = submit)
  const handleNext = useCallback(() => {
    if (currentQ.id === "q15") {
      handleSubmit();
    } else {
      goNext();
    }
  }, [currentQ, goNext, handleSubmit]);

  const handleWelcomeNext = useCallback((type) => {
    setSurveyType(type);
    goNext();
  }, [goNext]);

  // ─── KEYBOARD NAVIGATION ──────────────────────────────────────────────
  useEffect(() => {
    if (submitResult || isSubmitting) return;

    const handleKeyDown = (e) => {
      // Enter → advance
      if (e.key === "Enter") {
        e.preventDefault();
        // For text/email inputs, the component handles Enter internally
        if (currentQ.type === "text" || currentQ.type === "email") return;

        if (currentQ.type === "welcome") {
          // Do nothing on Enter for welcome screen now since we need a choice
          return;
        }
        if (currentQ.type === "scale") {
          handleNext();
          return;
        }
        // For choice/yesno/select — only advance if answered
        if (answers[currentQ.id]) {
          handleNext();
        }
        return;
      }

      // Backspace → go back (only if not in a text input)
      if (e.key === "Backspace" && currentQ.type !== "text" && currentQ.type !== "email") {
        e.preventDefault();
        goPrev();
        return;
      }

      // Number/letter keys for option selection
      if (currentQ.type === "yesno") {
        if (e.key === "1") { updateAnswer("Yes"); setTimeout(goNext, 350); }
        if (e.key === "2") { updateAnswer("No"); setTimeout(goNext, 350); }
      }

      if (currentQ.type === "choice") {
        const idx = e.key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ...
        if (idx >= 0 && idx < currentQ.options.length) {
          updateAnswer(currentQ.options[idx]);
          setTimeout(goNext, 350);
        }
        // Also support number keys
        const numIdx = parseInt(e.key) - 1;
        if (numIdx >= 0 && numIdx < currentQ.options.length) {
          updateAnswer(currentQ.options[numIdx]);
          setTimeout(goNext, 350);
        }
      }

      if (currentQ.type === "select") {
        const numIdx = parseInt(e.key) - 1;
        if (numIdx >= 0 && numIdx < currentQ.options.length) {
          updateAnswer(currentQ.options[numIdx]);
          setTimeout(goNext, 400);
        }
      }

      if (currentQ.type === "scale") {
        const num = parseInt(e.key);
        if (num >= currentQ.min && num <= currentQ.max) {
          updateAnswer(num);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQ, answers, goNext, goPrev, handleNext, updateAnswer, submitResult, isSubmitting, QUESTIONS]);

  // ─── RENDER ────────────────────────────────────────────────────────────
  if (submitResult) {
    return (
      <div className="h-full flex items-center justify-center relative">
        <div className="bg-mesh" />
        <SuccessScreen isWarmLead={submitResult === "warm"} />
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case "welcome":
        return <WelcomeScreen data={currentQ} onNext={handleWelcomeNext} />;
      case "yesno":
        return (
          <YesNoQuestion
            data={currentQ}
            value={answers[currentQ.id]}
            onChange={updateAnswer}
            onNext={goNext}
          />
        );
      case "select":
        return (
          <SelectQuestion
            data={currentQ}
            value={answers[currentQ.id]}
            onChange={updateAnswer}
            onNext={goNext}
          />
        );
      case "choice":
        return (
          <ChoiceQuestion
            data={currentQ}
            value={answers[currentQ.id]}
            onChange={updateAnswer}
            onNext={currentQ.id === "q11" ? goNext : goNext}
          />
        );
      case "text":
      case "email":
        return (
          <TextQuestion
            data={currentQ}
            value={answers[currentQ.id]}
            onChange={updateAnswer}
            onNext={handleNext}
          />
        );
      case "scale":
        return (
          <ScaleQuestion
            data={currentQ}
            value={answers[currentQ.id]}
            onChange={updateAnswer}
            onNext={goNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Background mesh */}
      <div className="bg-mesh" />

      {/* Global Persistent Logo */}
      {currentQ.type !== "welcome" && !submitResult && (
        <motion.div 
          className="absolute top-8 left-1/2 -translate-x-1/2 z-40 opacity-30 pointer-events-none"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="./logo.png" alt="Deklo" className="h-8 object-contain invert brightness-0" />
        </motion.div>
      )}

      {/* Progress bar */}
      {currentQ.type !== "welcome" && (
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Question header (not for welcome) */}
            {currentQ.type !== "welcome" && (
              <div className="max-w-2xl mx-auto mb-10">
                <motion.div
                  className="flex items-baseline gap-3 mb-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-[0.2em] uppercase">
                    {questionNumber} <span className="opacity-50">/</span> {TOTAL_QUESTIONS}
                  </span>
                </motion.div>
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-medium leading-snug tracking-tight text-[var(--color-text-primary)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentQ.question}
                </motion.h2>
              </div>
            )}

            {/* Question body */}
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submitting Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background)]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner mb-4 scale-150" />
            <p className="text-[var(--color-text-secondary)] font-medium text-lg">Submitting your response...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back Button */}
      {currentQ.type !== "welcome" && currentIndex > 0 && (
        <motion.div
          className="absolute top-8 left-8 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            id="btn-prev"
            onClick={goPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-lighter)] hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            ← Back
          </button>
        </motion.div>
      )}
    </div>
  );
}
