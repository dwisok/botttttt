import { useEffect, useRef } from "react";

const WP = [
  ["01", 58, 44],
  ["02", 160, 44],
  ["03", 262, 44],
  ["04", 262, 100],
  ["05", 262, 156],
  ["06", 160, 156],
  ["07", 58, 156],
  ["08", 58, 100],
] as const;

const TIMES = ["00:12", "00:38", "01:05", "01:33", "02:01", "02:29", "02:54", "03:20"];

/** Screen 1 — a robot travelling the learned patrol route on a top-down site map. */
export function OpsMap() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scr = root.current;
    if (!scr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = scr.querySelector("[data-loop]") as SVGPathElement | null;
    const marker = scr.querySelector("[data-marker]") as SVGGElement | null;
    const wps = Array.from(scr.querySelectorAll("[data-wp]")) as SVGGElement[];
    const side = Array.from(scr.querySelectorAll(".wp-list li")) as HTMLLIElement[];
    if (!loop || !marker) return;

    const L = loop.getTotalLength();
    const wpLen = WP.map(([, wx, wy]) => {
      let best = 0;
      let bd = 1e9;
      for (let s = 0; s <= L; s += 2) {
        const p = loop.getPointAtLength(s);
        const d = (p.x - wx) ** 2 + (p.y - wy) ** 2;
        if (d < bd) {
          bd = d;
          best = s;
        }
      }
      return best;
    });
    const setCur = (i: number) => side.forEach((li, k) => li.classList.toggle("cur", k === i));

    const p0 = loop.getPointAtLength(0);
    marker.setAttribute("transform", `translate(${p0.x},${p0.y})`);
    setCur(0);

    let raf = 0;
    let t0: number | null = null;
    const DUR = 40000;
    let last = -1;
    const step = (ts: number) => {
      if (t0 == null) t0 = ts;
      const len = (((ts - t0) % DUR) / DUR) * L;
      const p = loop.getPointAtLength(len);
      const p2 = loop.getPointAtLength((len + 2) % L);
      const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 90;
      marker.setAttribute("transform", `translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
      let ni = 0;
      let nd = 1e9;
      for (let i = 0; i < wpLen.length; i++) {
        let dd = Math.abs(len - wpLen[i]);
        dd = Math.min(dd, L - dd);
        if (dd < nd) {
          nd = dd;
          ni = i;
        }
      }
      if (nd < 7 && ni !== last) {
        last = ni;
        setCur(ni);
        const g = wps[ni];
        g.classList.add("pulse");
        setTimeout(() => g.classList.remove("pulse"), 900);
      }
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!reduce && !raf) {
            t0 = null;
            raf = requestAnimationFrame(step);
          }
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(scr);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ops-screen" ref={root}>
      <div className="ops-top">
        <span className="ttl">
          <b>sentinel ops v0.4</b> — site: eastgate logistics · <b>unit 042</b>
        </span>
        <span className="ops-live">
          <span className="d" />
          patrolling
        </span>
      </div>
      <div className="map-body">
        <div className="map-side">
          <div className="map-side-h">route · site map</div>
          <ul className="wp-list">
            {WP.map(([n], i) => (
              <li key={n}>
                <span>wp-{n}</span>
                <span className="wt">{TIMES[i]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="map-canvas">
          <svg className="map-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <rect className="fence" x="12" y="12" width="296" height="176" />
            <rect className="gate" x="146" y="185" width="28" height="6" />
            <text x="160" y="199">gate</text>
            <rect className="bld" x="122" y="80" width="76" height="40" />
            <line className="thin" x1="122" y1="120" x2="198" y2="120" />
            <rect className="dock" x="132" y="120" width="10" height="5" />
            <rect className="dock" x="150" y="120" width="10" height="5" />
            <rect className="dock" x="168" y="120" width="10" height="5" />
            <text x="160" y="104">warehouse</text>
            <g className="park">
              <rect x="66" y="64" width="44" height="64" />
              <line x1="66" y1="85" x2="110" y2="85" />
              <line x1="66" y1="107" x2="110" y2="107" />
              <line x1="88" y1="64" x2="88" y2="128" />
            </g>
            <g className="park">
              <rect x="210" y="64" width="44" height="64" />
              <line x1="210" y1="85" x2="254" y2="85" />
              <line x1="210" y1="107" x2="254" y2="107" />
              <line x1="232" y1="64" x2="232" y2="128" />
            </g>
            <path data-loop className="loop" d="M58,44 L160,44 L262,44 L262,100 L262,156 L160,156 L58,156 L58,100 Z" />
            <g>
              {WP.map(([n, x, y]) => (
                <g key={n} data-wp className="wp" transform={`translate(${x},${y})`}>
                  <circle r="3.2" />
                  <text y={y === 44 ? "-6" : y === 156 ? "11" : "0"} x={x === 262 && y === 100 ? "8" : x === 58 && y === 100 ? "-8" : "0"}>
                    {n}
                  </text>
                </g>
              ))}
            </g>
            <g data-marker className="marker" transform="translate(58,44)">
              <polygon className="cone" points="0,-9 4.5,3 -4.5,3" />
              <circle className="mdot" r="3" />
            </g>
          </svg>
        </div>
      </div>
      <div className="ops-foot">route learned 2026-03-14 · 412 loops completed · deviation 0.2 m</div>
    </div>
  );
}
