<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BFormCheckbox,
  BButton,
  BBadge
} from 'bootstrap-vue-next'
import {
  ArrowUpDown,
  CheckCircle2,
  Trash2,
} from 'lucide-vue-next'
import type { NewTaskPayload } from './CreateTask.vue'

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

// Método para adicionar nova tarefa criada pelo modal
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
  <div class="task-table-card card border-0 shadow-sm rounded-3 overflow-hidden">
    <!-- Action Bar / Top Toolbar -->
    <div
      class="top-action-bar bg-light px-3 py-2 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2"
    >
      <div class="d-flex align-items-center gap-2 flex-wrap w-100 w-md-auto justify-content-center justify-content-md-start">
        <span class="small fw-semibold text-white me-1">
          Ações
          <span v-if="selectedCount > 0" class="badge bg-secondary rounded-pill ms-1">
            {{ selectedCount }}
          </span>:
        </span>

        <!-- Botões diretos de Ação -->
        <BButton
          variant="outline-light"
          size="sm"
          class="d-flex align-items-center gap-1 text-sm rounded-2"
          :disabled="selectedCount === 0"
          @click="markSelectedAsComplete"
        >
          <CheckCircle2 :size="15" />
          <span>Concluir</span>
        </BButton>

        <BButton
          variant="outline-light"
          size="sm"
          class="d-flex align-items-center gap-1 text-sm rounded-2"
          :disabled="selectedCount === 0"
          @click="deleteSelected"
        >
          <Trash2 :size="15" />
          <span>Excluir</span>
        </BButton>
      </div>
    </div>

    <!-- Tabela -->
    <div class="table-responsive">
      <table class="table align-middle mb-0 custom-task-table">
        <thead class="table-dark-header">
          <tr>
            <th style="width: 48px;" class="text-center py-3">
              <BFormCheckbox v-model="isAllSelected" class="custom-checkbox" />
            </th>
            <th class="py-3">
              <div class="d-flex align-items-center gap-1 cursor-pointer">
                <ArrowUpDown :size="14" class="opacity-75" />
                <span>Nome</span>
              </div>
            </th>
            <th class="py-3" style="min-width: 150px; width: 200px;">
              <div class="d-flex align-items-center gap-1 cursor-pointer">
                <ArrowUpDown :size="14" class="opacity-75" />
                <span>Categoria</span>
              </div>
            </th>
            <th class="py-3 text-center" style="min-width: 100px; width: 120px;">Prioridade</th>
            <th class="py-3 text-center" style="min-width: 110px; width: 130px;">Data</th>
            <th class="py-3 text-center" style="min-width: 110px; width: 130px;">Expira</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in filteredTasks"
            :key="task.id"
            :class="{ 'row-selected': task.completed }"
          >
            <td class="text-center py-3">
              <BFormCheckbox v-model="task.completed" class="custom-checkbox" />
            </td>
            <td class="py-3">
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <BBadge
                  v-if="task.progress"
                  bg-color="#00c9a7"
                  class="progress-badge py-1 px-2 text-white fw-bold"
                >
                  {{ task.progress }}
                </BBadge>
                <span
                  class="task-name text-break"
                  :class="{ 'text-muted text-decoration-line-through': task.completed }"
                >
                  {{ task.name }}
                </span>
              </div>
            </td>
            <td class="py-3">
              <span class="badge-category">
                {{ task.category }}
              </span>
            </td>
            <td class="py-3 text-center">
              <span
                class="badge-priority"
                :class="{
                  'priority-high': task.priority === 'Alta',
                  'priority-normal': task.priority === 'Normal',
                  'priority-low': task.priority === 'Baixa'
                }"
              >
                {{ task.priority }}
              </span>
            </td>
            <td class="py-3 text-center text-secondary small">
              {{ task.date }}
            </td>
            <td class="py-3 text-center text-secondary small">
              {{ task.date }}
            </td>
          </tr>

          <tr v-if="filteredTasks.length === 0">
            <td colspan="5" class="text-center py-4 text-muted">
              Nenhuma atividade encontrada.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-task-table {
  font-size: 0.9rem;
}

.top-action-bar {
  background-color: #43414e !important;
}

.table-dark-header {
  background-color: #3b4252;
  color: #eceff4;
}O rodapé duplicado foi removido em

.table-dark-header th {
  background-color: #3b4252 !important;
  color: #eceff4 !important;
  font-weight: 600;
  border-bottom: none;
  white-space: nowrap;
}

.row-selected {
  background-color: #e6f7f3 !important;
}

.row-selected td {
  background-color: #e6f7f3 !important;
}

.progress-badge {
  background-color: #00c9a7;
  font-size: 0.75rem;
  border-radius: 4px;
  width: 48px;
  display: inline-block;
  text-align: center;
}

.badge-category {
  background-color: #f0f2f5;
  color: #495057;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  min-width: 120px;
  padding: 4px 10px;
  border-radius: 6px;
  text-align: center;
}

.badge-priority {
  background-color: #e5e9f0;
  color: #4c566a;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  width: 75px;
  padding: 4px 0;
  border-radius: 6px;
  text-align: center;
}

.page-num-btn {
  color: #4c566a;
  font-weight: 500;
  font-size: 0.85rem;
}

.page-num-btn.active {
  color: #00c9a7;
  font-weight: 700;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
