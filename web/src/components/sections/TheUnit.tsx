import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const SPECS: [string, string, string][] = [
  ["height", "1.45 m", "eye-level presence"],
  ["sensors", "360° lidar · thermal · 4k", "fused on-device"],
  ["detection", "< 300 ms", "on-device, no cloud"],
  ["deterrence", "110 db siren", "voice + strobe"],
  ["endurance", "14 h", "self-charging"],
  ["build", "ip65 · 6 km/h", "rain, dust, cold"],
];

export function TheUnit() {
  return (
    <Section id="the-unit" index="02" title="the unit · s-1">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        {/* Portrait placeholder — a real photo of the S-1 drops in here later */}
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-[#101014]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent 0 7px, rgba(236,234,230,.045) 7px 8px)",
              }}
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="border border-border bg-[#101014] px-3 py-2 font-mono text-[0.68rem] text-muted-foreground">
                photo pending — s-1 · field unit 042
              </span>
            </span>
            <span className="absolute bottom-3 left-3 font-mono text-[0.66rem] text-muted-foreground">
              s-1 · field unit 042
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mb-6 max-w-[34ch]">
            <span className="mb-2 block text-2xl font-medium tracking-[-0.02em]">
              Built to stand watch, not to impress.
            </span>
            <p className="text-muted-foreground">
              One frame, six senses, fourteen hours a night. No breaks, no shifts, no excuses.
            </p>
          </div>
          <div>
            {SPECS.map(([label, value, note], i) => (
              <div
                key={label}
                className={`grid grid-cols-[1fr_1.15fr_1fr] items-baseline gap-4 border-t border-border py-[18px] ${
                  i === SPECS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-[0.74rem] tracking-[0.04em] text-muted-foreground">
                  {label}
                </span>
                <span className="text-[1.28rem] font-medium tracking-[-0.02em]">{value}</span>
                <span className="text-right font-mono text-[0.7rem] text-muted-foreground">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
