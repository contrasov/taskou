<script setup lang="ts">
import { BContainer, BButton } from 'bootstrap-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  router.push('/')
}
</script>

<template>
  <BContainer class="py-5">
    <div class="bg-white p-5 rounded-4 shadow-sm text-center">
      <h1 class="fw-bold mb-3">Bem-vindo ao Dashboard!</h1>
      <p class="text-muted mb-4">Você está autenticado no Taskou.</p>
      <BButton variant="outline-danger" @click="logout">Sair</BButton>
    </div>
  </BContainer>
</template>
