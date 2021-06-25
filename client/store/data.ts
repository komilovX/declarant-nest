import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'
import { Clients, Departments, ProductI, Shippers } from '~/utils/types'

@Module({
  namespaced: true,
  name: 'data',
  stateFactory: true,
})
class Data extends VuexModule {
  loading: boolean = false
  clients: Clients[] = []
  shippers: Shippers[] = []
  products: ProductI[] = []
  departments: Departments[] = []

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setClients(clients: Clients[]) {
    this.clients = clients
  }

  @Mutation
  setClient(client: Clients) {
    this.clients = [...this.clients, client]
  }

  @Mutation
  editClient(client: Clients) {
    const index = this.clients.findIndex((r) => r.id === client.id)
    this.clients = [
      ...this.clients.slice(0, index),
      client,
      ...this.clients.slice(index + 1, this.clients.length),
    ]
  }

  @Mutation
  addClientDirector(id: number) {
    const client = this.clients.find((r) => r.id === id)
    if (client) {
      client.directors.push({ name: '' })
    }
  }

  @Mutation
  deleteClientDirector({ id, index }: { id: number; index: number }) {
    const client = this.clients.find((r) => r.id === id)
    if (client) {
      client.directors.splice(index, 1)
    }
  }

  @Mutation
  editClientDirector({
    id,
    index,
    value,
  }: {
    id: number
    index: number
    value: any
  }) {
    const client = this.clients.find((r) => r.id === id)
    if (client) {
      client.directors[index].name = value
    }
  }

  @Mutation
  deleteClient(id: number) {
    this.clients = this.clients.filter((d) => d.id !== id)
  }

  // Shipper mutations
  @Mutation
  setShippers(shippers: Shippers[]) {
    this.shippers = shippers
  }

  @Mutation
  setShipper(shipper: Shippers) {
    this.shippers = [...this.shippers, shipper]
  }

  @Mutation
  editShipper(shipper: Shippers) {
    const index = this.shippers.findIndex((r) => r.id === shipper.id)
    this.shippers = [
      ...this.shippers.slice(0, index),
      shipper,
      ...this.shippers.slice(index + 1, this.shippers.length),
    ]
  }

  @Mutation
  deleteShipper(id: number) {
    this.shippers = this.shippers.filter((d) => d.id !== id)
  }

  // Departments Mutations

  @Mutation
  setDepartments(departments: Departments[]) {
    this.departments = departments
  }

  @Mutation
  setDepartment(department: Departments) {
    this.departments = [...this.departments, department]
  }

  @Mutation
  deleteDepartment(id: number) {
    this.departments = this.departments.filter((d) => d.id !== id)
  }

  // Products

  @Mutation
  setProducts(products: ProductI[]) {
    this.products = products
  }

  @Mutation
  setProduct(product: ProductI) {
    this.products = [...this.products, product]
  }

  @Mutation
  editProduct(product: ProductI) {
    const index = this.products.findIndex((p) => p.id === product.id)
    this.products = [
      ...this.products.slice(0, index),
      product,
      ...this.products.slice(index + 1, this.shippers.length),
    ]
  }

  @Mutation
  deleteProduct(id: number) {
    this.products = this.products.filter((d) => d.id !== id)
  }

  // Departments

  @Action({ rawError: true })
  async fetchDepartments() {
    try {
      this.setLoading(true)
      const departments = await $axios.$get('/database/department')
      this.setDepartments(departments)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addDepartment(data: Departments) {
    try {
      this.setLoading(true)
      const department = await $axios.$post('/database/department', data)

      this.setDepartment(department)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async removeDepartment(id: number) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/database/department/${id}`)

      this.deleteDepartment(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  // Shippers

  @Action({ rawError: true })
  async fetchShippers() {
    try {
      this.setLoading(true)
      const shippers = await $axios.$get('/database/shipper')
      this.setShippers(shippers)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addShipper(data: Shippers) {
    try {
      this.setLoading(true)
      const shipper = await $axios.$post('/database/shipper', data)

      this.setShipper(shipper)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async removeShipper(id: number) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/database/shipper/${id}`)

      this.deleteShipper(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  // Clients

  @Action({ rawError: true })
  async fetchClients() {
    try {
      this.setLoading(true)
      const clients = await $axios.$get('/database/client')
      this.setClients(clients)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addClient(data: Clients) {
    try {
      this.setLoading(true)
      const client = await $axios.$post('/database/client', data)

      this.setClient(client)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateClient({ data, id }: { data: Clients; id: number }) {
    try {
      this.setLoading(true)
      const client = await $axios.$put(`/database/client/${id}`, data)

      this.editClient(client)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async removeClient(id: number) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/database/client/${id}`)

      this.deleteClient(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  // Product Actions
  @Action({ rawError: true })
  async fetchProducts() {
    try {
      this.setLoading(true)
      const products = await $axios.$get('/database/product')
      this.setProducts(products)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addProduct(data: ProductI) {
    try {
      this.setLoading(true)
      const product = await $axios.$post('/database/product', data)

      this.setProduct(product)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateProduct({ data, id }: { data: ProductI; id: number }) {
    try {
      this.setLoading(true)
      const product = await $axios.$put(`/database/product/${id}`, data)

      this.editProduct(product)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async removeProduct(id: number) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/database/product/${id}`)

      this.deleteProduct(id)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Data
