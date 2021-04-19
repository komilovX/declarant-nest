import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'
import { UsersI } from '~/utils/types'

@Module({
  namespaced: true,
  name: 'users',
  stateFactory: true,
})
class Users extends VuexModule {
  loading: boolean = false
  users: UsersI[] = []
  user: UsersI | null = null

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setUsers(users: UsersI[]) {
    this.users = users
  }

  @Mutation
  setUser(user: UsersI) {
    this.user = user
  }

  @Action({ rawError: true })
  async findUserById(id: number) {
    try {
      this.setLoading(true)
      const user = await $axios.$get(`/auth/user/${id}`)
      this.setUser(user)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async fetchUsers() {
    try {
      this.setLoading(true)
      const users = await $axios.$get('/auth/users')
      this.setUsers(users)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addUser(formData: any) {
    try {
      this.setLoading(true)
      await $axios.$post('/auth/signup', formData)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async editUser({ id, formData }: { id: number; formData: any }) {
    try {
      this.setLoading(true)
      await $axios.$put(`/auth/user/${id}`, formData)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}
export default Users
