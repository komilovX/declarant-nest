import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'

export interface PagesI {
  id?: number
  name: string
  create?: boolean
  read?: boolean
  update?: boolean
  delete?: boolean
}
export interface RolesI {
  id?: number
  role: string
  name: string
  description?: string
  pages: PagesI[]
}

@Module({
  namespaced: true,
  name: 'roles',
  stateFactory: true,
})
class Roles extends VuexModule {
  loading: boolean = false
  roles: RolesI[] = []

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setRoles(roles: RolesI[]) {
    this.roles = roles
  }

  @Mutation
  setRole(role: RolesI) {
    this.roles = [...this.roles, role]
  }

  @Mutation
  editRole(role: RolesI) {
    const index = this.roles.findIndex((r) => r.id === role.id)
    this.roles = [
      ...this.roles.slice(0, index),
      role,
      ...this.roles.slice(index + 1, this.roles.length),
    ]
  }

  @Mutation
  removeRole(id: number) {
    this.roles = this.roles.filter((r: RolesI) => r.id !== id)
  }

  @Action({ rawError: true })
  async fetchRoles() {
    try {
      this.setLoading(true)
      const roles = await $axios.$get('/roles')
      this.setRoles(roles)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async createRole(role: RolesI) {
    try {
      this.setLoading(true)
      const newRole = await $axios.$post('/roles', role)
      this.setRole(newRole)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateRole({ role, id }: { role: RolesI; id: number }) {
    try {
      this.setLoading(true)
      const updatedRole = await $axios.$put(`/roles/${id}`, role)
      this.editRole(updatedRole)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async deleteRole(id: number) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/roles/${id}`)
      this.removeRole(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Roles
