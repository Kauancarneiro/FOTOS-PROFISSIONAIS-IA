import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pacotes = [
  { nome: 'Básico', preco: '29.90', quantidadeFotos: 10, quantidadeEstilos: 2, prioridade: false, ordem: 1 },
  { nome: 'Completo', preco: '49.90', quantidadeFotos: 30, quantidadeEstilos: 5, prioridade: false, ordem: 2 },
  { nome: 'Premium', preco: '79.90', quantidadeFotos: 60, quantidadeEstilos: null, prioridade: true, ordem: 3 },
];

const estilos = [
  {
    slug: 'estudio-cinza',
    nome: 'Estúdio com fundo cinza',
    descricao: 'Retrato clássico de estúdio, fundo cinza liso e luz suave.',
    prompt:
      'Professional studio headshot of the same person, plain neutral gray seamless background, soft diffused key light, sharp focus on the eyes, natural skin texture, business attire.',
  },
  {
    slug: 'escritorio',
    nome: 'Escritório',
    descricao: 'Ambiente corporativo moderno, fundo desfocado.',
    prompt:
      'Professional headshot of the same person in a modern bright office, softly blurred background, natural window light, business attire, confident friendly expression.',
  },
  {
    slug: 'ao-ar-livre',
    nome: 'Ao ar livre',
    descricao: 'Luz natural, fundo urbano ou verde desfocado.',
    prompt:
      'Professional outdoor portrait of the same person, natural daylight, softly blurred urban park background, smart casual attire, warm approachable expression.',
  },
  {
    slug: 'terno',
    nome: 'Terno',
    descricao: 'Visual formal com terno e gravata ou tailleur.',
    prompt:
      'Formal corporate headshot of the same person wearing a well-fitted dark suit, neutral studio background, even professional lighting, executive look.',
  },
  {
    slug: 'social',
    nome: 'Social',
    descricao: 'Camisa social, visual profissional sem ser formal demais.',
    prompt:
      'Professional headshot of the same person wearing a crisp dress shirt, light neutral background, soft studio lighting, polished but approachable look.',
  },
  {
    slug: 'casual',
    nome: 'Casual',
    descricao: 'Roupa casual arrumada, ideal para Instagram e WhatsApp.',
    prompt:
      'Smart casual portrait of the same person, clean light background, soft natural light, relaxed genuine smile, suitable for a social media profile picture.',
  },
];

async function main() {
  for (const pacote of pacotes) {
    await prisma.pacote.upsert({
      where: { nome: pacote.nome },
      update: {},
      create: pacote,
    });
  }

  for (const [indice, estilo] of estilos.entries()) {
    await prisma.estilo.upsert({
      where: { slug: estilo.slug },
      update: {},
      create: { ...estilo, ordem: indice + 1 },
    });
  }

  console.log(`Seed concluído: ${pacotes.length} pacotes e ${estilos.length} estilos`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
