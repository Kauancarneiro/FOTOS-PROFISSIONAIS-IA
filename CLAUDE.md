# FOTOS-PROFISSIONAIS-IA

Sistema que gera fotos profissionais com IA a partir de selfies do cliente, com pagamento via Pix. O plano completo do MVP está em [docs/plano-mvp.md](docs/plano-mvp.md); leia antes de qualquer tarefa.

## Regras de trabalho

- **Idioma:** responder sempre em português do Brasil (pt-BR), inclusive textos de PR, documentação e mensagens.
- **Git:**
  - Toda alteração é feita numa branch nova (ex.: `feat/<assunto>`), nunca direto na `main`.
  - **Nunca fazer `git commit` nem `git push` sem o usuário pedir explicitamente.** Quem commita e faz o push é o usuário.
  - Ao terminar uma tarefa, entregar a descrição do PR pronta para colar no GitHub (em português, markdown).
- **Código sem comentários.** O "porquê" de cada decisão vai para a documentação, não para o código. Diretivas exigidas por ferramentas (ex.: `eslint-disable`) não contam como comentário.
- **Documentação por funcionalidade:** cada menu ou funcionalidade nova ganha (ou atualiza) um `.md` em `docs/funcionalidades/` explicando o que foi feito, as regras e o motivo das decisões. Listar o `.md` criado/atualizado na resposta final.

## Stack

Mesma stack do projeto irmão `impressao-fotos` (em `/home/dev-10/impressao-fotos`), que pode servir de referência de padrões:

- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: React + Vite + TypeScript
- Gerenciador de pacotes: pnpm
- Infra: Docker + docker-compose

## Hospedagem

Produção numa VPS Hostinger própria, separada dos outros projetos. Ainda sem domínio; deploy fica para depois do MVP.
