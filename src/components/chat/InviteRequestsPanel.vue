<script setup lang="ts">
import { useChatStore } from '../../stores/chat.store';
import { useInvitesStore } from '../../stores/invites.store';
import UserAvatar from './UserAvatar.vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const invites = useInvitesStore();
const chat = useChatStore();

async function accept(inviteId: string): Promise<void> {
  const conversation = await invites.accept(inviteId);
  chat.addConversation(conversation);
  await chat.openConversation(conversation.id);
  emit('update:modelValue', false);
}

async function reject(inviteId: string): Promise<void> {
  await invites.reject(inviteId);
}
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    max-width="440"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="glass neon-border pa-2">
      <v-card-title class="pa-4 pb-2"
        ><span class="brand-title">Convites recebidos</span></v-card-title
      >
      <v-card-text class="pa-4 pt-2">
        <v-list bg-color="transparent">
          <v-list-item
            v-for="invite in invites.pending"
            :key="invite.id"
            class="mb-2 py-2"
            rounded="lg"
          >
            <template #prepend>
              <UserAvatar
                :username="invite.sender.username"
                :display-name="invite.sender.displayName"
                :avatar-url="invite.sender.avatarUrl"
                :size="38"
                class="mr-3"
              />
            </template>
            <v-list-item-title>{{ invite.sender.displayName }}</v-list-item-title>
            <v-list-item-subtitle>@{{ invite.sender.username }}</v-list-item-subtitle>
            <template #append>
              <div class="d-flex ga-2">
                <v-btn
                  icon="mdi-check"
                  size="small"
                  color="primary"
                  variant="flat"
                  @click="accept(invite.id)"
                />
                <v-btn icon="mdi-close" size="small" variant="tonal" @click="reject(invite.id)" />
              </div>
            </template>
          </v-list-item>
        </v-list>

        <div
          v-if="invites.pending.length === 0"
          class="text-center text-medium-emphasis pa-6 text-body-2"
        >
          Nenhum convite pendente.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
