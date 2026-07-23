import type { ReactNode } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { OpsMap } from "@/components/ops/OpsMap";
import { IncidentLog } from "@/components/ops/IncidentLog";
import { Settlement } from "@/components/ops/Settlement";

function Row({ n, title, body, screen }: { n: string; title: string; body: string; screen: ReactNode }) {
  return (
    <Reveal>
      <div className="grid grid-cols-1 items-center gap-6 border-t border-border py-[clamp(1.9rem,5vh,3.25rem)] last:border-b lg:grid-cols-[auto_1fr_0.9fr] lg:gap-14">
        <div className="whitespace-nowrap font-mono text-[0.8rem] tracking-[0.06em] text-muted-foreground">
          <b className="font-normal text-primary">/</b> {n}
        </div>
        <div>
          <h3 className="text-[clamp(1.5rem,2.6vw,2.15rem)] font-medium leading-[1.05] tracking-[-0.025em]">
            {title}
          </h3>
          <p className="mt-3 max-w-[40ch] text-[0.98rem] text-muted-foreground">{body}</p>
        </div>
        <div className="w-full">{screen}</div>
      </div>
    </Reveal>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" index="03" title="how it works">
      <Row
        n="01"
        title="Map once, patrol forever"
        body="Walk the site once. The unit builds its route and repeats it every night, indefinitely, without a shift change."
        screen={<OpsMap />}
      />
      <Row
        n="02"
        title="Incidents become evidence"
        body="A person where none should be. The unit logs it, timestamps it, hashes it — a record no one can quietly edit."
        screen={<IncidentLog />}
      />
      <Row
        n="03"
        title="Work settles on-chain"
        body="Each patrol is signed by the robot's own key and batched to the chain. Operators are paid only for work that provably happened."
        screen={<Settlement />}
      />
    </Section>
  );
}
