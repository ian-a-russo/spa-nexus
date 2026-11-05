import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { apiErrorMessage } from './api-error';

function axiosErrorWith(data: unknown): AxiosError {
  const error = new AxiosError('Request failed');
  error.response = {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: {},
  } as never;
  return error;
}

describe('apiErrorMessage', () => {
  it('devolve a mensagem enviada pela API', () => {
    const error = axiosErrorWith({ message: 'Usuário ou senha inválidos.' });

    expect(apiErrorMessage(error, 'fallback')).toBe('Usuário ou senha inválidos.');
  });

  it('usa o fallback quando a API não envia mensagem em texto', () => {
    expect(apiErrorMessage(axiosErrorWith({ message: ['a', 'b'] }), 'fallback')).toBe('fallback');
    expect(apiErrorMessage(axiosErrorWith({}), 'fallback')).toBe('fallback');
  });

  it('usa o fallback quando o erro não vem do axios', () => {
    expect(apiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
    expect(apiErrorMessage(undefined, 'fallback')).toBe('fallback');
  });
});
