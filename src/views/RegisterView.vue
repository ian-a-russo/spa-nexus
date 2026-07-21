<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const displayName = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function submit(): Promise<void> {
  errorMessage.value = '';
  loading.value = true;
  try {
    await auth.register(username.value, displayName.value, password.value);
    await router.push({ name: 'chat' });
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message ?? 'Não foi possível criar sua conta.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page app-shell">
    <v-card class="glass neon-border pa-6 pa-sm-10" width="100%" max-width="400" elevation="0">
      <div class="text-center mb-8">
        <div class="brand-heading font-weight-black gradient-text glitch" data-text="CRIAR CONTA">
          CRIAR CONTA
        </div>
        <div class="text-body-2 text-medium-emphasis mt-2">Escolha um @usuário único</div>
      </div>

      <v-form class="d-flex flex-column ga-1" @submit.prevent="submit">
        <v-text-field
          v-model="username"
          label="Usuário"
          prefix="@"
          autocomplete="username"
          prepend-inner-icon="mdi-at"
          hint="3-20 caracteres: letras, números e _"
        />
        <v-text-field
          v-model="displayName"
          label="Nome de exibição"
          autocomplete="name"
          prepend-inner-icon="mdi-account-outline"
        />
        <v-text-field
          v-model="password"
          label="Senha"
          type="password"
          autocomplete="new-password"
          prepend-inner-icon="mdi-lock-outline"
          hint="Mínimo 6 caracteres"
        />

        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-2 mt-2">
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
          Criar conta
        </v-btn>
      </v-form>

      <div class="text-center mt-8 text-body-2">
        Já tem conta?
        <router-link to="/login" class="text-secondary font-weight-medium">Entrar</router-link>
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
