<template>
  <div style="min-height: 640px" class="bg-gray-100">
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar
        :sidebar-open="sidebarOpen"
        @closeSidebar="sidebarOpen = false"
      />
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar
          :notifyCount="notifications.length"
          @openSidebar="sidebarOpen = true"
          @openDrawer="drawerVisible = true"
        />
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-3 mx-auto px-4 sm:px-6 md:px-3">
            <Nuxt />
          </div>
        </main>
        <el-drawer
          title="Уведомления"
          :visible.sync="drawerVisible"
          direction="rtl"
          :before-close="beforeDrawerClose"
        >
          <div class="notifications">
            <NotificationCard
              v-for="notify of notifications"
              :key="notify.id"
              :notification="notify"
              @messageReaded="messageReaded($event)"
            />
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from '@/components/LayoutComponents/Sidebar/index.vue'
import Navbar from '@/components/LayoutComponents/Navbar/index.vue'
import { errorStore, authStore, notificationStore } from '~/store'
import NotificationCard from '~/components/AppComponents/NotificationCard.vue'
export default Vue.extend({
  components: { Sidebar, Navbar, NotificationCard },
  middleware: ['admin-auth'],
  data: () => ({
    errorStore,
    authStore,
    sidebarOpen: false,
    drawerVisible: false,
    open: false,
  }),
  async fetch() {
    if (!notificationStore.requested) {
      await notificationStore.findAllNotifications()
    }
  },
  computed: {
    error(): any {
      return this.errorStore.error
    },
    notifications() {
      return notificationStore.notifications
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
          } else if (error.response.data.statusCode === 500) {
            this.$message.error('Что-то пошло не так')
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
  methods: {
    beforeDrawerClose() {
      this.drawerVisible = false
    },
    async messageReaded(id: number) {
      try {
        await notificationStore.changeToRead(id)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>
<style scoped>
.notifications {
  height: 100%;
  overflow-y: auto;
}
</style>
