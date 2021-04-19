import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'
import { OrdersI } from '~/utils/types'

@Module({
  namespaced: true,
  name: 'orders',
  stateFactory: true,
})
class Orders extends VuexModule {
  orders: OrdersI[] = []
  loading: boolean = false

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setOrders(orders: OrdersI[]) {
    this.orders = orders
  }

  @Mutation
  setOrder(order: OrdersI) {
    this.orders = [...this.orders, order]
  }

  @Mutation
  editOrder(order: OrdersI) {
    const index = this.orders.findIndex((o) => o.id === order.id)
    this.orders = [
      ...this.orders.slice(0, index),
      order,
      ...this.orders.slice(index + 1, this.orders.length),
    ]
  }

  @Mutation
  deleteOrders(id: number) {
    this.orders = this.orders.filter((order) => order.id !== id)
  }

  @Action({ rawError: true })
  async createOrder(data: any) {
    try {
      this.setLoading(true)
      const order = await $axios.$post('/orders', data)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async findOrderById(id: number): Promise<OrdersI> {
    try {
      this.setLoading(true)
      const order = await $axios.$get(`/orders/${id}`)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async findOrderByIdWithDetails(id: number) {
    try {
      this.setLoading(true)
      const order = await $axios.$get(`/orders/detail/${id}`)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async findOrderByIdWithDetailsForDeclarant(id: number, declarant: string) {
    try {
      this.setLoading(true)
      const order = await $axios.$get(
        `/orders/detail/${id}?declarant=${declarant}`
      )
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async findOrderByUserDocument(id: number) {
    try {
      this.setLoading(true)
      const order = await $axios.$get(`/orders/document/${id}`)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateOrder({ id, data }: { id: number; data: any }) {
    try {
      this.setLoading(true)
      const order = await $axios.$put(`/orders/${id}`, data)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateOrderItems({ id, data }: { id: number; data: any }) {
    try {
      this.setLoading(true)
      const order = await $axios.$put(`/orders/items/${id}`, data)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateOrderPrice({ id, data }: { id: number; data: any }) {
    try {
      this.setLoading(true)
      const order = await $axios.$put(`/orders/orderPrice/${id}`, data)
      this.setLoading(false)
      return order
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Orders
