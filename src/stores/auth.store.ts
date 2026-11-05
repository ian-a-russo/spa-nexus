import { defineStore } from 'pinia';
import { http } from '../services/http';
import { bindRealtimeEvents } from '../services/realtime';
import { connectSocket, disconnectSocket } from '../services/socket';
import type { AuthResult, UserSummary } from '../types/models';

const STORAGE_KEY = 'chat.auth';

interface StoredAuth {
  token: string;
  user: UserSummary;
}

function loadStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredAuth) : null;
}

function persistAuth(auth: StoredAuth | null): void {
  if (!auth) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const stored = loadStoredAuth();
    return {
      token: stored?.token ?? null,
      user: stored?.user ?? null,
    } as { token: string | null; user: UserSummary | null };
  },

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    async register(username: string, displayName: string, password: string): Promise<void> {
      const { data } = await http.post<AuthResult>('/auth/register', {
        username,
        displayName,
        password,
      });
      this.applyAuthResult(data);
    },

    async login(username: string, password: string): Promise<void> {
      const { data } = await http.post<AuthResult>('/auth/login', { username, password });
      this.applyAuthResult(data);
    },

    logout(): void {
      this.token = null;
      this.user = null;
      persistAuth(null);
      disconnectSocket();
    },

    reconnectSocket(): void {
      if (this.token) {
        connectSocket(this.token);
        bindRealtimeEvents();
      }
    },

    applyAuthResult(result: AuthResult): void {
      this.token = result.accessToken;
      this.user = result.user;
      persistAuth({ token: result.accessToken, user: result.user });
      connectSocket(result.accessToken);
      bindRealtimeEvents();
    },

    updateUser(user: UserSummary): void {
      this.user = user;
      if (this.token) {
        persistAuth({ token: this.token, user });
      }
    },
  },
});
