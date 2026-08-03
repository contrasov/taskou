<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/AuthService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('')
const password = ref('')
const router = useRouter()
const errorMessages = ref('')

async function handleLogin() {
  try {
    errorMessages.value = ''

    await AuthService.login({
      email: email.value,
      password: password.value,
    })

    router.push('/dashboard')

  } catch (error: any) {
    console.error("Login failed:", error.message)
    errorMessages.value = error.message
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight mb-1">Taskou</h1>
        <p class="text-xs text-slate-400">Faça login para gerenciar suas tarefas</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="errorMessages" class="p-3 bg-red-50 text-red-600 text-xs border border-red-100">
          {{ errorMessages }}
        </div>

        <div>
          <label for="email-input" class="block text-xs font-medium text-slate-600 mb-1.5">
            E-mail
          </label>
          <Input
            id="email-input"
            v-model="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            required
          />
        </div>

        <div>
          <label for="password-input" class="block text-xs font-medium text-slate-600 mb-1.5">
            Senha
          </label>
          <Input
            id="password-input"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button class="w-full" type="submit">Entrar</Button>
      </form>
    </div>
  </div>
</template>
