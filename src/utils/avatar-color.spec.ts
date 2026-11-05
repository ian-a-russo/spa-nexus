import { describe, expect, it } from 'vitest';
import { gradientFor, initialsFor } from './avatar-color';

describe('initialsFor', () => {
  it('usa as duas primeiras letras de um nome único', () => {
    expect(initialsFor('alice')).toBe('AL');
  });

  it('usa a inicial do primeiro e do último nome', () => {
    expect(initialsFor('  Maria  da Silva ')).toBe('MS');
  });

  it('devolve ? para nome vazio', () => {
    expect(initialsFor('   ')).toBe('?');
  });
});

describe('gradientFor', () => {
  it('é determinístico para a mesma semente', () => {
    expect(gradientFor('user-1')).toBe(gradientFor('user-1'));
  });

  it('gera um linear-gradient válido', () => {
    expect(gradientFor('user-1')).toMatch(
      /^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/,
    );
  });
});
