import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/store'

@Module({
  namespaced: true,
  name: 'statistics',
  stateFactory: true,
})
class Statistics extends VuexModule {
  loading: boolean = false

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Action
  async findTasksAndOrdersCount() {
    try {
      this.setLoading(true)
      return await $axios.$get('/statisitcs')
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action
  async findTasksForCalendar(date?: string) {
    try {
      this.setLoading(true)
      if (date) {
        return await $axios.$get(`/statisitcs/calendar?date=${date}`)
      } else {
        return await $axios.$get('/statisitcs/calendar')
      }
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Statistics
