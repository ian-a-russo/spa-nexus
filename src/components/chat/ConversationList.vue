<script setup lang="ts">
import { useChatStore } from '../../stores/chat.store';
import { formatRelative } from '../../utils/time';
import UserAvatar from './UserAvatar.vue';
import type { LastMessagePreview } from '../../types/models';

const chat = useChatStore();

function select(conversationId: string): void {
  chat.openConversation(conversationId);
}

function previewLabel(lastMessage: LastMessagePreview): string {
  if (lastMessage.text) {
    return lastMessage.text;
  }
  return lastMessage.attachmentType === 'VIDEO' ? '🎥 Vídeo' : '📷 Foto';
}
</script>

<template>
  <v-list class="conversation-list flex-grow-1 px-2 py-2" bg-color="transparent">
    <transition-group name="conversation" tag="div">
      <v-list-item
        v-for="conversation in chat.conversations"
        :key="conversation.id"
        class="hover-lift conversation-item mb-2 py-2"
        :class="{ 'is-active': conversation.id === chat.activeConversationId }"
        rounded="lg"
        @click="select(conversation.id)"
      >
        <template #prepend>
          <UserAvatar
            :username="conversation.participant.username"
            :display-name="conversation.participant.displayName"
            :avatar-url="conversation.participant.avatarUrl"
            :online="chat.isOnline(conversation.participant.id)"
            class="mr-3"
          />
        </template>

        <v-list-item-title class="font-weight-medium">
          {{ conversation.participant.displayName }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-truncate mt-1">
          <span v-if="chat.typingByConversation[conversation.id]?.length" class="text-secondary">
            digitando…
          </span>
          <span v-else-if="conversation.lastMessage">{{
            previewLabel(conversation.lastMessage)
          }}</span>
          <span v-else class="text-medium-emphasis">Diga oi 👋</span>
        </v-list-item-subtitle>

        <template #append>
          <span v-if="conversation.lastMessage" class="text-caption text-medium-emphasis ml-2">
            {{ formatRelative(conversation.lastMessage.createdAt) }}
          </span>
        </template>
      </v-list-item>
    </transition-group>

    <div
      v-if="chat.conversations.length === 0"
      class="text-center text-medium-emphasis pa-6 text-body-2"
    >
      Nenhuma conversa ainda.<br />
      Busque um @usuário para começar.
    </div>
  </v-list>
</template>

<style scoped>
.conversation-list {
  overflow-y: auto;
}
.conversation-item {
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}
.conversation-item.is-active {
  background: linear-gradient(90deg, rgba(255, 46, 196, 0.16), rgba(5, 217, 232, 0.1));
  box-shadow: inset 2px 0 0 0 #ff2ec4;
}
</style>
