import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { http } from '../services/http';
import type { Invite, UserSummary } from '../types/models';
import { useInvitesStore } from './invites.store';

vi.mock('../services/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const user = (id: string): UserSummary => ({
  id,
  username: id,
  displayName: id,
  avatarUrl: null,
});

function makeInvite(id: string): Invite {
  return { id, sender: user('a'), receiver: user('b'), createdAt: '2025-01-01T00:00:00Z' };
}

describe('invites store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('carrega os convites pendentes', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [makeInvite('i1')] });
    const store = useInvitesStore();

    await store.fetchPending();

    expect(store.pending.map((invite) => invite.id)).toEqual(['i1']);
  });

  it('não duplica um convite recebido em tempo real', () => {
    const store = useInvitesStore();

    store.addPending(makeInvite('i1'));
    store.addPending(makeInvite('i1'));

    expect(store.pending).toHaveLength(1);
  });

  it('remove o convite da lista ao aceitar', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: { id: 'c1' } });
    const store = useInvitesStore();
    store.addPending(makeInvite('i1'));

    const conversation = await store.accept('i1');

    expect(http.post).toHaveBeenCalledWith('/invites/i1/accept');
    expect(conversation).toEqual({ id: 'c1' });
    expect(store.pending).toEqual([]);
  });

  it('remove o convite da lista ao recusar', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: undefined });
    const store = useInvitesStore();
    store.addPending(makeInvite('i1'));
    store.addPending(makeInvite('i2'));

    await store.reject('i1');

    expect(store.pending.map((invite) => invite.id)).toEqual(['i2']);
  });
});
