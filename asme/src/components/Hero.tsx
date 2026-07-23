import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const OPEN_TEXT = "Enter Your Email Here For Early Access";
const SUBMIT_TEXT = "You Will Receive Notifications By Email";

export function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  // Typewriter placeholder — types OPEN_TEXT when the form opens, SUBMIT_TEXT after submit.
  useEffect(() => {
    if (!showForm) {
      setPlaceholder("");
      return;
    }
    const text = submitted ? SUBMIT_TEXT : OPEN_TEXT;
    setPlaceholder("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setPlaceholder(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
  }, [showForm, submitted]);

  // After submission, reset back to the button state after 4 seconds.
  useEffect(() => {
    if (!submitted) return;
    const id = window.setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setEmail("");
    }, 4000);
    return () => window.clearTimeout(id);
  }, [submitted]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        <div className="flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
          >
            BUILD A NO-CODE AI APP IN MINUTES
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          >
            A new way to think and create
            <br className="hidden md:block" /> with computers
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="min-h-[50px] mt-2 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.button
                  key="button"
                  onClick={() => setShowForm(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
                >
                  Get early access
                </motion.button>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    required
                    className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/45 outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Submit email"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/90 cursor-pointer"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {submitted ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="arrow"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#"
            className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide"
          >
            Play Video Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
