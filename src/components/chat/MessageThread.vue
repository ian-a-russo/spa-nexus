<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useChatStore } from '../../stores/chat.store';
import MessageBubble from './MessageBubble.vue';
import TypingIndicator from './TypingIndicator.vue';

const chat = useChatStore();
const auth = useAuthStore();
const scrollEl = ref<HTMLElement | null>(null);

async function scrollToBottom(): Promise<void> {
  await nextTick();
  scrollEl.value?.scrollTo({ top: scrollEl.value.scrollHeight, behavior: 'smooth' });
}

watch(() => chat.activeMessages.length, scrollToBottom);
watch(() => chat.activeConversationId, scrollToBottom);
</script>

<template>
  <div ref="scrollEl" class="message-thread">
    <transition-group name="message-list" tag="div">
      <MessageBubble
        v-for="message in chat.activeMessages"
        :key="message.id"
        :message="message"
        :is-own="message.sender.id === auth.user?.id"
      />
    </transition-group>
    <TypingIndicator v-if="chat.isTypingInActiveConversation" />
  </div>
</template>

<style scoped>
.message-thread {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
