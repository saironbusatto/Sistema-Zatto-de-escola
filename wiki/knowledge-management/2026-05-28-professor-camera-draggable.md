# 2026-05-28 — Câmera do professor flutuante e arrastável

## O que mudou
- Alterado `apps/ws-server/public/professor.html` para tornar o PiP da câmera livre/arrastável.
- Posição inicial movida para canto inferior direito (fora da coluna de perguntas/respostas).
- Adicionada alça `arraste a câmera` para reposicionar sem interferir nos botões.
- Última posição escolhida fica salva em `localStorage` (`zatto.professor.camPipPos`).

## Por que mudou
- Evitar que a câmera cubra o painel de perguntas e respostas durante a aula.

## Evidências de validação
- Arquivo alterado:
  - `apps/ws-server/public/professor.html`
- Novos elementos/comportamentos:
  - classe `.cam-pip-handle`
  - função `initCamPipDrag()`
  - persistência de posição via `localStorage`
