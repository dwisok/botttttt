import { useEffect, useRef } from "react";

const EVENTS = ["patrol_start", "waypoint_reached", "heartbeat", "dock_charge", "waypoint_reached", "patrol_end", "heartbeat", "waypoint_reached"];
const ZONES = ["zone a", "zone b", "zone c", "dock", "fence line", "perimeter", "ramp p2"];

function hx(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += "0123456789abcdef"[(Math.random() * 16) | 0];
  return s;
}
const h48 = () => "0x" + hx(4) + "…" + hx(4);
const pad = (v: number) => (v < 10 ? "0" : "") + v;

/** Screen 2 — the incident console: one pinned incident + streaming routine rows. */
export function IncidentLog() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scr = root.current;
    if (!scr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = scr.querySelector(".log-rows") as HTMLElement;
    const inc = rows.querySelector(".log-row.inc") as HTMLElement;
    const clk = scr.querySelector("[data-clock]") as HTMLElement | null;
    const MAX = 8;
    let sec = 2 * 3600 + 47 * 60 + 52;
    const tstr = (s: number) => {
      s = ((s % 86400) + 86400) % 86400;
      return pad((s / 3600) | 0) + ":" + pad((s / 60 | 0) % 60) + ":" + pad(s % 60);
    };
    const addRow = (time: string, animate?: boolean) => {
      const r = document.createElement("div");
      r.className = "log-row new";
      const hash = h48();
      r.innerHTML =
        `<span class="tm">${time}</span><span class="ev">${EVENTS[(Math.random() * EVENTS.length) | 0]}</span>` +
        `<span class="zn">${ZONES[(Math.random() * ZONES.length) | 0]}</span><span class="cf">0.${90 + ((Math.random() * 9) | 0)}</span>` +
        `<span class="hs">${animate ? "0x…" : hash}</span><span class="stt">anchored ✓</span>`;
      rows.insertBefore(r, inc.nextSibling);
      while (rows.children.length > MAX + 1) rows.removeChild(rows.lastElementChild!);
      if (animate) {
        const cell = r.querySelector(".hs")!;
        let i = 0;
        const t = window.setInterval(() => {
          i++;
          if (i >= 8) {
            clearInterval(t);
            cell.textContent = hash;
            return;
          }
          cell.textContent = h48();
        }, 55);
      }
    };

    let seed = sec - 40;
    for (let k = 0; k < 6; k++) {
      addRow(tstr(seed));
      seed -= 18 + ((Math.random() * 22) | 0);
    }
    rows.querySelectorAll(".log-row.new").forEach((r) => r.classList.remove("new"));

    let clkT = 0;
    let addT = 0;
    const schedule = () => {
      addT = window.setTimeout(() => {
        addRow(tstr(sec), true);
        schedule();
      }, 6000 + Math.random() * 3000);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (reduce) {
            if (clk) clk.textContent = tstr(sec);
            return;
          }
          if (!clkT) clkT = window.setInterval(() => { sec++; if (clk) clk.textContent = tstr(sec); }, 1000);
          if (!addT) schedule();
        } else {
          if (clkT) { clearInterval(clkT); clkT = 0; }
          if (addT) { clearTimeout(addT); addT = 0; }
        }
      },
      { threshold: 0 }
    );
    io.observe(scr);
    return () => {
      io.disconnect();
      if (clkT) clearInterval(clkT);
      if (addT) clearTimeout(addT);
    };
  }, []);

  return (
    <div className="ops-screen" ref={root}>
      <div className="ops-top">
        <span className="ttl">
          <b>sentinel ops v0.4</b> — incidents · unit 042 · last 24 h
        </span>
        <span className="ops-live">
          <span className="d" />
          live · <span data-clock>02:47:52</span>
        </span>
      </div>
      <div className="log-body">
        <div className="log-table">
          <div className="log-head">
            <span>time</span>
            <span>event</span>
            <span className="c-zn">zone</span>
            <span className="c-cf">conf</span>
            <span>hash</span>
            <span>status</span>
          </div>
          <div className="log-rows">
            <div className="log-row inc">
              <span className="tm">02:47:13</span>
              <span className="ev">incident_detected</span>
              <span className="zn">zone b · fence</span>
              <span className="cf">0.94</span>
              <span className="hs">0x91d4…77af</span>
              <span className="stt">escalated</span>
            </div>
          </div>
        </div>
        <div className="log-therm">
          <div className="therm-frame">
            <div className="therm-scan" />
            <span className="therm-ts">02:47:13</span>
            <span className="therm-tag">thermal · zone b</span>
          </div>
          <div className="therm-meta">
            <div>
              <span className="l">clip hash</span>
              <span className="v">0x91d4…77af</span>
            </div>
            <div>
              <span className="l">operator</span>
              <span className="v">notified 02:47:41</span>
            </div>
            <div>
              <span className="l">response</span>
              <span className="v">on-site 02:56</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ops-foot">1,382 events today · 1,382 anchored · 0 challenged</div>
    </div>
  );
}
