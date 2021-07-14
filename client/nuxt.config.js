export default {
  ssr: false,
  server: {
    port: 3000,
    // host: "207.154.223.158"
  },
  head: {
    title: 'client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['element-ui/lib/theme-chalk/index.css', '~/assets/styles/index.scss'],

  plugins: [
    '@/plugins/element-ui',
    '@/plugins/composition-api.ts',
    '@/plugins/axios-accessor.ts',
    '@/plugins/nuxt-client-init.ts',
    '@/plugins/beautiful-chat',
    '@/utils/directive.ts',
    '@/utils/filters.ts',
  ],

  components: true,

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],

  axios: {
    baseURL: 'http://localhost:8080',
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  transpileDependencies: ['vuex-module-decorators'],

  build: {
    transpile: [/^element-ui/],
    extend(config, _ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    },
  },
}
