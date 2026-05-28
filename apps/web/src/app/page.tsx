import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ROLE_DEST: Record<string, string> = {
  root: "/admin",
  professor: "/professor",
  aluno: "/aluno",
};

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    try {
      const res = await fetch(
        `${process.env.WS_SERVER_INTERNAL_URL ?? "http://ws-server:3000"}/api/platform/me`,
        {
          headers: { "x-clerk-user-id": userId },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const user = await res.json();
        const dest = ROLE_DEST[user.role];
        if (dest) redirect(dest);
      }
    } catch {
      // ws-server indisponível — continua na landing
    }
  }

  return (
    <main
      className="min-h-dvh text-[#e8edf4]"
      style={{
        background:
          "radial-gradient(900px 500px at 90% -20%, rgba(90,164,255,.18), transparent 60%), radial-gradient(800px 420px at 0% 0%, rgba(51,196,129,.12), transparent 55%), #0f141c",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
        <header className="flex justify-between items-center mb-10">
          <span className="font-serif text-xl font-semibold">Zatto Escola</span>
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-xl border border-[#2a3546] text-sm font-bold hover:bg-[#1a2336] transition-colors"
          >
            Entrar
          </Link>
        </header>

        <section className="grid md:grid-cols-[1.2fr_.8fr] gap-4 mb-6">
          <div className="border border-[#2a3546] rounded-2xl p-6 bg-white/[.01]">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-3">
              Ensino ao vivo com aula interativa, prática e gamificação
            </h1>
            <p className="text-[#9fb0c7] text-base leading-relaxed mb-6">
              O professor conduz blocos liberados em tempo real, quizzes,
              exercícios e interação contínua com os alunos.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Aula síncrona", "Quiz em tempo real", "Pergunta aberta", "Câmera do professor", "Desenho colaborativo"].map(
                (p) => (
                  <span
                    key={p}
                    className="text-xs border border-[#2a3546] text-[#c7d4e5] rounded-full px-3 py-1"
                  >
                    {p}
                  </span>
                )
              )}
            </div>
            <Link
              href="/sign-in"
              className="inline-block bg-[#5aa4ff] text-[#0b1220] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#7bb8ff] transition-colors"
            >
              Acessar plataforma
            </Link>
          </div>

          <div className="border border-[#2a3546] rounded-2xl p-5 bg-white/[.01] grid grid-cols-2 gap-3 content-start">
            {[
              { label: "Live", sub: "WebSocket + WebRTC" },
              { label: "7 blocos", sub: "Progressão guiada" },
              { label: "Interação", sub: "Resposta, bolhas e quiz" },
              { label: "Mobile", sub: "Foco em aluno" },
            ].map((k) => (
              <div
                key={k.label}
                className="bg-[#151d29] border border-[#2a3546] rounded-xl p-3"
              >
                <b className="text-lg block">{k.label}</b>
                <span className="text-[#9fb0c7] text-xs">{k.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="border border-[#2a3546] rounded-2xl p-5 bg-white/[.01]">
            <h2 className="text-lg font-semibold mb-3">Features atuais</h2>
            <ul className="space-y-1.5 text-[#d4deea] text-sm">
              {[
                "Liberação de blocos pelo professor",
                "Perguntas abertas com respostas em tempo real",
                "Quiz com resultado instantâneo",
                "Exercícios orientados por framework",
                "Câmera ao vivo do professor para alunos",
                "Login com Clerk (aluno e professor)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-[#33c481] font-bold">●</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#2a3546] rounded-2xl p-5 bg-white/[.01]">
            <h2 className="text-lg font-semibold mb-3">Roadmap</h2>
            <ul className="space-y-1.5 text-[#c7d3e6] text-sm list-disc list-inside">
              {[
                "Gamificação por trilhas, pontuação e badges",
                "Relatórios de progresso por turma/aluno",
                "Banco de aulas reutilizáveis por módulo",
                "Dashboard de engajamento em tempo real",
                "Biblioteca de exercícios com IA",
                "Integração com domínio e SSO corporativo",
              ].map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-8 text-center text-[#8ca0bb] text-xs">
          Plataforma de ensino ao vivo · versão em evolução contínua
        </footer>
      </div>
    </main>
  );
}
