import { useState } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export function GetInvolved() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <Section id="contacts" index="08" title="get involved">
      <Reveal>
        <h2 className="max-w-[12ch] text-[clamp(2.6rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.035em]">
          Put a robot <span className="text-primary">on&nbsp;duty.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.06} className="mt-12 max-w-[560px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setDone(true);
          }}
        >
          <div className="flex items-center gap-4 border-b border-input pb-3 transition-colors focus-within:border-foreground">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={done}
              placeholder="work email"
              className="flex-1 bg-transparent text-lg tracking-[-0.01em] text-foreground outline-none placeholder:text-[#56544f]"
            />
            <button
              type="submit"
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap font-mono text-[0.8rem] tracking-[0.03em] transition-colors",
                done ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {done ? "received ✓" : (
                <>
                  request access <span className="text-primary">→</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-4 font-mono text-[0.7rem] text-[#5c5b57]">
            for site operators evaluating a pilot. no spam — one reply from a human.
          </p>
        </form>
      </Reveal>
    </Section>
  );
}
