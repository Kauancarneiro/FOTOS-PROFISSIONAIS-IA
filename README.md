# Fotos Profissionais com IA

O cliente envia de 6 a 10 selfies, paga via Pix e recebe de 10 a 60 fotos profissionais geradas por IA.

O plano do MVP (produto, pacotes, arquitetura e cronograma) está em [docs/plano-mvp.md](docs/plano-mvp.md). Cada menu e funcionalidade tem a sua explicação em [docs/funcionalidades/](docs/funcionalidades/README.md). O código não tem comentários: as explicações ficam nesses arquivos.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind v4 + shadcn/ui
- **Backend**: Node/Express + TypeScript + Prisma + PostgreSQL
- **Dev**: Docker Compose

## Rodando localmente

Pré-requisito: Docker. Não é preciso ter Node nem pnpm instalados na máquina.

```bash
cp backend/.env.example backend/.env
docker compose up -d
docker compose run --rm -u node backend pnpm prisma db seed
```

O backend aplica as migrations sozinho ao subir. O seed cadastra os pacotes e os estilos do plano e pode rodar mais de uma vez sem duplicar nada.

- Frontend: http://localhost:5175
- Backend: http://localhost:3003 (health check em `/health`)
- Postgres: `localhost:5434` (usuário `fotosia`, senha `fotosia123`, banco `fotos_ia`)

### Comandos úteis

```bash
docker compose run --rm -u node backend pnpm prisma migrate dev --name <nome>
docker compose run --rm -u node backend pnpm typecheck
docker compose run --rm -u node frontend pnpm build
docker compose logs -f backend
```

Ao adicionar uma dependência, rode o `pnpm add` dentro do container e depois `docker compose build` para a imagem pegar o lockfile novo.

### Tela dá 404 depois de reiniciar o PC ou o Docker Desktop

No WSL, o Docker Desktop religa os containers antes de o Ubuntu estar pronto, e a pasta do projeto é montada vazia dentro do container. Por isso o backend e o frontend conferem se os arquivos estão lá antes de subir: se não estiverem, saem com erro e o Docker tenta de novo a cada poucos segundos. Nos logs aparece `Pasta do projeto ainda não montada, tentando de novo`. Se continuar assim por mais de um minuto, rode `docker compose up -d --force-recreate backend frontend`.

## Acesso externo (ngrok)

Útil para testar o webhook do Pix, que precisa de um endereço público:

```bash
cp .env.example .env
docker compose --profile ngrok up -d
```

O endereço público aparece em http://localhost:4042.

## Portas

Este repositório roda na mesma máquina que o `clinica-terapia` e o `impressao-fotos`, então as portas de host são deslocadas para não colidir: `5434` (Postgres), `3003` (backend), `5175` (frontend) e `4042` (painel do ngrok).
