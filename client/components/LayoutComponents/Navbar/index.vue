<template>
  <div class="relative z-10 flex-shrink-0 flex h-12 bg-white shadow">
    <button
      class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
      @click="$emit('openSidebar', true)"
    >
      <span class="sr-only">Open sidebar</span>
      <svg
        class="h-6 w-6"
        x-description="Heroicon name: menu-alt-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h7"
        ></path>
      </svg>
    </button>
    <div class="flex items-center pl-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
          <nuxt-link v-if="item.link" :to="item.link">{{
            item.name
          }}</nuxt-link>
          <span v-else>{{ item.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex-1 px-4 flex justify-end">
      <h2 class="self-center text-lg">
        {{ authStore && authStore.user && authStore.user.name }}
      </h2>
      <div class="ml-4 flex items-center md:ml-3">
        <!-- Profile dropdown -->
        <el-badge :value="notifyCount" class="item mt-1 mr-2">
          <button
            class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="$emit('openDrawer')"
          >
            <svg
              class="h-7 w-7"
              x-description="Heroicon name: bell"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </el-badge>
        <button
          class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="logOut"
        >
          <svg
            class="h-7 w-7"
            x-description="Heroicon name: bell"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M15.4444 17.5L19 13M19 13L15.4444 8.5M19 13L6.55556 13M11.8889 17.5V18.625C11.8889 20.489 10.695 22 9.22222 22H5.66667C4.19391 22 3 20.489 3 18.625V7.375C3 5.51104 4.19391 4 5.66667 4H9.22222C10.695 4 11.8889 5.51104 11.8889 7.375V8.5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { sidebarItems } from '@/assets/config/sidebar'
import { authStore } from '~/store'
export default Vue.extend({
  props: {
    notifyCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      breadcrumb: [],
      open: false,
      authStore,
    }
  },
  watch: {
    $route() {
      this.breadcrumb = []
      this.getBreadCrumb()
    },
  },
  mounted() {
    this.getBreadCrumb()
  },
  methods: {
    logOut() {
      this.$confirm(
        'Вы уверены что хотите выйти из система?',
        'Подтверждение',
        {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning',
        }
      )
        .then(() => {
          try {
            this.$router.push('/login?message=logout')
            authStore.logout()
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    getBreadCrumb() {
      const matched = this.$route.matched.filter((route) => route.name)
      const first = matched[0]
      if (first && first.name === 'index') {
        this.breadcrumb = [{ name: 'Главная' }]
      } else {
        this.breadcrumb.push({ name: 'Главная', link: '/' })
        let sidebar = []
        sidebarItems.forEach((s) => {
          if (s.childs) {
            sidebar = sidebar.concat(s.childs)
            sidebar.push(s)
          } else {
            sidebar.push(s)
          }
        })
        matched.forEach((item) => {
          const route = sidebar.find((s) => s.value === item.name)
          this.breadcrumb.push({ name: route.name, link: route.link })
        })
      }
    },
  },
})
</script>

<style scoped></style>
