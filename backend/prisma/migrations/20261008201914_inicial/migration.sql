-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('RASCUNHO', 'AGUARDANDO_PAGAMENTO', 'NA_FILA', 'GERANDO', 'CONCLUIDO', 'FALHOU', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusFoto" AS ENUM ('PENDENTE', 'GERANDO', 'PRONTA', 'FALHOU');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'EXPIRADO', 'CANCELADO', 'ESTORNADO');

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacotes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "quantidade_fotos" INTEGER NOT NULL,
    "quantidade_estilos" INTEGER,
    "prioridade" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estilos" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "prompt" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estilos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" UUID NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "pacote_id" INTEGER NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'RASCUNHO',
    "valor" DECIMAL(10,2) NOT NULL,
    "termos_aceitos_em" TIMESTAMP(3),
    "concluido_em" TIMESTAMP(3),
    "selfies_apagadas_em" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_estilos" (
    "pedido_id" UUID NOT NULL,
    "estilo_id" INTEGER NOT NULL,

    CONSTRAINT "pedido_estilos_pkey" PRIMARY KEY ("pedido_id","estilo_id")
);

-- CreateTable
CREATE TABLE "selfies" (
    "id" SERIAL NOT NULL,
    "pedido_id" UUID NOT NULL,
    "arquivo" TEXT NOT NULL,
    "nome_original" TEXT,
    "hash" TEXT NOT NULL,
    "largura_px" INTEGER NOT NULL,
    "altura_px" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selfies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos_geradas" (
    "id" SERIAL NOT NULL,
    "pedido_id" UUID NOT NULL,
    "estilo_id" INTEGER NOT NULL,
    "status" "StatusFoto" NOT NULL DEFAULT 'PENDENTE',
    "arquivo" TEXT,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "erro" TEXT,
    "custo" DECIMAL(10,4),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fotos_geradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "pedido_id" UUID NOT NULL,
    "gateway" TEXT NOT NULL,
    "id_externo" TEXT NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "valor" DECIMAL(10,2) NOT NULL,
    "pix_copia_e_cola" TEXT,
    "expira_em" TIMESTAMP(3),
    "pago_em" TIMESTAMP(3),
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pacotes_nome_key" ON "pacotes"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "estilos_slug_key" ON "estilos"("slug");

-- CreateIndex
CREATE INDEX "pedidos_status_idx" ON "pedidos"("status");

-- CreateIndex
CREATE UNIQUE INDEX "selfies_pedido_id_hash_key" ON "selfies"("pedido_id", "hash");

-- CreateIndex
CREATE INDEX "fotos_geradas_status_idx" ON "fotos_geradas"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_gateway_id_externo_key" ON "pagamentos"("gateway", "id_externo");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_pacote_id_fkey" FOREIGN KEY ("pacote_id") REFERENCES "pacotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_estilos" ADD CONSTRAINT "pedido_estilos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_estilos" ADD CONSTRAINT "pedido_estilos_estilo_id_fkey" FOREIGN KEY ("estilo_id") REFERENCES "estilos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selfies" ADD CONSTRAINT "selfies_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_geradas" ADD CONSTRAINT "fotos_geradas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_geradas" ADD CONSTRAINT "fotos_geradas_estilo_id_fkey" FOREIGN KEY ("estilo_id") REFERENCES "estilos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
