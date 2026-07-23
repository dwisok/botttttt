import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type Metric = { target: number; dec: number; prefix?: string; suffix?: string; cap: string };

const METRICS: Metric[] = [
  { target: 42, dec: 0, cap: "pilot sites" },
  { target: 18.6, dec: 1, suffix: "k", cap: "patrol hours / robot / year" },
  { target: 99.2, dec: 1, suffix: "%", cap: "uptime target" },
  { target: 60, dec: 0, prefix: "−", suffix: "%", cap: "vs human guard cost" },
];

function Counter({ m }: { m: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setVal(m.target);
          return;
        }
        const dur = 1500;
        let t0: number | null = null;
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const step = (ts: number) => {
          if (t0 === null) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          setVal(m.target * easeOutQuart(p));
          if (p < 1) requestAnimationFrame(step);
          else setVal(m.target);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [m.target]);

  return (
    <div ref={ref} className="border-l border-border px-4 py-[clamp(1.9rem,5vh,3.4rem)] first:border-l-0">
      <div className="text-[clamp(2.4rem,4.6vw,4rem)] font-medium leading-none tracking-[-0.04em]">
        {m.prefix ?? ""}
        {val.toFixed(m.dec)}
        {m.suffix ?? ""}
      </div>
      <div className="mt-3.5 font-mono text-[0.72rem] tracking-[0.03em] text-muted-foreground">
        {m.cap}
      </div>
    </div>
  );
}

export function Numbers() {
  return (
    <Section id="numbers" index="06" title="the numbers">
      <Reveal>
        <div className="grid grid-cols-2 border-y border-border md:grid-cols-4">
          {METRICS.map((m) => (
            <Counter key={m.cap} m={m} />
          ))}
        </div>
      </Reveal>
      <Reveal className="mt-6">
        <p className="font-mono text-[0.68rem] text-[#5c5b57]">
          illustrative pilot targets, not audited results.
        </p>
      </Reveal>
    </Section>
  );
}
