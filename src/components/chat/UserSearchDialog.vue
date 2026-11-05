<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchUsers } from '../../services/users';
import { useInvitesStore } from '../../stores/invites.store';
import type { UserSummary } from '../../types/models';
import UserAvatar from './UserAvatar.vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const invites = useInvitesStore();
const query = ref('');
const results = ref<UserSummary[]>([]);
const loading = ref(false);
const sentTo = ref(new Set<string>());
const SEARCH_DEBOUNCE_MS = 300;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(query, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  if (!value.trim()) {
    results.value = [];
    return;
  }
  debounceTimer = setTimeout(runSearch, SEARCH_DEBOUNCE_MS);
});

async function runSearch(): Promise<void> {
  loading.value = true;
  try {
    results.value = await searchUsers(query.value);
  } finally {
    loading.value = false;
  }
}

async function sendInvite(user: UserSummary): Promise<void> {
  await invites.send(user.username);
  sentTo.value.add(user.id);
}

function close(): void {
  emit('update:modelValue', false);
  query.value = '';
  results.value = [];
  sentTo.value = new Set();
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    max-width="440"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="glass neon-border pa-2">
      <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
        <span class="brand-title">Novo chat</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>
      <v-card-text class="pa-4 pt-2">
        <v-text-field
          v-model="query"
          prefix="@"
          placeholder="Buscar por usuário"
          prepend-inner-icon="mdi-magnify"
          autofocus
          hide-details
          clearable
        />

        <v-list class="mt-3" bg-color="transparent">
          <v-list-item v-for="user in results" :key="user.id" class="mb-2 py-2" rounded="lg">
            <template #prepend>
              <UserAvatar
                :username="user.username"
                :display-name="user.displayName"
                :avatar-url="user.avatarUrl"
                :size="38"
                class="mr-3"
              />
            </template>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
            <v-list-item-subtitle>@{{ user.username }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                v-if="!sentTo.has(user.id)"
                size="small"
                color="primary"
                variant="tonal"
                @click="sendInvite(user)"
              >
                Convidar
              </v-btn>
              <v-chip v-else size="small" color="success" variant="tonal">Enviado ✓</v-chip>
            </template>
          </v-list-item>
        </v-list>

        <div
          v-if="!loading && query.trim() && results.length === 0"
          class="text-center text-medium-emphasis pa-4 text-body-2"
        >
          Nenhum usuário encontrado.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
