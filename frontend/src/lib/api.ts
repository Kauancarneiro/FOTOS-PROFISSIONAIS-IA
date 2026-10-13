import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export function mensagemDeErro(err: unknown, padrao = 'Algo deu errado. Tente novamente'): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.erro ?? padrao;
  }
  return padrao;
}
