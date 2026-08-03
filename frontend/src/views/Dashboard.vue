<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import Table from '../components/Table.vue'
import CreateTask, { type NewTaskPayload } from '../components/CreateTask.vue'
import Header from '../components/Header.vue'
import { Button } from '@/components/ui/button'

const searchQuery = ref('')
const showCreateModal = ref(false)
const tableRef = ref<InstanceType<typeof Table> | null>(null)

const handleTaskCreated = (payload: NewTaskPayload) => {
  if (tableRef.value) {
    tableRef.value.addNewTask(payload)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- Header -->
    <Header v-model="searchQuery" />

    <main class="max-w-7xl mx-auto py-6 px-4 md:px-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-slate-800 tracking-tight">
          Tarefas
        </h1>

        <Button @click="showCreateModal = true"> <Plus /> Adicionar Tarefa </Button>
      </div>

      <Table ref="tableRef" :search-query="searchQuery" />

      <CreateTask
        v-model="showCreateModal"
        @create-task="handleTaskCreated"
      />
    </main>
  </div>
</template>