import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const SHEET: [string, string][] = [
  ["standard", "erc-20"],
  ["chain", "robinhood chain"],
  ["supply", "fixed cap"],
  ["role", "utility · access"],
  ["emissions", "proof-of-patrol"],
  ["burn", "on subscription"],
];

export function Token() {
  return (
    <Section id="token" index="05" title="the token · $sntl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <Reveal>
          <p className="max-w-[18ch] text-[clamp(1.5rem,2.8vw,2.3rem)] font-medium leading-[1.14] tracking-[-0.025em]">
            $SNTL is the network's <span className="text-primary">working capital</span> — not a
            promise, a utility.
          </p>
          <p className="mt-6 max-w-[44ch] text-muted-foreground">
            Operators stake $SNTL to bring a unit online. Fake a proof and the stake is slashed —
            honesty is the cheaper strategy.
          </p>
          <p className="mt-5 max-w-[44ch] text-muted-foreground">
            Sites can pay their monthly subscription in $SNTL at a 20% discount, and part of every
            payment is burned. Rewards are minted only against verified proof-of-patrol.
          </p>
          <p className="mt-6 border-l border-border pl-4 font-mono text-[0.82rem]">
            No revenue-sharing, no dividends, no yield promises.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-border bg-[#101014]">
            <div className="flex items-center justify-between border-b border-border px-[18px] py-[14px] font-mono text-[0.7rem] tracking-[0.08em] text-muted-foreground">
              <span>token sheet</span>
              <span className="text-primary">$sntl</span>
            </div>
            {SHEET.map(([l, v]) => (
              <div
                key={l}
                className="flex items-center justify-between gap-4 border-t border-border px-[18px] py-[13px] font-mono text-[0.78rem] first-of-type:border-t-0"
              >
                <span className="tracking-[0.03em] text-muted-foreground">{l}</span>
                <span className="text-right text-foreground">{v}</span>
              </div>
            ))}
            <div className="border-t border-border px-[18px] py-[14px] font-mono text-[0.63rem] leading-[1.6] text-[#5c5b57]">
              $SNTL is a utility token intended for network access, staking and settlement. It is
              not an investment product and confers no claim on revenue or profit. Legal review
              pending before public launch.
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
