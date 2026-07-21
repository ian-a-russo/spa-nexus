<script setup lang="ts">
import { ref } from 'vue';
import { uploadAvatar } from '../../services/uploads';
import { useAuthStore } from '../../stores/auth.store';
import UserAvatar from './UserAvatar.vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const auth = useAuthStore();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const errorMessage = ref('');

function pickFile(): void {
  fileInput.value?.click();
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  errorMessage.value = '';
  uploading.value = true;
  try {
    const user = await uploadAvatar(file);
    auth.updateUser(user);
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message ?? 'Não foi possível enviar a foto.';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

function close(): void {
  emit('update:modelValue', false);
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    max-width="380"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="glass neon-border pa-2 text-center">
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
        <span class="brand-title">Meu perfil</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>
      <v-card-text class="pa-4 pt-2 d-flex flex-column align-center ga-4">
        <div class="profile-avatar-wrapper" @click="pickFile">
          <UserAvatar
            :username="auth.user?.username ?? ''"
            :display-name="auth.user?.displayName ?? ''"
            :avatar-url="auth.user?.avatarUrl"
            :size="110"
          />
          <div class="profile-avatar-overlay">
            <v-progress-circular v-if="uploading" indeterminate color="secondary" size="28" />
            <v-icon v-else icon="mdi-camera-outline" size="28" />
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileChange" />

        <div>
          <div class="text-h6">{{ auth.user?.displayName }}</div>
          <div class="text-body-2 text-medium-emphasis">@{{ auth.user?.username }}</div>
        </div>

        <v-btn
          variant="tonal"
          color="secondary"
          prepend-icon="mdi-camera-outline"
          :loading="uploading"
          @click="pickFile"
        >
          Alterar foto
        </v-btn>

        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="w-100">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.profile-avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
}

.profile-avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 0, 20, 0.5);
  opacity: 0;
  transition: opacity 0.18s ease;
}

.profile-avatar-wrapper:hover .profile-avatar-overlay {
  opacity: 1;
}
</style>
