import { promises as fs } from "node:fs";
import path from "node:path";

export type AulaBloco = {
  ordem: number;
  slide: string;
  parabola_real: string;
  comparacao: string;
  direto_ao_ponto: string;
  fixacao: string;
  cta_gamificado: string;
  base_em_raspagem: string[];
};

export type Aula01 = {
  meta: {
    id: string;
    titulo: string;
    url_origem: string;
    fonte_obrigatoria: string;
    persona_aplicada: string;
  };
  topicos_origem: string[];
  blocos: AulaBloco[];
};

const AULA_PATH = path.resolve(process.cwd(), "../content/aulas/aula-01.json");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAula01(value: unknown): value is Aula01 {
  if (!value || typeof value !== "object") return false;
  const parsed = value as Partial<Aula01>;

  if (!parsed.meta || typeof parsed.meta !== "object") return false;
  if (!isNonEmptyString(parsed.meta.id)) return false;
  if (!isNonEmptyString(parsed.meta.titulo)) return false;
  if (!isNonEmptyString(parsed.meta.url_origem)) return false;
  if (!isNonEmptyString(parsed.meta.fonte_obrigatoria)) return false;
  if (!isNonEmptyString(parsed.meta.persona_aplicada)) return false;
  if (!isStringArray(parsed.topicos_origem)) return false;
  if (!Array.isArray(parsed.blocos) || parsed.blocos.length === 0) return false;

  return parsed.blocos.every((bloco) => {
    if (!bloco || typeof bloco !== "object") return false;
    return (
      typeof bloco.ordem === "number" &&
      isNonEmptyString(bloco.slide) &&
      isNonEmptyString(bloco.parabola_real) &&
      isNonEmptyString(bloco.comparacao) &&
      isNonEmptyString(bloco.direto_ao_ponto) &&
      isNonEmptyString(bloco.fixacao) &&
      isNonEmptyString(bloco.cta_gamificado) &&
      isStringArray(bloco.base_em_raspagem)
    );
  });
}

export async function loadAula01(): Promise<Aula01 | null> {
  try {
    const raw = await fs.readFile(AULA_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isAula01(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
