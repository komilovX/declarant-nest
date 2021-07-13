import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/store'
import { NotificationI } from '~/utils/types'

@Module({
  namespaced: true,
  name: 'notifications',
  stateFactory: true,
})
class Notifications extends VuexModule {
  loading: boolean = false
  requested: boolean = false
  notifications: NotificationI[] = []

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setRequested(requested: boolean) {
    this.requested = requested
  }

  @Mutation
  setNotifications(notifications: NotificationI[]) {
    this.notifications = notifications
  }

  @Mutation
  deleteNotifications(id: number) {
    this.notifications = this.notifications.filter((not) => not.id !== id)
  }

  @Action
  async findAllNotifications() {
    try {
      this.setLoading(true)
      const notifications = await $axios.$get('/notifications')
      this.setNotifications(notifications)
      this.setLoading(false)
      this.setRequested(true)
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
      this.deleteNotifications(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Notifications
