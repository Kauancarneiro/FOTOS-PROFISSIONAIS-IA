# Plano do MVP: Fotos Profissionais com IA

## 1. O produto

A pessoa envia de 6 a 10 selfies, paga via Pix e em minutos recebe de 10 a 60 fotos profissionais para LinkedIn, currículo, WhatsApp e Instagram.

**Desejo atendido:** aparência e status. Ter uma foto profissional sem pagar R$ 300 num estúdio.

**Público:** quem procura emprego, recém-formados, corretores, advogados, profissionais de saúde, coaches e vendedores.

## 2. Fluxo do cliente

1. **Landing page:** exemplos de antes e depois, pacotes e preços.
2. **Escolha do pacote.**
3. **Upload das selfies:** validar que há exatamente um rosto, que a foto está nítida e que não é duplicada.
4. **Escolha de estilos:** estúdio com fundo cinza, escritório, ao ar livre, terno, social, casual.
5. **Aceite dos termos:** o cliente declara que as fotos são dele e que é maior de idade.
6. **Pagamento Pix:** QR Code com confirmação automática por webhook.
7. **Fila de geração:** tela "suas fotos estão ficando prontas" e aviso por e-mail ou WhatsApp.
8. **Galeria:** download em alta resolução.
9. **Upsell:** foto impressa em tamanho personalizado (a partir de + R$ 19,90), integrando no futuro com o sistema `impressao-fotos`.

## 3. Pacotes e margem

| Pacote | Preço | Fotos | Estilos | Custo de IA estimado* | Margem bruta |
|---|---|---|---|---|---|
| Básico | R$ 29,90 | 10 | 2 | ~R$ 3 | ~R$ 25 |
| Completo | R$ 49,90 | 30 | 5 | ~R$ 9 | ~R$ 39 |
| Premium | R$ 79,90 | 60 | todos + prioridade | ~R$ 18 | ~R$ 58 |

*Estimativa de cerca de R$ 0,30 por imagem gerada. Confirmar na página de preços do provedor antes de fechar os valores. A taxa do Pix também sai da margem.

## 4. Decisão técnica principal: semelhança com a pessoa

O cliente só paga se **se reconhecer** nas fotos.

| | A) Edição com foto de referência | B) Treinar um modelo por cliente (LoRA) |
|---|---|---|
| Como funciona | Selfies e prompt enviados a um modelo de edição de imagem (família Flux Kontext, Gemini Image, etc., via fal.ai ou Replicate) | Treina um mini-modelo com as selfies de cada cliente e depois gera as fotos |
| Semelhança | Boa, mas varia | A melhor |
| Tempo | Segundos | 5 a 15 minutos de treino |
| Custo | Menor | Maior |
| Complexidade | Baixa | Média |

**Decisão:** começar pelo caminho **A**, com o provedor isolado atrás de uma interface (`GeradorImagem`). Se o teste com pessoas reais mostrar pouca semelhança, migrar para o **B** sem refazer o resto do sistema.

## 5. Arquitetura

- **Frontend (React + Vite):** landing, upload, checkout, galeria e um painel admin (pedidos, faturamento, reprocessar pedido).
- **Backend (Express + Prisma + Postgres):**
  - Modelos: `Cliente`, `Pedido`, `Selfie`, `Estilo`, `FotoGerada`, `Pagamento`.
  - Webhook do Pix: pagamento confirmado coloca o pedido na fila.
  - Worker de fila: gera as fotos em paralelo controlado, com nova tentativa em caso de falha.
  - Armazenamento: disco da VPS no começo; Cloudflare R2 ou outro S3 quando crescer.
- **Regra de ouro:** só gerar imagens **depois do pagamento confirmado**, porque toda geração custa dinheiro.

## 6. LGPD e prevenção de abuso

- Consentimento explícito (checkbox mais termos de uso).
- Apagar as selfies automaticamente em até 7 dias.
- Bloquear menores de idade e fotos de terceiros por declaração nos termos.
- Oferecer apenas estilos profissionais pré-definidos, sem prompt livre. Nada sensual e nada que imite documentos.

## 7. Cronograma

### Semana 1: validar a qualidade (sem código)
- Gerar manualmente as fotos de 10 amigos ou parentes no playground do fal.ai ou do Replicate.
- Perguntar: "Você usaria essa foto no LinkedIn? Pagaria R$ 49,90?"
- Meta: 7 de 10 dizerem sim. Se não, testar o caminho B.

### Semana 2: MVP
- Upload, Pix, fila, galeria e admin mínimo.

### Semana 3: lançamento
- 1 vídeo de antes e depois por dia no TikTok, Instagram e LinkedIn, com as fotos dos amigos (com autorização).
- Desconto de lançamento para os 50 primeiros clientes.

## 8. Depois do MVP

- **Prévia grátis com marca d'água:** 1 foto antes do pagamento para aumentar a conversão.
- **Pacote empresarial:** fotos padronizadas de toda a equipe, com o mesmo fundo e estilo.
- **Impressão personalizada:** integração com o sistema `impressao-fotos`.

## 9. Pendências de decisão

- Provedor de IA (fal.ai ou Replicate) e modelo exato, a definir após o teste da semana 1.
- Gateway de Pix (Asaas, Mercado Pago, AbacatePay ou outro), comparando taxas.
- Canal de aviso de pedido pronto (e-mail, WhatsApp ou ambos).
