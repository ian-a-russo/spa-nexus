import type { Socket } from 'socket.io-client';
import { getSocket } from './socket';
import { useChatStore } from '../stores/chat.store';
import { useInvitesStore } from '../stores/invites.store';
import type { ConversationSummary, Invite, Message } from '../types/models';

interface BoundSocket extends Socket {
  _chatEventsBound?: boolean;
}

export function bindRealtimeEvents(): void {
  const socket = getSocket() as BoundSocket | null;
  if (!socket || socket._chatEventsBound) {
    return;
  }
  socket._chatEventsBound = true;

  const chat = useChatStore();
  const invites = useInvitesStore();

  socket.on('message:new', (message: Message) => {
    chat.handleIncomingMessage(message);
  });

  socket.on('invite:new', (invite: Invite) => {
    invites.addPending(invite);
    chat.notify(`@${invite.sender.username} enviou um convite para conversar.`);
  });

  socket.on('invite:accepted', (conversation: ConversationSummary) => {
    chat.addConversation(conversation);
    chat.notify(`@${conversation.participant.username} aceitou seu convite!`);
  });

  socket.on('invite:rejected', () => {
    chat.notify('Seu convite foi recusado.');
  });

  socket.on(
    'typing:start',
    ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      chat.setUserTyping(conversationId, userId);
    },
  );

  socket.on(
    'typing:stop',
    ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      chat.clearTyping(conversationId, userId);
    },
  );

  socket.on('presence:online', ({ userId }: { userId: string }) => {
    chat.setPresence(userId, true);
  });

  socket.on('presence:offline', ({ userId }: { userId: string }) => {
    chat.setPresence(userId, false);
  });
}
