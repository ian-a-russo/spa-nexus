import { defineStore } from 'pinia';
import { http } from '../services/http';
import { getSocket } from '../services/socket';
import type { ConversationSummary, Message, MessageAttachment } from '../types/models';

interface ChatState {
  conversations: ConversationSummary[];
  messagesByConversation: Record<string, Message[]>;
  activeConversationId: string | null;
  typingByConversation: Record<string, string[]>;
  onlineUserIds: string[];
  snackbar: string | null;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversations: [],
    messagesByConversation: {},
    activeConversationId: null,
    typingByConversation: {},
    onlineUserIds: [],
    snackbar: null,
  }),

  getters: {
    activeMessages: (state): Message[] =>
      state.activeConversationId ? (state.messagesByConversation[state.activeConversationId] ?? []) : [],

    activeConversation: (state): ConversationSummary | undefined =>
      state.conversations.find((c) => c.id === state.activeConversationId),

    isTypingInActiveConversation: (state): boolean =>
      state.activeConversationId
        ? (state.typingByConversation[state.activeConversationId]?.length ?? 0) > 0
        : false,

    isOnline: (state) => (userId: string): boolean => state.onlineUserIds.includes(userId),
  },

  actions: {
    async fetchConversations(): Promise<void> {
      const { data } = await http.get<ConversationSummary[]>('/conversations');
      this.conversations = data;
    },

    async openConversation(conversationId: string): Promise<void> {
      this.activeConversationId = conversationId;
      if (this.messagesByConversation[conversationId]) {
        return;
      }
      const { data } = await http.get<Message[]>(`/conversations/${conversationId}/messages`);
      this.messagesByConversation[conversationId] = data;
    },

    sendMessage(conversationId: string, text: string, attachment?: MessageAttachment): void {
      getSocket()?.emit('message:send', { conversationId, text: text || undefined, attachment });
    },

    setTyping(conversationId: string, isTyping: boolean): void {
      getSocket()?.emit(isTyping ? 'typing:start' : 'typing:stop', { conversationId });
    },

    addConversation(summary: ConversationSummary): void {
      const alreadyExists = this.conversations.some((c) => c.id === summary.id);
      if (!alreadyExists) {
        this.conversations.unshift(summary);
      }
    },

    handleIncomingMessage(message: Message): void {
      const existing = this.messagesByConversation[message.conversationId] ?? [];
      this.messagesByConversation[message.conversationId] = [...existing, message];

      const conversation = this.conversations.find((c) => c.id === message.conversationId);
      if (conversation) {
        conversation.lastMessage = {
          text: message.text,
          senderId: message.sender.id,
          createdAt: message.createdAt,
          attachmentType: message.attachment?.type ?? null,
        };
      }

      this.clearTyping(message.conversationId, message.sender.id);
    },

    setUserTyping(conversationId: string, userId: string): void {
      const typing = new Set(this.typingByConversation[conversationId] ?? []);
      typing.add(userId);
      this.typingByConversation[conversationId] = Array.from(typing);
    },

    clearTyping(conversationId: string, userId: string): void {
      const typing = (this.typingByConversation[conversationId] ?? []).filter((id) => id !== userId);
      this.typingByConversation[conversationId] = typing;
    },

    closeActiveConversation(): void {
      this.activeConversationId = null;
    },

    setPresence(userId: string, online: boolean): void {
      const withoutUser = this.onlineUserIds.filter((id) => id !== userId);
      this.onlineUserIds = online ? [...withoutUser, userId] : withoutUser;
    },

    notify(text: string): void {
      this.snackbar = text;
    },

    reset(): void {
      this.conversations = [];
      this.messagesByConversation = {};
      this.activeConversationId = null;
      this.typingByConversation = {};
      this.onlineUserIds = [];
    },
  },
});
