import { useEffect, useRef } from "react";
import { type ApiRobot, connectEvents, fetchRobots } from "@/lib/api";
import { CRITICAL_TYPES, EVENT_NAMES, SITE_GEOHASH, geohashCenter } from "@/lib/geo";

type Unit = { id: string; site: string; lat: number; lon: number; status: "patrol" | "charge" | "incident"; batt: number };

/** Map on-chain robots to globe units (site geohash → coords; battery is illustrative). */
function mapRobots(robots: ApiRobot[]): Unit[] {
  return robots.map((r, i) => {
    const c = geohashCenter(SITE_GEOHASH[r.siteId] ?? "u4pru");
    const spread = 9;
    return {
      id: String(r.robotId),
      site: `site ${r.siteId}`,
      lat: c.lat + Math.sin(i * 2.3) * spread,
      lon: c.lon + Math.cos(i * 1.7) * spread,
      status: r.status === "ACTIVE" ? "patrol" : r.status === "SLASHED" ? "incident" : "charge",
      batt: 55 + ((i * 13) % 45),
    };
  });
}

const DEFAULTS: Unit[] = [
  { id: "042", site: "north lot", lat: 37.77, lon: -122.42, status: "patrol", batt: 82 },
  { id: "017", site: "rail yard", lat: 40.71, lon: -74.01, status: "charge", batt: 37 },
  { id: "088", site: "port terminal", lat: 51.5, lon: -0.12, status: "patrol", batt: 66 },
  { id: "103", site: "logistics park", lat: 48.85, lon: 2.35, status: "incident", batt: 74 },
  { id: "056", site: "data campus", lat: 35.68, lon: 139.69, status: "patrol", batt: 91 },
];
const ROUTINE = ["PATROL_START", "WAYPOINT_REACHED", "HEARTBEAT", "DOCK_CHARGE", "PATROL_END"];
const CRIT = ["INCIDENT_DETECTED", "ALERT_ESCALATED", "SIREN_TRIGGERED"];
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

function hx(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += "0123456789abcdef"[(Math.random() * 16) | 0];
  return s;
}
const pad = (v: number) => (v < 10 ? "0" : "") + v;

