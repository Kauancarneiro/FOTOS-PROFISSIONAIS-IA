const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarReais(valor: string | number): string {
  return formatador.format(Number(valor));
}
