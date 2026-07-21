import { defineStore } from 'pinia';
import { http } from '../services/http';
import type { ConversationSummary, Invite } from '../types/models';

interface InvitesState {
  pending: Invite[];
}

export const useInvitesStore = defineStore('invites', {
  state: (): InvitesState => ({
    pending: [],
  }),

  actions: {
    async fetchPending(): Promise<void> {
      const { data } = await http.get<Invite[]>('/invites');
      this.pending = data;
    },

    async send(username: string): Promise<Invite> {
      const { data } = await http.post<Invite>('/invites', { username });
      return data;
    },

    async accept(inviteId: string): Promise<ConversationSummary> {
      const { data } = await http.post<ConversationSummary>(`/invites/${inviteId}/accept`);
      this.removePending(inviteId);
      return data;
    },

    async reject(inviteId: string): Promise<void> {
      await http.post(`/invites/${inviteId}/reject`);
      this.removePending(inviteId);
    },

    addPending(invite: Invite): void {
      const alreadyExists = this.pending.some((i) => i.id === invite.id);
      if (!alreadyExists) {
        this.pending.unshift(invite);
      }
    },

    removePending(inviteId: string): void {
      this.pending = this.pending.filter((i) => i.id !== inviteId);
    },

    reset(): void {
      this.pending = [];
    },
  },
});
