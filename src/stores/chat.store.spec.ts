import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConversationSummary, Message, UserSummary } from '../types/models';
import { useChatStore } from './chat.store';

const emit = vi.fn();

vi.mock('../services/http', () => ({ http: { get: vi.fn() } }));
vi.mock('../services/socket', () => ({ getSocket: () => ({ emit }) }));

const alice: UserSummary = { id: 'u1', username: 'alice', displayName: 'Alice', avatarUrl: null };

function makeConversation(id: string): ConversationSummary {
  return { id, participant: alice, lastMessage: null, createdAt: '2025-01-01T00:00:00Z' };
}

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'm1',
    conversationId: 'c1',
    text: 'oi',
    createdAt: '2025-01-01T10:00:00Z',
    sender: alice,
    attachment: null,
    ...overrides,
  };
}

describe('chat store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    emit.mockClear();
  });

  it('não duplica uma conversa já existente', () => {
    const store = useChatStore();

    store.addConversation(makeConversation('c1'));
    store.addConversation(makeConversation('c1'));

    expect(store.conversations).toHaveLength(1);
  });

  it('acrescenta a mensagem recebida e atualiza o preview da conversa', () => {
    const store = useChatStore();
    store.addConversation(makeConversation('c1'));

    store.handleIncomingMessage(makeMessage({ text: 'olá' }));

    expect(store.messagesByConversation['c1']).toHaveLength(1);
    expect(store.conversations[0].lastMessage?.text).toBe('olá');
    expect(store.conversations[0].lastMessage?.senderId).toBe('u1');
  });

  it('para de mostrar "digitando" quando a mensagem chega', () => {
    const store = useChatStore();
    store.activeConversationId = 'c1';
    store.setUserTyping('c1', 'u1');
    expect(store.isTypingInActiveConversation).toBe(true);

    store.handleIncomingMessage(makeMessage());

    expect(store.isTypingInActiveConversation).toBe(false);
  });

  it('não repete o usuário digitando', () => {
    const store = useChatStore();

    store.setUserTyping('c1', 'u1');
    store.setUserTyping('c1', 'u1');

    expect(store.typingByConversation['c1']).toEqual(['u1']);
  });

  it('controla a presença online/offline sem duplicar', () => {
    const store = useChatStore();

    store.setPresence('u1', true);
    store.setPresence('u1', true);
    expect(store.onlineUserIds).toEqual(['u1']);
    expect(store.isOnline('u1')).toBe(true);

    store.setPresence('u1', false);
    expect(store.isOnline('u1')).toBe(false);
  });

  it('envia a mensagem pelo socket omitindo texto vazio', () => {
    const store = useChatStore();

    store.sendMessage('c1', '', undefined);

    expect(emit).toHaveBeenCalledWith('message:send', {
      conversationId: 'c1',
      text: undefined,
      attachment: undefined,
    });
  });

  it('emite typing:start ou typing:stop conforme o estado', () => {
    const store = useChatStore();

    store.setTyping('c1', true);
    store.setTyping('c1', false);

    expect(emit).toHaveBeenNthCalledWith(1, 'typing:start', { conversationId: 'c1' });
    expect(emit).toHaveBeenNthCalledWith(2, 'typing:stop', { conversationId: 'c1' });
  });

  it('limpa o estado ao resetar', () => {
    const store = useChatStore();
    store.addConversation(makeConversation('c1'));
    store.setPresence('u1', true);

    store.reset();

    expect(store.conversations).toEqual([]);
    expect(store.onlineUserIds).toEqual([]);
    expect(store.activeConversationId).toBeNull();
  });
});
