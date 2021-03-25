<template>
  <div>
    <div class="min-h-screen bg-white flex">
      <div
        class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
      >
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              class="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Войдите в свой аккаунт
            </h2>
          </div>

          <div class="mt-8">
            <div class="mt-6">
              <form
                action="#"
                method="POST"
                class="space-y-6"
                @submit="loginSystem"
              >
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Логин
                  </label>
                  <div class="mt-1">
                    <input
                      id="login"
                      v-model="login"
                      name="login"
                      type="text"
                      autocomplete="login"
                      required=""
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Пароль
                  </label>
                  <div class="mt-1">
                    <input
                      id="password"
                      v-model="password"
                      name="password"
                      type="password"
                      autocomplete="current-password"
                      required=""
                      class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    :disabled="authStore.loading"
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Войти
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden lg:block relative bg-gray-200 flex-1">
        <img
          class="absolute top-0 left-0 inset-0 h-1/4 w-30"
          src="illustrations/lost_online.svg"
          alt=""
        />
        <img
          class="absolute left-32 bottom-0 h-80 w-80"
          src="illustrations/location_search.svg"
          alt=""
        />
        <img
          class="absolute right-8 top-8 h-auto w-80"
          src="illustrations/counting_stars.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
import { authStore } from '~/store'
export default {
  layout: 'empty',
  data() {
    return {
      login: null,
      password: null,
      authStore,
    }
  },
  mounted() {
    const { message } = this.$route.query
    switch (message) {
      case 'login':
        this.$message.warning('Вход только после авторизации')
        break
      case 'session':
        this.$message.info(
          'Ваша сессия истекла. Пожалуйста, авторизуйтесь снова, чтобы продолжить работу.'
        )
        break
      case 'logout':
        this.$message.success('Вы успешно выйти из систему.')
        break
      default:
        break
    }
  },
  methods: {
    async loginSystem(e) {
      try {
        e.preventDefault()
        await authStore.login({ login: this.login, password: this.password })
        this.$router.push('/')
      } catch (error) {}
    },
  },
}
</script>
