<script setup lang="ts">
import { ref } from 'vue';
import type { Message } from '../../types/models';
import { formatClock } from '../../utils/time';

defineProps<{ message: Message; isOwn: boolean }>();

const lightbox = ref(false);
</script>

<template>
  <div class="message-row" :class="{ 'is-own': isOwn }">
    <div class="message-bubble" :class="isOwn ? 'is-own' : 'is-other'">
      <div v-if="message.attachment" class="message-attachment" :class="{ 'mb-2': message.text }">
        <img
          v-if="message.attachment.type === 'IMAGE'"
          :src="message.attachment.url"
          class="message-attachment__media"
          loading="lazy"
          @click="lightbox = true"
        />
        <video v-else :src="message.attachment.url" class="message-attachment__media" controls />
      </div>

      <div v-if="message.text" class="message-text">{{ message.text }}</div>
      <div class="message-time">{{ formatClock(message.createdAt) }}</div>
    </div>

    <v-dialog v-if="message.attachment?.type === 'IMAGE'" v-model="lightbox" max-width="960">
      <img :src="message.attachment.url" class="lightbox-image" @click="lightbox = false" />
    </v-dialog>
  </div>
</template>

<style scoped>
.message-row {
  display: flex;
  margin-bottom: 10px;
}
.message-row.is-own {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 72%;
  padding: 10px 14px;
  border-radius: 16px;
  word-break: break-word;
}

.message-bubble.is-own {
  background: linear-gradient(135deg, #ff2ec4, #b026ff);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 0 18px rgba(255, 46, 196, 0.28);
}

.message-bubble.is-other {
  background: rgb(var(--v-theme-surface-bright));
  border: 1px solid rgba(5, 217, 232, 0.22);
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 0.94rem;
  line-height: 1.4;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.65rem;
  opacity: 0.7;
  margin-top: 5px;
  text-align: right;
}

.message-attachment__media {
  max-width: 260px;
  max-height: 320px;
  width: 100%;
  border-radius: 10px;
  display: block;
  cursor: pointer;
}

.lightbox-image {
  width: 100%;
  border-radius: 12px;
  cursor: zoom-out;
}
</style>
