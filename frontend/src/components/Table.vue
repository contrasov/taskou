<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowUpDown,
  CheckCircle2,
  Trash2,
} from 'lucide-vue-next'
import type { NewTaskPayload } from './CreateTask.vue'
import { Button } from '@/components/ui/button'

export interface TaskItem {
  id: number
  name: string
  category: string
  priority: 'Alta' | 'Normal' | 'Baixa'
  date: string
  dateExpire: string
  completed: boolean
  progress?: string | null
}

const props = withDefaults(
  defineProps<{
    searchQuery?: string
  }>(),
  {
    searchQuery: ''
  }
)

const tasks = ref<TaskItem[]>([
  {
    id: 1,
    name: 'Finalizar documentação do módulo de usuários.',
    category: 'Documentação',
    priority: 'Alta',
    date: '24/12/2026',
    dateExpire: '24/12/2026',
    completed: false
  },
  {
    id: 2,
    name: 'Revisar Pull Requests pendentes no repositório.',
    category: 'Code Review',
    priority: 'Alta',
    date: '07/01/2026',
    dateExpire: '07/01/2026',
    completed: false
  },
  {
    id: 3,
    name: 'Atualizar dependências do projeto e testar compilação.',
    category: 'Infraestrutura',
    priority: 'Alta',
    date: '07/01/2026',
    dateExpire: '07/01/2026',
    completed: false,
    progress: '74%'
  },
  {
    id: 4,
    name: 'Desenhar mockup das telas de relatórios.',
    category: 'Design',
    priority: 'Normal',
    date: '19/01/2026',
    dateExpire: '19/01/2026',
    completed: true
  },
  {
    id: 5,
    name: 'Configurar servidor de homologação e CI/CD.',
    category: 'DevOps',
    priority: 'Baixa',
    date: '11/02/2026',
    dateExpire: '11/02/2026',
    completed: false,
    progress: '32%'
  },
  {
    id: 6,
    name: 'Realizar testes de carga e desempenho na API.',
    category: 'Testes',
    priority: 'Alta',
    date: '24/02/2026',
    dateExpire: '24/02/2026',
    completed: false
  }
])

const filteredTasks = computed(() => {
  if (!props.searchQuery) return tasks.value
  const query = props.searchQuery.toLowerCase()
  return tasks.value.filter(
    (task) =>
      task.name.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query)
  )
})

const selectedCount = computed(() => {
  return tasks.value.filter((t) => t.completed).length
})

const isAllSelected = computed({
  get: () =>
    filteredTasks.value.length > 0 &&
    filteredTasks.value.every((t) => t.completed),
  set: (val: boolean) => {
    filteredTasks.value.forEach((t) => (t.completed = val))
  }
})

// Funções de ação rápida
const markSelectedAsComplete = () => {
  tasks.value.forEach((t) => {
    if (t.completed) {
      t.completed = true
    }
  })
}

const deleteSelected = () => {
  tasks.value = tasks.value.filter((t) => !t.completed)
}

const addNewTask = (payload: NewTaskPayload) => {
  const newTask: TaskItem = {
    id: Date.now(),
    name: payload.name,
    category: payload.category,
    priority: payload.priority,
    date: payload.dueDate || payload.createdDate,
    dateExpire: payload.dueDate || payload.createdDate,
    completed: false
  }
  tasks.value.unshift(newTask)
}

defineExpose({
  addNewTask
})
</script>

<template>
  <div class="bg-white border border-slate-200 overflow-hidden">
    <!-- Action Bar / Top Toolbar -->
    <div class="bg-[#4d4c51] px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div class="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
        <span class="text-xs font-medium text-slate-200 flex items-center gap-1.5">
          Ações
          <span v-if="selectedCount > 0" class="text-emerald-400 font-bold text-[11px]">
            ({{ selectedCount }})
          </span>:
        </span>

        <!-- Botões diretos de Ação usando Shadcn Button -->
        <Button
          variant="outline"
          size="sm"
          class="h-8 gap-1.5 text-xs text-white border-slate-500 bg-transparent hover:bg-white/10 hover:text-white"
          :disabled="selectedCount === 0"
          @click="markSelectedAsComplete"
        >
          <CheckCircle2 :size="15" />
          <span>Concluir</span>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          class="h-8 gap-1.5 text-xs"
          :disabled="selectedCount === 0"
          @click="deleteSelected"
        >
          <Trash2 :size="15" />
        </Button>
      </div>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-[#4d4c51] text-white text-xs font-semibold uppercase tracking-wider border-t border-[#5f5e63]">
          <tr>
            <th class="w-12 text-center py-3.5 px-3">
              <input
                type="checkbox"
                v-model="isAllSelected"
                class="w-4 h-4 border-slate-400 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
              />
            </th>
            <th class="py-3.5 px-4">
              <div class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <ArrowUpDown :size="14" class="opacity-75" />
                <span>Nome</span>
              </div>
            </th>
            <th class="py-3.5 px-4 w-48">
              <div class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <ArrowUpDown :size="14" class="opacity-75" />
                <span>Categoria</span>
              </div>
            </th>
            <th class="py-3.5 px-4 text-center w-32">Prioridade</th>
            <th class="py-3.5 px-4 text-center w-32">Data</th>
            <th class="py-3.5 px-4 text-center w-32">Expira</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            class="transition hover:bg-slate-50"
            :class="{ 'bg-emerald-50/50 hover:bg-emerald-50!': task.completed }"
          >
            <td class="text-center py-3.5 px-3">
              <input
                type="checkbox"
                v-model="task.completed"
                class="w-4 h-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
            </td>
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-2.5 flex-wrap">
                <span
                  class="text-slate-800 font-medium"
                  :class="{ 'text-slate-400 line-through': task.completed }"
                >
                  {{ task.name }}
                </span>
              </div>
            </td>
            <td class="py-3.5 px-4 text-start">
              <span class="inline-block text-slate-600 text-xs font-medium min-w-28">
                {{ task.category }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-start">
              <span
                class="inline-block text-xs font-semibold text-center border px-2 py-1 w-20"
                :class="{
                  'text-red-600 border-red-600': task.priority === 'Alta',
                  'text-amber-600 border-amber-600': task.priority === 'Normal',
                  'text-slate-500 border-slate-400': task.priority === 'Baixa'
                }"
              >
                {{ task.priority }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-center text-slate-500 text-xs font-medium">
              {{ task.date }}
            </td>
            <td class="py-3.5 px-4 text-center text-slate-500 text-xs font-medium">
              {{ task.dateExpire }}
            </td>
          </tr>

          <tr v-if="filteredTasks.length === 0">
            <td colspan="6" class="text-center py-8 text-slate-400 text-sm">
              Nenhuma atividade encontrada.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
