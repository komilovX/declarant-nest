import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/store'

@Module({
  namespaced: true,
  name: 'notifications',
  stateFactory: true,
})
class Notifications extends VuexModule {
  loading: boolean = false

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Action
  async findAllNotifications() {
    try {
      this.setLoading(true)
      return await $axios.$get('/notifications')
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action
  async changeToRead(id: number) {
    try {
      this.setLoading(true)
      await $axios.$put(`/notifications/${id}`)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Notifications