/** Live network globe + click-to-open confidential site view + on-chain activity monitor. */
export function Globe() {
  const root = useRef<HTMLDivElement>(null);
  const gcRef = useRef<HTMLCanvasElement>(null);
  const scRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = root.current;
    const gc = gcRef.current;
    const sc = scRef.current;
    if (!host || !gc || !sc) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gctx = gc.getContext("2d")!;
    const sctx = sc.getContext("2d")!;
    const stage = host.querySelector(".globe-stage") as HTMLElement;
    const feed = host.querySelector(".feed") as HTMLElement;
    const unitsEl = host.querySelector(".units") as HTMLElement;
    const set = (sel: string, v: string) => {
      const e = host.querySelector(sel);
      if (e) e.textContent = v;
    };
    // Live units — seeded with the demo fleet, replaced by real on-chain robots if the API is up.
    const units = DEFAULTS.map((u) => ({ ...u }));
    const setCount = () => set("[data-hudcount]", String(units.length));

    let W = 0, H = 0, R = 0, cx = 0, cy = 0;
    const fit = (cv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    };
    const resize = () => {
      const d = fit(gc, gctx);
      fit(sc, sctx);
      W = d.w; H = d.h; cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.4;
    };

    let rot = -1.15;
    const tilt = 0.4;
    let markerPos: { x: number; y: number; front: boolean; i: number }[] = [];
    const project = (lat: number, lon: number) => {
      const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180 + rot;
      const x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      return { x: cx + R * x, y: cy - R * y2, z: z2, front: z2 > 0 };
    };
    const arc = (ctx: CanvasRenderingContext2D, fn: (v: number) => { x: number; y: number; front: boolean }, step: number, a: number, b: number, color: string) => {
      ctx.beginPath();
      let on = false;
      for (let v = a; v <= b; v += step) {
        const p = fn(v);
        if (p.front) { on ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); on = true; } else on = false;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    let t = 0;
    const drawGlobe = () => {
      gctx.clearRect(0, 0, W, H);
      const g = gctx.createRadialGradient(cx - R * 0.32, cy - R * 0.36, R * 0.15, cx, cy, R * 1.05);
      g.addColorStop(0, "#15151b"); g.addColorStop(0.68, "#0d0d11"); g.addColorStop(1, "#090a0d");
      gctx.beginPath(); gctx.arc(cx, cy, R, 0, Math.PI * 2); gctx.fillStyle = g; gctx.fill();
      gctx.beginPath(); gctx.arc(cx, cy, R + 0.5, 0, Math.PI * 2); gctx.strokeStyle = "rgba(0,229,255,.13)"; gctx.lineWidth = 1; gctx.stroke();
      for (let la = -60; la <= 60; la += 30) arc(gctx, (lo) => project(la, lo), 5, -180, 180, "rgba(236,234,230,.08)");
      for (let lo = -180; lo < 180; lo += 30) arc(gctx, (la) => project(la, lo), 5, -90, 90, "rgba(236,234,230,.055)");
      markerPos = [];
      for (let i = 0; i < units.length; i++) {
        const u = units[i], p = project(u.lat, u.lon);
        markerPos.push({ x: p.x, y: p.y, front: p.front, i });
        if (!p.front) continue;
        const col = u.status === "incident" ? "0,229,255" : "87,201,135";
        const pr = Math.sin(t * 2.3 + i) * 0.5 + 0.5;
        gctx.beginPath(); gctx.arc(p.x, p.y, 4 + pr * 8, 0, Math.PI * 2); gctx.strokeStyle = `rgba(${col},${0.34 * (1 - pr)})`; gctx.lineWidth = 1; gctx.stroke();
        gctx.beginPath(); gctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); gctx.fillStyle = `rgb(${col})`; gctx.fill();
        if (p.z > 0.36) {
          gctx.font = "10px " + MONO;
          gctx.fillStyle = "rgba(236,234,230,.62)";
          gctx.fillText("unit " + u.id, p.x + 9, p.y + 3.5);
        }
      }
    };

    let focusI = -1, siteProg = 0, lastSeg = -1;
    const rrect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    };
    const drawSite = () => {
      sctx.clearRect(0, 0, W, H);
      sctx.strokeStyle = "rgba(236,234,230,.045)"; sctx.lineWidth = 1;
      for (let x = (W / 2) % 34; x <= W; x += 34) { sctx.beginPath(); sctx.moveTo(x, 0); sctx.lineTo(x, H); sctx.stroke(); }
      for (let y = (H / 2) % 34; y <= H; y += 34) { sctx.beginPath(); sctx.moveTo(0, y); sctx.lineTo(W, y); sctx.stroke(); }
      const mcx = W / 2, mcy = H / 2, rx = Math.min(W, H) * 0.3, ry = Math.min(W, H) * 0.21;
      sctx.strokeStyle = "rgba(236,234,230,.15)"; rrect(sctx, mcx - rx * 1.35, mcy - ry * 1.55, rx * 2.7, ry * 3.1, 10); sctx.stroke();
      sctx.setLineDash([4, 5]); sctx.strokeStyle = "rgba(0,229,255,.32)";
      sctx.beginPath(); sctx.ellipse(mcx, mcy, rx, ry, 0, 0, Math.PI * 2); sctx.stroke(); sctx.setLineDash([]);
      for (let k = 0; k < 6; k++) { const a0 = (k / 6) * Math.PI * 2; sctx.beginPath(); sctx.arc(mcx + rx * Math.cos(a0), mcy + ry * Math.sin(a0), 2, 0, Math.PI * 2); sctx.fillStyle = "rgba(236,234,230,.22)"; sctx.fill(); }
      const a = siteProg * Math.PI * 2, px = mcx + rx * Math.cos(a), py = mcy + ry * Math.sin(a);
      const scan = (t * 0.9) % (Math.PI * 2);
      const sg = sctx.createRadialGradient(px, py, 2, px, py, 30); sg.addColorStop(0, "rgba(87,201,135,.22)"); sg.addColorStop(1, "rgba(87,201,135,0)");
      sctx.beginPath(); sctx.moveTo(px, py); sctx.arc(px, py, 30, scan, scan + 0.55); sctx.closePath(); sctx.fillStyle = sg; sctx.fill();
      const pl = Math.sin(t * 3) * 0.5 + 0.5;
      sctx.beginPath(); sctx.arc(px, py, 3.4 + pl * 7, 0, Math.PI * 2); sctx.strokeStyle = "rgba(87,201,135,.3)"; sctx.lineWidth = 1; sctx.stroke();
      sctx.beginPath(); sctx.arc(px, py, 3.6, 0, Math.PI * 2); sctx.fillStyle = "#57c987"; sctx.fill();
      sctx.font = "10px " + MONO; sctx.fillStyle = "rgba(236,234,230,.34)"; sctx.fillText("geofence · u4pru", mcx - rx * 1.35 + 8, mcy - ry * 1.55 + 15);
      const seg = Math.floor(siteProg * 6);
      if (seg !== lastSeg) {
        lastSeg = seg;
        if (focusI >= 0) {
          const crit = Math.random() < 0.14;
          pushEvent(units[focusI].id, crit ? CRIT[(Math.random() * 3) | 0] : "WAYPOINT_REACHED", crit);
        }
      }
    };
    const redact = (v: number) => (v < 0 ? "-" : "") + Math.floor(Math.abs(v)) + ".██";
    const label = (s: Unit["status"]) => (s === "patrol" ? "on patrol" : s === "charge" ? "charging" : "incident");
    const focus = (i: number) => {
      const u = units[i];
      focusI = i; siteProg = Math.random(); lastSeg = -1;
      set("[data-cunit]", "s-1 · " + u.id);
      set("[data-csite]", u.site);
      set("[data-cstatus]", label(u.status));
      set("[data-ccoords]", redact(u.lat) + " · " + redact(u.lon));
      const batt = host.querySelector("[data-cbatt]") as HTMLElement | null;
      if (batt) batt.style.width = Math.round(u.batt) + "%";
      set("[data-cbattn]", Math.round(u.batt) + "%");
      stage.classList.add("zoomed");
    };

    // --- on-chain monitor ---
    const clock = () => {
      const s = ((simSec % 86400) + 86400) % 86400;
      return pad((s / 3600) | 0) + ":" + pad((s / 60 | 0) % 60) + ":" + pad(s % 60);
    };
    let simSec = 2 * 3600 + 47 * 60 + 3;
    function pushEvent(id: string, type: string, crit: boolean, instant?: boolean) {
      const row = document.createElement("div");
      row.className = "feed-row" + (crit ? " crit" : "");
      const tx = "0x" + hx(6);
      if (instant) {
        row.innerHTML = `<span class="t">${clock()}</span><span class="e">unit <b>${id}</b> · ${type} · <span style="color:#55544f">${tx}…</span></span><span class="s ok">anchored ✓</span>`;
      } else {
        row.innerHTML = `<span class="t">${clock()}</span><span class="e">unit <b>${id}</b> · ${type}</span><span class="s">pending</span>`;
        setTimeout(() => {
          const e = row.querySelector(".e")!, s = row.querySelector(".s")!;
          e.innerHTML = `unit <b>${id}</b> · ${type} · <span style="color:#55544f">${tx}…</span>`;
          s.className = "s ok"; s.textContent = "anchored ✓";
        }, 620 + Math.random() * 520);
      }
      feed.insertBefore(row, feed.firstChild);
      while (feed.children.length > 9) feed.removeChild(feed.lastChild!);
    }

    const renderUnits = () => {
      unitsEl.innerHTML = "";
      units.forEach((u, i) => {
        const row = document.createElement("div");
        row.className = "unit-row";
        row.innerHTML =
          `<span class="id">unit ${u.id}</span><span class="meta">${u.site}</span>` +
          `<span class="st"><span class="d ${u.status}"></span>${label(u.status)} · ${Math.round(u.batt)}%</span>`;
        row.addEventListener("click", () => focus(i));
        unitsEl.appendChild(row);
      });
    };
    const drift = () => {
      units.forEach((u) => {
        if (u.status === "charge") { u.batt = Math.min(100, u.batt + 1.4); if (u.batt >= 98) u.status = "patrol"; }
        else { u.batt = Math.max(6, u.batt - 0.5); if (u.batt <= 10) u.status = "charge"; }
      });
      if (Math.random() < 0.12) { const n = units[(Math.random() * units.length) | 0]; if (n.status !== "charge") n.status = n.status === "incident" ? "patrol" : "incident"; }
      renderUnits();
      if (focusI >= 0) set("[data-cstatus]", label(units[focusI].status));
    };

    // --- interaction ---
    const onClick = (e: MouseEvent) => {
      const r = gc.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      let best = -1, bd = 18;
      for (const m of markerPos) { if (!m.front) continue; const d = Math.hypot(m.x - mx, m.y - my); if (d < bd) { bd = d; best = m.i; } }
      if (best >= 0) focus(best);
    };
    const onMove = (e: MouseEvent) => {
      const r = gc.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      let hit = false;
      for (const m of markerPos) { if (m.front && Math.hypot(m.x - mx, m.y - my) < 18) { hit = true; break; } }
      gc.style.cursor = hit ? "pointer" : "default";
    };
    gc.addEventListener("click", onClick);
    gc.addEventListener("mousemove", onMove);
    const back = host.querySelector("[data-confback]");
    const onBack = () => { stage.classList.remove("zoomed"); focusI = -1; };
    back?.addEventListener("click", onBack);

    // --- boot ---
    resize();
    renderUnits();
    setCount();
    set("[data-hudclock]", clock());
    let running = true;
    let raf = 0;
    let clkT = 0, emitT = 0, driftT = 0;
    let stopWS = () => {};
    let disposed = false;
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // Pull real robots from the backend if VITE_API_URL is set; otherwise keep the demo fleet.
    void (async () => {
      const robots = await fetchRobots();
      if (disposed || !robots || robots.length === 0) return;
      units.length = 0;
      mapRobots(robots).forEach((u) => units.push(u));
      renderUnits();
      setCount();
    })();

    if (reduce) {
      drawGlobe();
      ["PATROL_START", "WAYPOINT_REACHED", "HEARTBEAT", "INCIDENT_DETECTED", "WAYPOINT_REACHED", "DOCK_CHARGE"].forEach((ty, k) =>
        pushEvent(units[k % units.length].id, ty, CRIT.indexOf(ty) >= 0, true)
      );
    } else {
      pushEvent(units[0].id, "WAYPOINT_REACHED", false, true);
      pushEvent(units[2].id, "PATROL_START", false, true);
      const io = new IntersectionObserver(([e]) => (running = e.isIntersecting), { threshold: 0 });
      io.observe(stage);
      const frame = () => {
        if (running) {
          t += 0.016; rot += 0.0015; drawGlobe();
          if (focusI >= 0) { siteProg = (siteProg + 0.0016) % 1; drawSite(); }
        }
        raf = requestAnimationFrame(frame);
      };
      frame();
      clkT = window.setInterval(() => { simSec++; set("[data-hudclock]", clock()); }, 1000);
      emitT = window.setInterval(() => {
        if (document.hidden) return;
        const u = units[(Math.random() * units.length) | 0], crit = Math.random() < 0.11;
        pushEvent(u.id, crit ? CRIT[(Math.random() * 3) | 0] : ROUTINE[(Math.random() * ROUTINE.length) | 0], crit);
      }, 1700);
      driftT = window.setInterval(drift, 2600);
      // Live on-chain events (WS /ws) supersede the simulation as soon as they arrive.
      stopWS = connectEvents((e) => {
        if (emitT) { clearInterval(emitT); emitT = 0; }
        const name = EVENT_NAMES[e.eventType] ?? "EVENT";
        const crit = e.isCritical ?? CRITICAL_TYPES.has(e.eventType);
        pushEvent(String(e.robotId), name, crit);
      });
      return () => {
        disposed = true;
        stopWS();
        io.disconnect();
        cancelAnimationFrame(raf);
        clearInterval(clkT); clearInterval(emitT); clearInterval(driftT);
        window.removeEventListener("resize", onResize);
        gc.removeEventListener("click", onClick);
        gc.removeEventListener("mousemove", onMove);
        back?.removeEventListener("click", onBack);
      };
    }
    return () => {
      disposed = true;
      stopWS();
      window.removeEventListener("resize", onResize);
      gc.removeEventListener("click", onClick);
      gc.removeEventListener("mousemove", onMove);
      back?.removeEventListener("click", onBack);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.06fr_0.94fr] lg:gap-9" ref={root}>
      <div className="globe-stage">
        <canvas ref={gcRef} id="globeCanvas" />
        <canvas ref={scRef} id="siteCanvas" />
        <div className="globe-hud">
          <span className="live">
            <span className="dot" />
            network
          </span>
          &nbsp;· <span data-hudcount>5</span> units live · <span data-hudclock>02:47:03</span>
        </div>
        <div className="globe-foot">
          <span>orthographic · live telemetry</span>
          <span>click a marker to focus</span>
        </div>
        <div className="conf">
          <div className="conf-top">
            <span className="conf-tag">
              <span className="dot" />
              confidential — live site view
            </span>
            <button className="conf-back" data-confback type="button">
              ← network
            </button>
          </div>
          <div className="conf-bottom">
            <div className="conf-meta">
              <div className="cm"><span className="l">unit</span><span className="v" data-cunit>—</span></div>
              <div className="cm"><span className="l">site</span><span className="v" data-csite>—</span></div>
              <div className="cm"><span className="l">status</span><span className="v" data-cstatus>—</span></div>
              <div className="cm"><span className="l">coords</span><span className="v" data-ccoords>██.███ · ██.███</span></div>
            </div>
            <div className="conf-batt">
              <span className="l">battery</span>
              <span className="bar"><i data-cbatt /></span>
              <span className="v" data-cbattn>—</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ops-side">
        <div className="panel p-feed">
          <div className="panel-h">
            <span>on-chain activity</span>
            <span className="live">
              <span className="dot" />
              anchoring
            </span>
          </div>
          <div className="feed" />
        </div>
        <div className="panel p-units">
          <div className="panel-h">
            <span>units</span>
            <span>proof-of-patrol</span>
          </div>
          <div className="units" />
        </div>
      </div>
    </div>
  );
}
