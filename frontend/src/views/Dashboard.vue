<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BFormInput,
  BBadge,
  BButton
} from 'bootstrap-vue-next'
import {
  Search,
  Megaphone,
  ChevronDown,
  Heart,
  LogOut,
  Plus
} from 'lucide-vue-next'
import Table from '../components/Table.vue'
import CreateTask, { type NewTaskPayload } from '../components/CreateTask.vue'

const router = useRouter()
const searchQuery = ref('')
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const showCreateModal = ref(false)
const tableRef = ref<InstanceType<typeof Table> | null>(null)

const notifications = ref([
  {
    id: 1,
    icon: Megaphone,
    title: 'Use um título que resuma brevemente as informações mais importantes.',
    time: 'há 15 minutos'
  },
  {
    id: 2,
    icon: Heart,
    title: 'Use no máximo 72 caracteres para acomodar a localização.',
    time: 'há 3 horas'
  }
])

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    showProfileMenu.value = false
  }
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  if (showProfileMenu.value) {
    showNotifications.value = false
  }
}

const handleTaskCreated = (payload: NewTaskPayload) => {
  if (tableRef.value) {
    tableRef.value.addNewTask(payload)
  }
}

const handleLogout = () => {
  router.push('/')
}
</script>

<template>
  <div class="dashboard-page bg-light min-vh-100">
    <!-- Header -->
    <header class="dashboard-header bg-white border-bottom py-2 px-3 px-md-4 shadow-sm">
      <div class="d-flex align-items-center justify-content-between gap-2">
        <!-- Search Input -->
        <div class="search-bar position-relative flex-grow-1" style="max-width: 320px;">
          <Search class="search-icon text-muted" :size="16" />
          <BFormInput
            v-model="searchQuery"
            type="search"
            placeholder="Pesquisar tarefas..."
            class="ps-5 bg-light border-0 rounded-3 text-sm"
          />
        </div>

        <div class="d-flex align-items-center gap-2 gap-sm-3 gap-md-4">
          <!-- Notifications Dropdown -->
          <div class="position-relative">
            <button
              class="btn p-0 position-relative text-secondary d-flex align-items-center justify-content-center"
              style="width: 36px; height: 36px;"
              title="Notificações"
              @click="toggleNotifications"
            >
              <Megaphone :size="20" class="text-success" />
              <BBadge
                pill
                variant="success"
                class="position-absolute top-0 start-100 translate-middle notification-badge"
              >
                14
              </BBadge>
            </button>

            <!-- Notifications Popover -->
            <div
              v-if="showNotifications"
              class="notifications-popover shadow-lg rounded-3 border bg-white position-absolute end-0 mt-2 p-3 z-3"
            >
              <h6 class="fw-bold mb-3 text-secondary border-bottom pb-2">
                Notificações
              </h6>
              <div
                v-for="item in notifications"
                :key="item.id"
                class="d-flex gap-2 align-items-start mb-3"
              >
                <component :is="item.icon" :size="16" class="text-muted mt-1 flex-shrink-0" />
                <div>
                  <p class="small mb-1 text-dark lh-sm">{{ item.title }}</p>
                  <span class="text-muted opacity-75" style="font-size: 0.75rem;">
                    {{ item.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile with Dropdown Menu -->
          <div class="position-relative">
            <div
              class="d-flex align-items-center gap-2 cursor-pointer py-1 px-2 rounded-3 user-profile-btn"
              @click="toggleProfileMenu"
            >
              <img
                src="https://picsum.photos/40"
                alt="Avatar"
                class="rounded-circle border"
                width="34"
                height="34"
              />
              <span class="fw-semibold text-dark small d-none d-sm-inline">
                Lorem
              </span>
              <ChevronDown :size="14" class="text-muted d-none d-sm-inline" />
            </div>

            <!-- Profile Dropdown Popover -->
            <div
              v-if="showProfileMenu"
              class="profile-popover shadow-lg rounded-3 border bg-white position-absolute end-0 mt-2 py-2 z-3"
            >
              <div class="px-3 py-2 border-bottom mb-1">
                <p class="fw-semibold mb-0 small text-dark">Lorem</p>
                <span class="text-muted opacity-75" style="font-size: 0.75rem;">
                  lorem@exemplo.com
                </span>
              </div>

              <button
                class="dropdown-item px-3 py-2 d-flex align-items-center gap-2 text-danger small w-100 text-start border-0 bg-transparent hover-danger-bg"
                @click="handleLogout"
              >
                <LogOut :size="16" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container-fluid py-3 py-md-4 px-3 px-md-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h4 class="fw-semibold text-secondary mb-0 fs-5 fs-md-4">
          Tarefas
        </h4>

        <BButton
          variant="success"
          class="d-flex align-items-center gap-2 rounded-3 fw-semibold shadow-sm"
          @click="showCreateModal = true"
        >
          <Plus :size="18" />
          <span>Adicionar Tarefa</span>
        </BButton>
      </div>

      <Table ref="tableRef" :search-query="searchQuery" />

      <CreateTask
        v-model="showCreateModal"
        @create-task="handleTaskCreated"
      />
    </main>
  </div>
</template>

<style scoped>
.dashboard-header {
  min-height: 60px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
}

.notification-badge {
  font-size: 0.65rem;
  padding: 0.25em 0.45em;
  background-color: #00c9a7 !important;
}

.notifications-popover {
  top: 100%;
  width: 280px;
}

.profile-popover {
  top: 100%;
  width: 200px;
}

@media (min-width: 576px) {
  .notifications-popover {
    width: 320px;
  }
}

.user-profile-btn {
  transition: background-color 0.2s ease;
}

.user-profile-btn:hover {
  background-color: #f0f2f5;
}

.dropdown-item {
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.hover-danger-bg:hover {
  background-color: #fff5f5 !important;
  color: #dc3545 !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
