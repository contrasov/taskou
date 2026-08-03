<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  <DialogRoot v-model:open="isVisible">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in duration-200" />
      <DialogContent
        class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 shadow-2xl z-50 border border-slate-100 animate-in zoom-in-95 fade-in duration-200"
      >
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <DialogTitle class="text-lg font-bold text-slate-800 tracking-tight">
            Nova Tarefa
          </DialogTitle>
          <DialogClose as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X :size="18" />
            </Button>
          </DialogClose>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nome da Tarefa -->
          <div>
            <label for="task-name" class="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Tarefa
            </label>
            <Input
              id="task-name"
              v-model="name"
              type="text"
              placeholder="Ex: Refatorar componente de tabela..."
              required
            />
          </div>

          <!-- Categoria e Prioridade -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Categoria
              </label>
              <Select v-model="category">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                      {{ opt.text }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Prioridade
              </label>
              <Select v-model="priority">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                      {{ opt.text }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Data Criada e Data de Prazo -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="task-created-date" class="block text-xs font-semibold text-slate-700 mb-1">
                Data Criada
              </label>
              <Input
                id="task-created-date"
                v-model="createdDate"
                type="date"
                required
              />
            </div>

            <div>
              <label for="task-due-date" class="block text-xs font-semibold text-slate-700 mb-1">
                Data de Prazo
              </label>
              <Input
                id="task-due-date"
                v-model="dueDate"
                type="date"
                required
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="outline"
              @click="isVisible = false"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
            >
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
