import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { http } from '../services/http';
import { connectSocket, disconnectSocket } from '../services/socket';
import type { AuthResult } from '../types/models';
import { useAuthStore } from './auth.store';

vi.mock('../services/http', () => ({ http: { post: vi.fn() } }));
vi.mock('../services/socket', () => ({ connectSocket: vi.fn(), disconnectSocket: vi.fn() }));
vi.mock('../services/realtime', () => ({ bindRealtimeEvents: vi.fn() }));

const result: AuthResult = {
  accessToken: 'token-123',
  user: { id: 'u1', username: 'alice', displayName: 'Alice', avatarUrl: null },
};

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('autentica, persiste a sessão e abre o socket', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: result });
    const store = useAuthStore();

    await store.login('alice', 'secret1');

    expect(http.post).toHaveBeenCalledWith('/auth/login', {
      username: 'alice',
      password: 'secret1',
    });
    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.username).toBe('alice');
    expect(connectSocket).toHaveBeenCalledWith('token-123');
    expect(JSON.parse(localStorage.getItem('chat.auth') ?? '{}').token).toBe('token-123');
  });

  it('restaura a sessão salva ao iniciar', () => {
    localStorage.setItem(
      'chat.auth',
      JSON.stringify({ token: result.accessToken, user: result.user }),
    );

    const store = useAuthStore();

    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.id).toBe('u1');
  });

  it('encerra a sessão e fecha o socket no logout', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: result });
    const store = useAuthStore();
    await store.login('alice', 'secret1');

    store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(localStorage.getItem('chat.auth')).toBeNull();
    expect(disconnectSocket).toHaveBeenCalled();
  });

  it('atualiza o usuário preservando o token salvo', async () => {
    vi.mocked(http.post).mockResolvedValue({ data: result });
    const store = useAuthStore();
    await store.login('alice', 'secret1');

    store.updateUser({ ...result.user, avatarUrl: 'http://cdn/a.png' });

    const stored = JSON.parse(localStorage.getItem('chat.auth') ?? '{}');
    expect(stored.token).toBe('token-123');
    expect(stored.user.avatarUrl).toBe('http://cdn/a.png');
  });
});
