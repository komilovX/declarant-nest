<template>
  <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
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
    <div class="flex-1 px-4 flex justify-end">
      <h2 class="self-center text-lg">
        {{ authStore && authStore.user && authStore.user.name }}
      </h2>
      <div class="ml-4 flex items-center md:ml-6">
        <!-- Profile dropdown -->
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

<script lang="ts">
import Vue from 'vue'
import { authStore } from '~/store'

export default Vue.extend({
  data() {
    return {
      open: false,
      authStore,
    }
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
  },
})
</script>

<style scoped></style>
