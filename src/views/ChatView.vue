<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import ConversationList from '../components/chat/ConversationList.vue';
import EmptyState from '../components/chat/EmptyState.vue';
import InviteRequestsPanel from '../components/chat/InviteRequestsPanel.vue';
import MessageInput from '../components/chat/MessageInput.vue';
import MessageThread from '../components/chat/MessageThread.vue';
import ProfileDialog from '../components/chat/ProfileDialog.vue';
import UserAvatar from '../components/chat/UserAvatar.vue';
import UserSearchDialog from '../components/chat/UserSearchDialog.vue';
import { useAuthStore } from '../stores/auth.store';
import { useChatStore } from '../stores/chat.store';
import { useInvitesStore } from '../stores/invites.store';

const chat = useChatStore();
const invites = useInvitesStore();
const auth = useAuthStore();
const router = useRouter();
const { smAndDown } = useDisplay();

const showSearch = ref(false);
const showInvites = ref(false);
const showProfile = ref(false);

const isMobile = computed(() => smAndDown.value);
const showSidebar = computed(() => !isMobile.value || !chat.activeConversationId);
const showMain = computed(() => !isMobile.value || Boolean(chat.activeConversationId));

onMounted(() => {
  chat.fetchConversations();
  invites.fetchPending();
});

function logout(): void {
  chat.reset();
  invites.reset();
  auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="chat-layout app-shell">
    <aside
      v-if="showSidebar"
      class="chat-sidebar glass"
      :class="{ 'chat-sidebar--full': isMobile }"
    >
      <div class="brand-bar px-4 px-sm-5 pt-4 pb-2">
        <span class="brand-title text-subtitle-2 gradient-text" data-text="NEXUS://CHAT"
          >NEXUS://CHAT</span
        >
      </div>

      <div class="sidebar-header px-4 px-sm-5 pb-4 pt-2 d-flex align-center ga-3 ga-sm-4">
        <div class="profile-trigger" @click="showProfile = true">
          <UserAvatar
            :username="auth.user?.username ?? ''"
            :display-name="auth.user?.displayName ?? ''"
            :avatar-url="auth.user?.avatarUrl"
            :size="46"
          />
        </div>
        <div class="flex-grow-1 text-truncate">
          <div class="font-weight-medium text-truncate">{{ auth.user?.displayName }}</div>
          <div class="text-caption text-medium-emphasis">@{{ auth.user?.username }}</div>
        </div>
        <v-btn icon variant="text" @click="showInvites = true">
          <v-badge
            :content="invites.pending.length"
            :model-value="invites.pending.length > 0"
            color="error"
          >
            <v-icon icon="mdi-bell-outline" />
          </v-badge>
        </v-btn>
        <v-btn
          icon="mdi-account-plus-outline"
          variant="text"
          color="secondary"
          @click="showSearch = true"
        />
        <v-btn icon="mdi-logout" variant="text" @click="logout" />
      </div>
      <v-divider />
      <ConversationList />
    </aside>

    <section v-if="showMain" class="chat-main">
      <template v-if="chat.activeConversation">
        <div class="chat-header glass px-4 px-sm-5 py-3 py-sm-4 d-flex align-center ga-3 ga-sm-4">
          <v-btn
            v-if="isMobile"
            icon="mdi-arrow-left"
            variant="text"
            class="mr-n2"
            @click="chat.closeActiveConversation()"
          />
          <UserAvatar
            :username="chat.activeConversation.participant.username"
            :display-name="chat.activeConversation.participant.displayName"
            :avatar-url="chat.activeConversation.participant.avatarUrl"
            :online="chat.isOnline(chat.activeConversation.participant.id)"
          />
          <div class="text-truncate">
            <div class="font-weight-medium text-truncate">
              {{ chat.activeConversation.participant.displayName }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ chat.isOnline(chat.activeConversation.participant.id) ? 'online' : 'offline' }}
            </div>
          </div>
        </div>
        <MessageThread />
        <MessageInput />
      </template>
      <EmptyState v-else />
    </section>

    <UserSearchDialog v-model="showSearch" />
    <InviteRequestsPanel v-model="showInvites" />
    <ProfileDialog v-model="showProfile" />

    <v-snackbar
      :model-value="Boolean(chat.snackbar)"
      timeout="3500"
      color="surface"
      @update:model-value="chat.snackbar = null"
    >
      {{ chat.snackbar }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.chat-layout {
  height: 100dvh;
  height: 100vh;
  display: flex;
}

.chat-sidebar {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 46, 196, 0.12);
}

.chat-sidebar--full {
  width: 100%;
}

.brand-bar {
  letter-spacing: 0.12em;
}

.profile-trigger {
  cursor: pointer;
  border-radius: 50%;
  transition: filter 0.18s ease;
}
.profile-trigger:hover {
  filter: brightness(1.15) drop-shadow(0 0 8px rgba(5, 217, 232, 0.5));
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  border-bottom: 1px solid rgba(5, 217, 232, 0.14);
}
</style>
