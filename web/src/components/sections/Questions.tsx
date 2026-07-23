import { useState } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const QA: [string, string][] = [
  [
    "What does the unit actually do?",
    "It patrols a fixed route and watches for people and anomalies with thermal and lidar. Real events get a siren, a strobe and an alert to the site's team. It carries no weapons and makes no arrests — it observes, deters, and documents.",
  ],
  [
    "How is the work verified on-chain?",
    "Every event is signed by the robot's onboard key. Routine steps are collected into a Merkle root posted to the chain each interval; critical events are anchored individually and immediately. Anyone can check that a given patrol actually happened.",
  ],
  [
    "Why Robinhood Chain?",
    "Low, predictable fees for high-frequency proofs, and an EVM environment our tooling already speaks. A patrol network writes constantly — the settlement layer has to be cheap and boring.",
  ],
  [
    "Is $SNTL a security?",
    "Honestly: possibly, depending on jurisdiction. It is designed as a utility with no revenue share and no yield, but we are completing legal review under SEC and MiCA frameworks before any public launch. We would rather say this plainly than pretend.",
  ],
  [
    "What about privacy?",
    "Processing happens on-device. Only hashes and signatures are written on-chain — never raw video. Footage stays with the site owner, under their existing surveillance policy.",
  ],
];

export function Questions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="questions" index="07" title="questions">
      <Reveal className="max-w-[920px]">
        {QA.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q} className="border-t border-border last:border-b">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-5 py-6 text-left text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-[-0.02em] transition-colors hover:text-white"
              >
                <span>{q}</span>
                <span
                  className={cn(
                    "font-mono text-lg transition-transform duration-300",
                    isOpen ? "rotate-45 text-primary" : "text-muted-foreground"
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-500 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[60ch] pb-6 text-muted-foreground">{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
