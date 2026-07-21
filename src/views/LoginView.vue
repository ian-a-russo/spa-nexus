<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function submit(): Promise<void> {
  errorMessage.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    await router.push({ name: 'chat' });
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message ?? 'Não foi possível entrar.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page app-shell">
    <v-card class="glass neon-border pa-6 pa-sm-10" width="100%" max-width="400" elevation="0">
      <div class="text-center mb-8">
        <div class="brand-heading font-weight-black gradient-text glitch" data-text="NEXUS://CHAT">
          NEXUS://CHAT
        </div>
        <div class="text-body-2 text-medium-emphasis mt-2">Entre para continuar suas conversas</div>
      </div>

      <v-form class="d-flex flex-column ga-1" @submit.prevent="submit">
        <v-text-field
          v-model="username"
          label="Usuário"
          prefix="@"
          autocomplete="username"
          prepend-inner-icon="mdi-at"
        />
        <v-text-field
          v-model="password"
          label="Senha"
          type="password"
          autocomplete="current-password"
          prepend-inner-icon="mdi-lock-outline"
        />

        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-2">
          {{ errorMessage }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          class="mt-3 neon-glow-primary"
        >
          Entrar
        </v-btn>
      </v-form>

      <div class="text-center mt-8 text-body-2">
        Ainda não tem conta?
        <router-link to="/register" class="text-secondary font-weight-medium">Criar conta</router-link>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.brand-heading {
  font-size: clamp(1.5rem, 7vw, 2.125rem);
  line-height: 1.2;
}
</style>
