import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const MANIFESTO =
  "Static cameras record crime. Guards sleep, quit, and cost a fortune. We build tireless machines that patrol through the night — and prove every minute of their work on-chain.";
const WORDS = MANIFESTO.split(" ");
const ACCENT = new Set(["record", "prove"]);

export function Mission() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(WORDS.length);
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82;
      const end = vh * 0.32;
      let p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      setLit(Math.round(p * WORDS.length));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Section id="mission" index="01" title="mission">
      <p
        ref={ref}
        className="max-w-[20ch] text-[clamp(1.75rem,5vw,3.4rem)] font-medium leading-[1.14] tracking-[-0.02em]"
      >
        {WORDS.map((w, i) => (
          <span
            key={i}
            className={cn(
              "transition-opacity duration-500",
              i < lit ? "opacity-100" : "opacity-[0.16]",
              ACCENT.has(w) && "text-primary"
            )}
          >
            {w}
            {i < WORDS.length - 1 ? " " : ""}
          </span>
        ))}
      </p>

      <div className="mt-14 flex flex-wrap gap-10 max-w-[640px]">
        <Reveal className="max-w-[30ch]">
          <span className="mb-2 block font-mono text-[0.7rem] tracking-[0.08em] text-primary">
            the problem
          </span>
          <p className="text-sm text-muted-foreground">
            A camera sees an incident. It cannot walk toward it, and it never proves it was
            watching.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="max-w-[30ch]">
          <span className="mb-2 block font-mono text-[0.7rem] tracking-[0.08em] text-primary">
            the answer
          </span>
          <p className="text-sm text-muted-foreground">
            A unit that moves, deters, and leaves a record no one can quietly rewrite.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
