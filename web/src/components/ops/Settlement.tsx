import { useEffect, useRef } from "react";

function hx(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += "0123456789abcdef"[(Math.random() * 16) | 0];
  return s;
}
const h48 = () => "0x" + hx(4) + "…" + hx(4);
const pad = (v: number) => (v < 10 ? "0" : "") + v;
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Screen 3 — on-chain settlement: proof batches + epoch summary, incrementing block. */
export function Settlement() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scr = root.current;
    if (!scr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = scr.querySelector(".cb-list") as HTMLElement;
    const blockEl = scr.querySelector("[data-block]") as HTMLElement | null;
    const barEl = scr.querySelector("[data-bar]") as HTMLElement | null;
    const pctEl = scr.querySelector("[data-pct]") as HTMLElement | null;

    let block = 8412930;
    let batchNo = 4112;
    let winEnd = 4 * 60 + 20;
    let epoch = 81;
    const MAX = 5;
    const hm = (m: number) => {
      m = ((m % 1440) + 1440) % 1440;
      return pad((m / 60) | 0) + ":" + pad(m % 60);
    };
    const addBatch = (no: number, from: string, to: string, pending: boolean) => {
      const r = document.createElement("div");
      r.className = "cb-row" + (pending ? " new" : "");
      const ev = 40 + ((Math.random() * 20) | 0);
      r.innerHTML =
        `<div class="cb-l1">batch <b>#${commas(no)}</b> · ${from}→${to} · <span class="ops-cy">${ev}</span> ev</div>` +
        `<div class="cb-l2"><span>root <span class="mut">${h48()}</span> · tx <span class="mut">${h48()}</span></span>` +
        `<span class="cb-st ${pending ? "pend" : "ok"}">${pending ? "pending…" : "confirmed ✓"}</span></div>`;
      list.insertBefore(r, list.firstChild);
      while (list.children.length > MAX) list.removeChild(list.lastElementChild!);
      return r;
    };

    let we = winEnd;
    let no = batchNo;
    for (let k = 0; k < MAX; k++) {
      addBatch(no, hm(we - 10), hm(we), false);
      no--;
      we -= 10;
    }
    if (blockEl) blockEl.textContent = commas(block);

    let blkT = 0;
    let batchT = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (reduce) return;
          if (!blkT)
            blkT = window.setInterval(() => {
              block += 1 + ((Math.random() * 3) | 0);
              if (blockEl) blockEl.textContent = commas(block);
              if (epoch < 99) {
                epoch += 0.1;
                if (barEl) barEl.style.width = epoch.toFixed(1) + "%";
                if (pctEl) pctEl.textContent = Math.round(epoch) + "%";
              }
            }, 4000);
          if (!batchT)
            batchT = window.setInterval(() => {
              batchNo++;
              winEnd += 10;
              const r = addBatch(batchNo, hm(winEnd - 10), hm(winEnd), true);
              setTimeout(() => {
                const st = r.querySelector(".cb-st");
                if (st) {
                  st.className = "cb-st ok";
                  st.textContent = "confirmed ✓";
                }
              }, 2000);
            }, 12000);
        } else {
          if (blkT) { clearInterval(blkT); blkT = 0; }
          if (batchT) { clearInterval(batchT); batchT = 0; }
        }
      },
      { threshold: 0 }
    );
    io.observe(scr);
    return () => {
      io.disconnect();
      if (blkT) clearInterval(blkT);
      if (batchT) clearInterval(batchT);
    };
  }, []);

  return (
    <div className="ops-screen" ref={root}>
      <div className="ops-top">
        <span className="ttl">
          <b>sentinel ops v0.4</b> — settlement · epoch 217 · robinhood chain
        </span>
        <span className="ops-live">
          <span className="d" />
          synced — block <span data-block>8,412,930</span>
        </span>
      </div>
      <div className="chain-body">
        <div className="chain-batches">
          <div className="cb-h">proof batches</div>
          <div className="cb-list" />
        </div>
        <div className="chain-epoch">
          <div className="ce-h">epoch summary</div>
          <div className="ce-rows">
            <div className="ce-row"><span className="l">verified patrol hours</span><span className="v ops-cy">9.7 h</span></div>
            <div className="ce-row"><span className="l">incidents anchored</span><span className="v">2</span></div>
            <div className="ce-row"><span className="l">uptime</span><span className="v">99.4%</span></div>
            <div className="ce-row"><span className="l">subscription settled</span><span className="v">1,150 usdc → treasury</span></div>
            <div className="ce-row"><span className="l">operator reward</span><span className="v ops-cy">412 sntl · released</span></div>
          </div>
          <div className="ce-prog">
            <div className="ce-prog-l"><span>epoch 217</span><span data-pct>81%</span></div>
            <div className="ce-bar"><i data-bar /></div>
          </div>
        </div>
      </div>
      <div className="ops-foot">every figure above is independently verifiable on-chain</div>
    </div>
  );
}
