<template>
  <fragment>
    <div
      v-if="sidebarOpen"
      class="md:hidden"
      x-description="Off-canvas menu for mobile, show/hide based on off-canvas menu state."
    >
      <div class="fixed inset-0 flex z-40">
        <transition
          enter-active-class="transition-opacity ease-linear duration-300"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-linear duration-300"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
          ><div
            v-if="sidebarOpen"
            x-description="Off-canvas menu overlay, show/hide based on off-canvas menu state."
            class="fixed inset-0"
            aria-hidden="true"
            @click="$emit('closeSidebar')"
          >
            <div class="absolute inset-0 bg-gray-600 opacity-75"></div></div
        ></transition>
        <transition
          enter-active-class="transition ease-in-out duration-300 transform"
          enter-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition ease-in-out duration-300 transform"
          leave-class="translate-x-0"
          leave-to-class="-translate-x-full"
          ><div
            v-if="sidebarOpen"
            x-description="Off-canvas menu, show/hide based on off-canvas menu state."
            class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800"
          >
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button
                v-if="sidebarOpen"
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                @click="$emit('closeSidebar')"
              >
                <span class="sr-only">Close sidebar</span>
                <svg
                  class="h-6 w-6 text-white"
                  x-description="Heroicon name: x"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="flex items-center jestify-center px-4">
              <p class="text-2xl font-medium text-white">AHEAD GROUP</p>
              <!-- <img class="h-8 w-48" src="apex_logo.svg" alt="Workflow" /> -->
            </div>
            <div class="mt-5 flex-1 h-0 overflow-y-auto">
              <nav class="space-y-1">
                <SidebarItems />
              </nav>
            </div></div
        ></transition>
        <div class="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>
    </div>
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <div class="flex flex-col h-0 flex-1">
          <div class="flex items-center jestify-center h-12 px-4 bg-gray-900">
            <nuxt-link to="/">
              <logo />
            </nuxt-link>
          </div>
          <div class="flex-1 flex flex-col overflow-y-auto">
            <nav class="flex-1 px-2 py-4 bg-gray-800 space-y-1">
              <SidebarItems />
            </nav>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Vue from 'vue'
import { Fragment } from 'vue-fragment'
import Logo from './Logo.vue'
import SidebarItems from './SidebarItems.vue'
export default Vue.extend({
  components: { SidebarItems, Fragment, Logo },
  props: {
    sidebarOpen: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
