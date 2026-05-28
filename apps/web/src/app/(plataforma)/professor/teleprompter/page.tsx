import { loadAula01 } from "@/lib/aula01";
import { TeleprompterView } from "@/components/teleprompter/teleprompter-view";

export default async function ProfessorTeleprompterPage() {
  const aula = await loadAula01();

  if (!aula) {
    return (
      <main className="min-h-dvh grid place-items-center bg-[#0f141c] text-[#e8edf4] p-6">
        <div className="max-w-xl rounded-2xl border border-rose-400/50 bg-rose-950/20 p-5">
          <h1 className="text-xl font-semibold mb-2">Aula 01 indisponível</h1>
          <p className="text-sm text-[#d2dbee]">
            Não foi possível carregar <code>apps/content/aulas/aula-01.json</code>.
            Verifique se o arquivo existe e está em JSON válido.
          </p>
        </div>
      </main>
    );
  }

  return <TeleprompterView aula={aula} />;
}
