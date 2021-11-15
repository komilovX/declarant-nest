import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/store'

@Module({
  namespaced: true,
  name: 'events',
  stateFactory: true,
})
class Events extends VuexModule {
  loading: boolean = false
  events: any = []

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setEvents(events: any) {
    this.events = events
  }

  @Action({ rawError: true })
  async findAll(date?: string) {
    try {
      this.setLoading(true)
      if (date) {
        return await $axios.$get(`/events?date=${date}`)
      } else {
        return await $axios.$get('/events')
      }
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async create(data: any) {
    try {
      this.setLoading(true)
      return await $axios.$post('/events', data)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async update({ data, id }: { data: any; id: number }) {
    try {
      this.setLoading(true)
      return await $axios.$put(`/events/${id}`, data)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async delete(id: number) {
    try {
      this.setLoading(true)
      return await $axios.$delete(`/events/${id}`)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Events
