<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';

const auth = useAuthStore();

onMounted(() => {
  if (auth.isAuthenticated) {
    auth.reconnectSocket();
  }
});
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>
