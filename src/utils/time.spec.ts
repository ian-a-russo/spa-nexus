import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatClock, formatRelative } from './time';

const NOW = new Date(2025, 5, 15, 12, 0, 0);

describe('time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formata o horário em pt-BR', () => {
    expect(formatClock(new Date(2025, 5, 15, 9, 5).toISOString())).toBe('09:05');
  });

  it('mostra só o horário para mensagens de hoje', () => {
    expect(formatRelative(new Date(2025, 5, 15, 8, 30).toISOString())).toBe('08:30');
  });

  it('mostra "ontem" para mensagens do dia anterior', () => {
    expect(formatRelative(new Date(2025, 5, 14, 23, 59).toISOString())).toBe('ontem');
  });

  it('mostra dia/mês para datas mais antigas', () => {
    expect(formatRelative(new Date(2025, 5, 1, 10, 0).toISOString())).toBe('01/06');
  });
});
