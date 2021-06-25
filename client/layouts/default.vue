<template>
  <div style="min-height: 640px" class="bg-gray-100">
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar
        :sidebar-open="sidebarOpen"
        @closeSidebar="sidebarOpen = false"
      />
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar @openSidebar="sidebarOpen = true" />
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-3 mx-auto px-4 sm:px-6 md:px-3">
            <Nuxt />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/index.vue'
import Navbar from '@/components/LayoutComponents/Navbar/index.vue'
import { errorStore, authStore } from '~/store'
export default Vue.extend({
  components: { Sidebar, Navbar },
  middleware: ['admin-auth'],
  data: () => ({
    errorStore,
    authStore,
    sidebarOpen: false,
    open: false,
  }),
  computed: {
    error(): any {
      return this.errorStore.error
    },
  },
  watch: {
    error(error: any) {
      if (typeof error === 'object') {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (Array.isArray(error.response.data.message)) {
            this.$message.error(error.response.data.message[0])
          } else {
            this.$message.error(error.response.data.message)
          }
        } else {
          this.$message.error('Что-то пошло не так')
        }
      } else {
        this.$message.error(error)
      }
    },
  },
})
</script>
