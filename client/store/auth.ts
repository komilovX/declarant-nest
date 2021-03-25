import Cookie from 'js-cookie'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/store'
import { LoginData, AuthI } from '~/utils/types'

interface LoginResponse {
  user: AuthI
  token: string
}

@Module({
  namespaced: true,
  name: 'auth',
  stateFactory: true,
})
class Auth extends VuexModule {
  loading: boolean = false
  user: AuthI | null = null
  token: string | null = null

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  clearToken() {
    Cookie.remove('token')
    $axios.setToken(false)
  }

  @Mutation
  setToken(token: string) {
    Cookie.set('token', token)
    $axios.setToken(token, 'Bearer')
    this.token = token
  }

  @Mutation
  setUser(user: AuthI | null) {
    this.user = user
  }

  @Action
  async clientInit() {
    try {
      const token = Cookie.get('token')
      if (token) {
        $axios.setToken(token, 'Bearer')
        const user = (await $axios.$get('/auth/profile')) as AuthI
        this.setUser(user)
        this.setToken(token)
      }
    } catch (error) {}
  }

  @Action
  logout() {
    this.clearToken()
    this.setUser(null)
  }

  @Action
  async login(loginData: LoginData) {
    try {
      this.setLoading(true)
      const { token, user } = (await $axios.$post(
        '/auth/signin',
        loginData
      )) as LoginResponse

      this.setToken(token)
      this.setUser(user)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Auth
