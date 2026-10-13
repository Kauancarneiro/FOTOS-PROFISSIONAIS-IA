# Esqueleto do projeto

Base sobre a qual as funcionalidades do MVP vão ser construídas: Docker, backend, banco com os modelos do plano, frontend e um endpoint de catálogo que liga tudo de ponta a ponta.

## O que foi feito

### Estrutura

```
docker-compose.yml       postgres, backend, frontend e ngrok (opcional)
backend/
  prisma/schema.prisma   modelos do plano
  prisma/seed.ts         pacotes e estilos iniciais
  src/server.ts          sobe o servidor e encerra com elegância
  src/app.ts             middlewares e rotas
  src/config/            env (validado com zod), Prisma e logger
  src/middlewares/       tratamento de erro e 404
  src/modules/<nome>/    um módulo por funcionalidade
frontend/
  src/pages/             uma página por rota
  src/components/ui/     componentes shadcn (button, card, badge)
  src/lib/               cliente da API, tipos e formatação
```

A organização segue o projeto irmão `impressao-fotos`, para que os padrões já conhecidos (módulos por funcionalidade, `AppError`, respostas de erro no campo `erro`, proxy `/api` no Vite) valham aqui também.

### Catálogo

- `GET /api/catalogo` devolve os pacotes e estilos ativos, ordenados pelo campo `ordem`.
- O prompt de cada estilo **não** sai na resposta: ele é detalhe interno da geração e não deve ser exposto nem copiado.
- O preço vai como texto com duas casas (`"49.90"`), para não perder precisão em conversões de ponto flutuante. O frontend formata em reais.
- A página inicial (`/`) mostra pacotes e estilos vindos dessa rota. É um rascunho da landing, só para provar que frontend, backend e banco conversam.

## Modelos do banco

| Modelo | Para que serve |
|---|---|
| `Cliente` | Quem compra. Identificado pelo e-mail, com WhatsApp opcional para o aviso de pedido pronto. |
| `Pacote` | Básico, Completo e Premium. Fica no banco (e não fixo no código) para o admin poder mudar preço e criar promoções, como o desconto de lançamento. |
| `Estilo` | Estilos pré-definidos com o prompt usado na geração. |
| `Pedido` | Pedido do cliente: pacote, estilos escolhidos, status e valor. |
| `PedidoEstilo` | Estilos escolhidos em cada pedido. |
| `Selfie` | Fotos enviadas pelo cliente. |
| `FotoGerada` | Cada foto gerada pela IA, com status, tentativas e custo. |
| `Pagamento` | Cobrança Pix no gateway. |

### Decisões

- **Id do pedido é UUID.** O cliente acessa a galeria e o status do pedido por link, sem login. Com id sequencial, bastaria trocar o número na URL para ver as fotos de outra pessoa.
- **`Pedido.valor` guarda o preço no momento da compra.** Mudar o preço do pacote depois não altera pedidos antigos nem o faturamento.
- **`Pacote.quantidadeEstilos` vazio significa "todos os estilos"** (pacote Premium), para não precisar atualizar o pacote quando um estilo novo for criado.
- **Status do pedido:** `RASCUNHO` (escolhendo pacote, selfies e estilos) → `AGUARDANDO_PAGAMENTO` → `NA_FILA` → `GERANDO` → `CONCLUIDO`, com `FALHOU` e `CANCELADO` como saídas. Só a confirmação do pagamento leva o pedido para `NA_FILA`, seguindo a regra de ouro do plano: nada é gerado antes de o Pix ser pago.
- **`Selfie.hash` é único por pedido**, para barrar a mesma foto enviada duas vezes (validação de duplicada prevista no plano).
- **`Pedido.selfiesApagadasEm`** registra quando as selfies foram apagadas, atendendo à regra de LGPD de apagar em até 7 dias. O pedido e as fotos geradas continuam existindo.
- **`Pedido.termosAceitosEm`** guarda quando o cliente aceitou os termos (fotos próprias e maioridade), como prova do consentimento.
- **`FotoGerada.tentativas` e `erro`** servem ao worker da fila, que tenta de novo em caso de falha. `custo` permite comparar o gasto real de IA com a estimativa do plano.
- **`Pagamento` aceita mais de um por pedido** e tem `gateway` e `idExterno` únicos juntos. O Pix pode expirar e ser gerado de novo, e o gateway ainda não foi escolhido. `payload` guarda o corpo bruto do webhook para auditoria.
- Selfies, fotos e pedidos usam `onDelete: Cascade` entre si, mas `Pagamento` não: registro financeiro não pode sumir junto com um pedido apagado.

### Seed

Cria os três pacotes e os seis estilos do plano. Usa `upsert` sem atualizar registros existentes, então pode rodar de novo sem duplicar e sem desfazer mudanças feitas pelo admin. Os prompts dos estilos são provisórios, em inglês (os modelos de imagem respondem melhor assim), e devem ser revistos depois do teste de qualidade da semana 1.

## Infra

- Portas de host deslocadas (`5434`, `3003`, `5175`, `4042`) para rodar ao lado do `clinica-terapia` e do `impressao-fotos` na mesma máquina.
- `node_modules` fica em volume Docker, então não é preciso ter Node instalado na máquina.
- O volume `uploads_data` já está montado em `/app/uploads` para receber selfies e fotos geradas, que nunca vão para o repositório.
- O perfil `ngrok` existe porque o webhook do Pix precisa de um endereço público para ser testado localmente.

## Diferenças em relação ao `impressao-fotos`

- O `cn` usa `clsx` + `tailwind-merge` direto, que é o padrão do shadcn, em vez do pacote `cn` do npm.
- Ficaram de fora dependências que ainda não têm uso (autenticação, upload, processamento de imagem, testes). Elas entram junto com a funcionalidade que precisar delas.
