import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export function Section({
  id,
  index,
  title,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative bg-hero-bg", className)}>
      <div className="mx-auto w-full max-w-[1240px] px-6 md:px-16 py-[clamp(4.5rem,11vh,9rem)]">
        <Reveal className="mb-[clamp(2.5rem,7vh,5rem)]">
          <div className="flex items-baseline gap-4 border-t border-border pt-4 font-mono text-xs tracking-[0.06em]">
            <span className="text-primary">{index}</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-muted-foreground lowercase">{title}</span>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
