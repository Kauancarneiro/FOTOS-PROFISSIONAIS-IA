import { useQuery } from '@tanstack/react-query';
import { Camera, Loader2 } from 'lucide-react';
import { api, mensagemDeErro } from '@/lib/api';
import { formatarReais } from '@/lib/dinheiro';
import type { Catalogo } from '@/lib/tipos';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Inicio() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalogo'],
    queryFn: async () => (await api.get<Catalogo>('/catalogo')).data,
  });

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Camera className="size-6" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Fotos profissionais com IA</h1>
        <p className="max-w-xl text-muted-foreground">
          Envie suas selfies, pague com Pix e receba fotos prontas para LinkedIn, currículo, WhatsApp e Instagram.
        </p>
      </header>

      {isLoading && (
        <div className="flex justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {error && <p className="text-center text-destructive">{mensagemDeErro(error, 'Não foi possível carregar os pacotes')}</p>}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {data.pacotes.map((pacote) => (
              <Card key={pacote.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{pacote.nome}</CardTitle>
                    {pacote.prioridade && <Badge>Prioridade</Badge>}
                  </div>
                  <CardDescription>
                    {pacote.quantidadeFotos} fotos ·{' '}
                    {pacote.quantidadeEstilos === null ? 'todos os estilos' : `${pacote.quantidadeEstilos} estilos`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatarReais(pacote.preco)}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Estilos disponíveis</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.estilos.map((estilo) => (
                <li key={estilo.id} className="rounded-lg border bg-card p-4">
                  <p className="font-medium">{estilo.nome}</p>
                  {estilo.descricao && <p className="text-sm text-muted-foreground">{estilo.descricao}</p>}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
