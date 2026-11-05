<script setup lang="ts">
import { computed } from 'vue';
import { gradientFor, initialsFor } from '../../utils/avatar-color';

const props = withDefaults(
  defineProps<{
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    size?: number;
    online?: boolean;
  }>(),
  { size: 44, online: undefined, avatarUrl: null },
);

const background = computed(() => gradientFor(props.username));
const initials = computed(() => initialsFor(props.displayName));
</script>

<template>
  <div class="user-avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="user-avatar__image" />
    <div v-else class="user-avatar__circle" :style="{ background }">
      {{ initials }}
    </div>
    <span
      v-if="online !== undefined"
      class="user-avatar__status"
      :class="{ 'is-online': online }"
    />
  </div>
</template>

<style scoped>
.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.user-avatar__circle,
.user-avatar__image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-avatar__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.user-avatar__image {
  object-fit: cover;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(5, 217, 232, 0.25);
}

.user-avatar__status {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6b7280;
  border: 2px solid rgb(var(--v-theme-surface));
}

.user-avatar__status.is-online {
  background: #05d9e8;
  box-shadow: 0 0 0 rgba(5, 217, 232, 0.6);
  animation: avatar-pulse 2s infinite;
}

@keyframes avatar-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(5, 217, 232, 0.55);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(5, 217, 232, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(5, 217, 232, 0);
  }
}
</style>
