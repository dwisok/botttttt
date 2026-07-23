const COLS: [string, string[]][] = [
  ["network", ["mission", "the unit", "how it works"]],
  ["token", ["$sntl", "token sheet", "proof of patrol"]],
  ["company", ["pilot program", "contact", "careers"]],
  ["legal", ["privacy", "terms", "disclosures"]],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-hero-bg">
      <div className="mx-auto w-full max-w-[1240px] px-6 py-[clamp(3.5rem,9vh,7rem)] md:px-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <div className="font-mono text-[0.82rem] tracking-[0.22em]">sentinel</div>
            <p className="mt-3.5 max-w-[26ch] text-[0.86rem] text-muted-foreground">
              Autonomous security patrol, proven on-chain.
            </p>
          </div>
          {COLS.map(([h, links]) => (
            <div key={h}>
              <h4 className="mb-4 font-mono text-[0.66rem] tracking-[0.1em] text-[#5c5b57]">{h}</h4>
              {links.map((l) => (
                <a
                  key={l}
                  href="#top"
                  className="block py-[5px] font-mono text-[0.74rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-wrap justify-between gap-8 border-t border-border pt-7">
          <p className="max-w-[74ch] font-mono text-[0.66rem] leading-[1.7] text-[#5c5b57]">
            Figures shown are illustrative pilot targets, not audited results. $SNTL is a utility
            token and may be classified as a security in some jurisdictions; nothing on this page is
            an offer to sell or a solicitation to buy any asset, or investment advice.
          </p>
          <p className="font-mono text-[0.66rem] text-[#5c5b57]">© 2026 sentinel robotics</p>
        </div>
      </div>
    </footer>
  );
}
