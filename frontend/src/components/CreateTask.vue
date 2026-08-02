<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BButton
} from 'bootstrap-vue-next'

export interface NewTaskPayload {
  name: string
  category: string
  priority: 'Alta' | 'Normal' | 'Baixa'
  createdDate: string
  dueDate: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create-task', payload: NewTaskPayload): void
}>()

const today = new Date().toISOString().split('T')[0]

const name = ref('')
const category = ref('Documentação')
const priority = ref<'Alta' | 'Normal' | 'Baixa'>('Normal')
const createdDate = ref(today)
const dueDate = ref('')

const categoryOptions = [
  { value: 'Documentação', text: 'Documentação' },
  { value: 'Code Review', text: 'Code Review' },
  { value: 'Infraestrutura', text: 'Infraestrutura' },
  { value: 'Design', text: 'Design' },
  { value: 'DevOps', text: 'DevOps' },
  { value: 'Testes', text: 'Testes' },
  { value: 'Outros', text: 'Outros' }
]

const priorityOptions = [
  { value: 'Alta', text: 'Alta' },
  { value: 'Normal', text: 'Normal' },
  { value: 'Baixa', text: 'Baixa' }
]

const isVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
  }
)

watch(isVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

const resetForm = () => {
  name.value = ''
  category.value = 'Documentação'
  priority.value = 'Normal'
  createdDate.value = new Date().toISOString().split('T')[0]
  dueDate.value = ''
}

const handleSubmit = () => {
  if (!name.value.trim()) return

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  emit('create-task', {
    name: name.value,
    category: category.value,
    priority: priority.value,
    createdDate: formatDate(createdDate.value),
    dueDate: formatDate(dueDate.value)
  })

  resetForm()
  isVisible.value = false
}
</script>

<template>
  <BModal
    v-model="isVisible"
    title="Nova Tarefa"
    centered
    header-class="border-bottom-0 pb-0"
    footer-class="border-top-0 pt-0"
  >
    <BForm id="create-task-form" @submit.prevent="handleSubmit">
      <!-- Nome da Tarefa -->
      <BFormGroup
        label="Nome da Tarefa"
        label-for="task-name"
        class="mb-3 fw-semibold text-secondary"
      >
        <BFormInput
          id="task-name"
          v-model="name"
          placeholder="Ex: Refatorar componente de tabela..."
          required
        />
      </BFormGroup>

      <!-- Grid Categoria e Prioridade -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <BFormGroup
            label="Categoria"
            label-for="task-category"
            class="fw-semibold text-secondary"
          >
            <BFormSelect
              id="task-category"
              v-model="category"
              :options="categoryOptions"
              required
            />
          </BFormGroup>
        </div>

        <div class="col-md-6 mb-3">
          <BFormGroup
            label="Prioridade"
            label-for="task-priority"
            class="fw-semibold text-secondary"
          >
            <BFormSelect
              id="task-priority"
              v-model="priority"
              :options="priorityOptions"
              required
            />
          </BFormGroup>
        </div>
      </div>

      <!-- Grid Data Criada e Data de Prazo -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <BFormGroup
            label="Data Criada"
            label-for="task-created-date"
            class="fw-semibold text-secondary"
          >
            <BFormInput
              id="task-created-date"
              v-model="createdDate"
              type="date"
              required
            />
          </BFormGroup>
        </div>

        <div class="col-md-6 mb-3">
          <BFormGroup
            label="Data de Prazo"
            label-for="task-due-date"
            class="fw-semibold text-secondary"
          >
            <BFormInput
              id="task-due-date"
              v-model="dueDate"
              type="date"
              required
            />
          </BFormGroup>
        </div>
      </div>
    </BForm

    <!-- Footer oficial do BModal via slot -->
    <template #modal-footer="{ cancel }">
      <BButton variant="light" @click="cancel()">
        Cancelar
      </BButton>
      <BButton
        type="submit"
        form="create-task-form"
        variant="success"
        class="fw-semibold px-4"
      >
        Criar Tarefa
      </BButton>
    </template>
  </BModal>
</template>
