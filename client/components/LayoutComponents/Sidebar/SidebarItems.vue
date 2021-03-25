<template>
  <Fragment>
    <div v-for="(item, index) in items" :key="index">
      <nuxt-link
        v-if="!item.group"
        v-slot="{ navigate, isActive, href }"
        :to="item.link"
        exact
        active-class="active-class hover:bg-gray-800"
        class="text-white hover:bg-gray-900 bg-opacity-10 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
        custom
      >
        <a
          role="link"
          :class="[isActive && 'active-class']"
          :href="href"
          @click="navigate"
        >
          <i
            :class="`${item.icon} text-gray-300 mr-3 h-6 w-6 text-icon navbar-icon`"
          />
          {{ item.name }}
        </a>
      </nuxt-link>
      <div v-else class="space-y-1">
        <button
          class="group w-full text-white group hover:bg-gray-900 flex items-center focus:outline-none px-2 py-2 text-sm font-medium rounded-md"
          x-bind:aria-expanded="isExpanded"
          @click.prevent="item.expanded = !item.expanded"
        >
          <i
            :class="`${item.icon} text-gray-300 mr-3 h-6 w-6 text-icon navbar-icon`"
          />
          {{ item.name }}
          <svg
            :class="{
              'text-gray-400 rotate-90': item.expanded,
              'text-gray-300': !item.expanded,
            }"
            x-state:on="Expanded"
            x-state:off="Collapsed"
            class="ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor"></path>
          </svg>
        </button>
        <div
          v-if="item.expanded"
          x-description="Expandable link section, show/hide based on state."
          class="bg-gray-900 space-y-1"
        >
          <nuxt-link
            v-for="(child, idx) in item.childs"
            :key="idx"
            :to="child.link"
            active-class="active-class"
            class="hover:bg-gray-900 text-white group flex items-center pl-6 pr-2 py-2 text-sm font-medium"
          >
            {{ child.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import { sidebarItems } from '@/assets/config/sidebar.js'
import Vue from 'vue'
import { authStore } from '~/store'

export default Vue.extend({
  components: { Fragment },
  data() {
    return {
      sidebarItems,
      authStore,
      userPages: [],
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    items() {
      const pages = this.authStore.user?.role.pages.map((p) => p.name)
      if (pages) {
        const sitePages = this.sidebarItems.concat()
        return sitePages.filter((item) => {
          if (item.childs) {
            item.childs = item.childs.filter((i) => pages.includes(i.value))
          }
          return pages.includes(item.value)
        })
      }
    },
  },
})
</script>

<style scoped></style>
