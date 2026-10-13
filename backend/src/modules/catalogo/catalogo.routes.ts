import { Router } from 'express';
import { prisma } from '../../config/database';

const router: Router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [pacotes, estilos] = await Promise.all([
      prisma.pacote.findMany({
        where: { ativo: true },
        orderBy: { ordem: 'asc' },
        select: {
          id: true,
          nome: true,
          preco: true,
          quantidadeFotos: true,
          quantidadeEstilos: true,
          prioridade: true,
        },
      }),
      prisma.estilo.findMany({
        where: { ativo: true },
        orderBy: { ordem: 'asc' },
        select: { id: true, slug: true, nome: true, descricao: true },
      }),
    ]);

    res.json({
      pacotes: pacotes.map((pacote) => ({ ...pacote, preco: pacote.preco.toFixed(2) })),
      estilos,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
