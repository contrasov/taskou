<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Heart, Search, ChevronDown, LogOut } from 'lucide-vue-next'
import { Input } from './ui/input'
import { Button } from './ui/button'

const router = useRouter()
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const searchQuery = defineModel<string>({ default: '' })

const notifications = ref([
  {
    id: 1,
    icon: Bell,
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

const handleLogout = () => {
  router.push('/')
}
</script>

<template>
  <header class="bg-white border-b border-gray-100 py-3 px-4 md:px-6">
    <div class="flex items-center justify-between gap-4 max-w-7xl mx-auto">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-xs">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
        <Input v-model="searchQuery" type="search" placeholder="Pesquisar tarefas..." class="w-full pl-9 pr-4 py-1.5" />
      </div>

      <div class="flex items-center gap-3 md:gap-5">
        <!-- Notifications Dropdown -->
        <div class="relative">
          <Button variant="ghost" size="icon"
            class="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer" title="Notificações"
            @click="toggleNotifications">
            <Bell :size="20" class="text-emerald-600" />
            <span class="absolute -top-0.5 -right-0.5 text-emerald-500 text-[10px] font-bold">
              14
            </span>
          </Button>

          <!-- Notifications Popover -->
          <div v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <h6 class="font-semibold mb-3 text-slate-700 border-b border-slate-100 pb-2 text-sm">
              Notificações
            </h6>
            <div v-for="item in notifications" :key="item.id" class="flex gap-3 items-start mb-3 last:mb-0">
              <component :is="item.icon" :size="16" class="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-xs text-slate-800 leading-snug font-medium mb-0.5">{{ item.title }}</p>
                <span class="text-[11px] text-slate-400">
                  {{ item.time }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile with Dropdown Menu -->
        <div class="relative">
          <Button variant="ghost"
            class="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-slate-100 h-auto font-normal"
            @click="toggleProfileMenu">
            <img src="https://picsum.photos/40" alt="Avatar" class="border border-slate-200 object-cover" width="34"
              height="34" />
            <span class="font-medium text-slate-700 text-sm hidden sm:inline">
              Lorem
            </span>
            <ChevronDown :size="14" class="text-slate-400 hidden sm:inline" />
          </Button>

          <!-- Profile Dropdown Popover -->
          <div v-if="showProfileMenu"
            class="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div class="px-3 py-2 border-b border-slate-100 mb-1">
              <p class="font-semibold text-xs text-slate-800 mb-0">Lorem</p>
              <span class="text-[11px] text-slate-400">
                lorem@exemplo.com
              </span>
            </div>

            <Button variant="ghost"
              class="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full justify-start cursor-pointer h-auto"
              @click="handleLogout">
              <LogOut :size="16" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
