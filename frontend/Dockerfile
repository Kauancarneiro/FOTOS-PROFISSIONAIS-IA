FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

RUN chown node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

EXPOSE 5173

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0"]
