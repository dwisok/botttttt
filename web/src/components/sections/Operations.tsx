import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Globe } from "@/components/ops/Globe";

export function Operations() {
  return (
    <Section id="operations" index="04" title="operations · live">
      <Reveal>
        <p className="mb-[clamp(1.75rem,4vh,2.75rem)] max-w-[54ch] text-[1.05rem] text-muted-foreground">
          Every unit on the network, every action it takes, anchored on-chain in real time. Select a
          marker to open its site.
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <Globe />
      </Reveal>
      <Reveal className="mt-6">
        <p className="font-mono text-[0.66rem] text-[#55544f]">
          live view is a demonstration — the same signed events the network anchors in production.
        </p>
      </Reveal>
    </Section>
  );
}
