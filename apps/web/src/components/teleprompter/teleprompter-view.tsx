"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Aula01 } from "@/lib/aula01";

type StateUpdate = {
  type: "state_update";
  blocoLiberado?: number;
};

function wsUrlFromWindow() {
  const base = process.env.NEXT_PUBLIC_WS_SERVER_URL;
  if (base) {
    if (base.startsWith("ws://") || base.startsWith("wss://")) return base;
    if (base.startsWith("http://")) return base.replace("http://", "ws://");
    if (base.startsWith("https://")) return base.replace("https://", "wss://");
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.hostname}:3000`;
}

export function TeleprompterView({ aula }: { aula: Aula01 }) {
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed">(
    "connecting"
  );
  const [blocoAtual, setBlocoAtual] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const total = aula.blocos.length;
  const bloco = aula.blocos[blocoAtual];

  useEffect(() => {
    const ws = new WebSocket(wsUrlFromWindow());
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("open");
      ws.send(JSON.stringify({ type: "professor_connect" }));
    };

    ws.onclose = () => setWsStatus("closed");
    ws.onerror = () => setWsStatus("closed");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as StateUpdate;
        if (msg.type !== "state_update") return;
        if (typeof msg.blocoLiberado !== "number") return;
        if (msg.blocoLiberado < 0) {
          setBlocoAtual(0);
          return;
        }
        const idx = Math.max(0, Math.min(msg.blocoLiberado, total - 1));
        setBlocoAtual(idx);
      } catch {
        // ignora mensagens fora do contrato esperado
      }
    };

    return () => {
      wsRef.current = null;
      ws.close();
    };
  }, [total]);

  const progress = useMemo(() => ((blocoAtual + 1) / total) * 100, [blocoAtual, total]);

  function navegarPara(offset: number) {
    setBlocoAtual((atual) => {
      const prox = Math.max(0, Math.min(total - 1, atual + offset));
      const ws = wsRef.current;
      if (ws?.readyState === WebSocket.OPEN && prox !== atual) {
        ws.send(JSON.stringify({ type: "liberar_bloco", bloco: prox }));
      }
      return prox;
    });
  }

  return (
    <main className="min-h-dvh bg-[#0f141c] text-[#e8edf4]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8ca0bb]">Teleprompter</p>
            <h1 className="font-serif text-2xl">{aula.meta.titulo}</h1>
          </div>
          <div className="text-xs">
            <span
              className={`rounded-full border px-3 py-1 ${
                wsStatus === "open"
                  ? "border-emerald-400 text-emerald-300"
                  : wsStatus === "connecting"
                    ? "border-amber-400 text-amber-300"
                    : "border-rose-400 text-rose-300"
              }`}
            >
              ws: {wsStatus}
            </span>
          </div>
        </header>

        <div className="mb-5 h-2 w-full rounded bg-[#1f2a3a]">
          <div className="h-2 rounded bg-[#5aa4ff]" style={{ width: `${progress}%` }} />
        </div>

        <section className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-2xl border border-[#2a3546] bg-[#151d29] p-5">
            <p className="mb-2 text-xs text-[#9fb0c7]">Slide {blocoAtual + 1} de {total}</p>
            <h2 className="mb-4 font-serif text-3xl leading-tight">{bloco.slide}</h2>
            <p className="mb-3 text-[#d6e0ee]">{bloco.parabola_real}</p>
            <p className="mb-3 text-[#d6e0ee]">{bloco.comparacao}</p>
            <p className="mb-3 text-[#d6e0ee]">{bloco.direto_ao_ponto}</p>
            <p className="text-[#b8c7da]">{bloco.fixacao}</p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#324257] px-3 py-1.5 text-sm disabled:opacity-40"
                onClick={() => navegarPara(-1)}
                disabled={blocoAtual === 0}
              >
                Anterior
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#5aa4ff] px-3 py-1.5 text-sm font-semibold text-[#0b1220] disabled:opacity-40"
                onClick={() => navegarPara(1)}
                disabled={blocoAtual === total - 1}
              >
                Próximo
              </button>
            </div>
          </article>

          <aside className="rounded-2xl border border-[#2a3546] bg-[#131a24] p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#9fb0c7]">CTA do professor</h3>
            <p className="mb-5 rounded-xl border border-[#2d4157] bg-[#0f1622] p-3 text-sm text-[#d7e3f5]">
              {bloco.cta_gamificado}
            </p>

            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#9fb0c7]">Lembretes da aula</h4>
            <ul className="mb-5 space-y-2 text-sm text-[#b9c7db]">
              {aula.topicos_origem.map((item) => (
                <li key={item} className="rounded-lg border border-[#263244] bg-[#0f1622] p-2">
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#9fb0c7]">Base da raspagem</h4>
            <ul className="space-y-2 text-sm text-[#b9c7db]">
              {bloco.base_em_raspagem.map((item) => (
                <li key={item} className="rounded-lg border border-[#263244] bg-[#0f1622] p-2">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
