<script setup lang="ts">
import { ref } from 'vue';
import { uploadMedia } from '../../services/uploads';
import { useChatStore } from '../../stores/chat.store';
import type { MessageAttachment } from '../../types/models';
import { apiErrorMessage } from '../../utils/api-error';

const chat = useChatStore();
const text = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const pendingAttachment = ref<MessageAttachment | null>(null);
const pendingPreviewUrl = ref<string | null>(null);
const uploadingAttachment = ref(false);
const attachmentError = ref('');

let typingTimeout: ReturnType<typeof setTimeout> | null = null;
const TYPING_IDLE_MS = 1500;

function handleInput(): void {
  const conversationId = chat.activeConversationId;
  if (!conversationId) {
    return;
  }
  chat.setTyping(conversationId, true);
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(() => chat.setTyping(conversationId, false), TYPING_IDLE_MS);
}

function pickAttachment(): void {
  fileInput.value?.click();
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) {
    return;
  }

  attachmentError.value = '';
  pendingPreviewUrl.value = URL.createObjectURL(file);
  uploadingAttachment.value = true;
  try {
    pendingAttachment.value = await uploadMedia(file);
  } catch (error) {
    attachmentError.value = apiErrorMessage(error, 'Falha ao enviar arquivo.');
    clearAttachment();
  } finally {
    uploadingAttachment.value = false;
  }
}

function clearAttachment(): void {
  pendingAttachment.value = null;
  if (pendingPreviewUrl.value) {
    URL.revokeObjectURL(pendingPreviewUrl.value);
  }
  pendingPreviewUrl.value = null;
}

function send(): void {
  const conversationId = chat.activeConversationId;
  const value = text.value.trim();
  if (!conversationId || uploadingAttachment.value) {
    return;
  }
  if (!value && !pendingAttachment.value) {
    return;
  }

  chat.sendMessage(conversationId, value, pendingAttachment.value ?? undefined);
  text.value = '';
  clearAttachment();
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  chat.setTyping(conversationId, false);
}
</script>

<template>
  <div class="message-input pa-4">
    <div v-if="pendingPreviewUrl" class="attachment-preview mb-3">
      <img
        v-if="pendingAttachment?.type !== 'VIDEO'"
        :src="pendingPreviewUrl"
        class="attachment-preview__thumb"
      />
      <video v-else :src="pendingPreviewUrl" class="attachment-preview__thumb" muted />
      <v-progress-circular
        v-if="uploadingAttachment"
        indeterminate
        size="20"
        color="secondary"
        class="mx-2"
      />
      <v-btn
        v-else
        icon="mdi-close"
        size="x-small"
        variant="text"
        class="mx-1"
        @click="clearAttachment"
      />
      <span class="text-caption text-medium-emphasis">
        {{ uploadingAttachment ? 'enviando…' : 'pronto para enviar' }}
      </span>
    </div>

    <v-alert v-if="attachmentError" type="error" variant="tonal" density="compact" class="mb-3">
      {{ attachmentError }}
    </v-alert>

    <div class="d-flex align-center ga-3">
      <v-btn icon="mdi-paperclip" variant="text" color="secondary" @click="pickAttachment" />
      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        class="d-none"
        @change="handleFileChange"
      />

      <v-text-field
        v-model="text"
        placeholder="Digite uma mensagem"
        variant="solo"
        density="comfortable"
        hide-details
        rounded="xl"
        class="flex-grow-1"
        @input="handleInput"
        @keydown.enter.exact.prevent="send"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send"
            color="primary"
            variant="flat"
            size="small"
            class="neon-glow-primary"
            :disabled="(!text.trim() && !pendingAttachment) || uploadingAttachment"
            @click="send"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<style scoped>
.attachment-preview {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(5, 217, 232, 0.3);
}

.attachment-preview__thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
