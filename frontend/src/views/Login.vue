<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BContainer,
  BRow,
  BCol,
  BCard,
  BCardBody,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
} from 'bootstrap-vue-next'
import { AuthService } from '../services/AuthService'

const email = ref('')
const password = ref('')
const router = useRouter()
const errorMessages = ref('');

async function handleLogin() {
  try {
    errorMessages.value = '';

    await AuthService.login({
      email: email.value,
      password: password.value,
    });

    router.push('/dashboard');

  } catch (error: any) {
    console.error("Login failed:", error.message);
    errorMessages.value = error.message;
  }
}
</script>

<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100 py-2">
    <BContainer>
      <BRow class="justify-content-center w-100">
        <BCol cols="12" sm="10" md="8" lg="5" xl="4" class="w-50">
          <BCard class="border-0 rounded-4 w-100">
            <BCardBody>
              <div class="text-center mb-4">
                <h2 class="fs-5 fw-bold text-dark mb-1">Taskou</h2>
              </div>

              <BForm @submit.prevent="handleLogin">
                <BFormGroup label="E-mail" label-for="email-input" class="mb-3 fw-medium text-secondary">
                  <BFormInput id="email-input" v-model="email" type="email" placeholder="seu.email@exemplo.com"
                    required />
                </BFormGroup>

                <BFormGroup label="Senha" label-for="password-input" class="mb-3 fw-medium text-secondary">
                  <BFormInput id="password-input" v-model="password" type="password" placeholder="••••••••" required />
                </BFormGroup>

                <BButton type="submit" variant="primary" class="w-100 py-2 fw-semibold">
                  Entrar
                </BButton>
              </BForm>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<style scoped>
.login-wrapper {
  background-color: var(--bg);
}
</style>
