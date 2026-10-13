FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@9 --activate

RUN chown node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

EXPOSE 3001

CMD ["sh", "-c", "pnpm prisma generate && pnpm prisma migrate deploy && pnpm dev"]
