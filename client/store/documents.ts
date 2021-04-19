import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'

@Module({
  namespaced: true,
  name: 'documents',
  stateFactory: true,
})
class Documents extends VuexModule {
  loading: boolean = false

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Action({ rawError: true })
  async createDocument(data: any) {
    try {
      this.setLoading(true)
      const document = await $axios.$post('/documents', data)
      this.setLoading(false)
      return document
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateDocument({ id, data }: { id: number; data: any }) {
    try {
      this.setLoading(true)
      const document = await $axios.$put(`/documents/${id}`, data)
      this.setLoading(false)
      return document
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async deleteDocument(id: any) {
    try {
      this.setLoading(true)
      await $axios.$delete(`/documents/${id}`)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async deleteDocumentFile({ id, file }: { id: any; file: string }) {
    try {
      await $axios.$patch(`/documents/deleteFile/${id}`, { file })
    } catch (error) {
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addDocumentFile({ id, fd }: { id: any; fd: any }) {
    try {
      return await $axios.$patch(`/documents/file/${id}`, fd)
    } catch (error) {
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async giveTask(data: any) {
    try {
      this.setLoading(true)
      const result = await $axios.$post(`/documents/giveTask`, data)
      this.setLoading(false)
      return result
    } catch (error) {
      errorStore.setError(error)
      this.setLoading(false)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateTask({ id, data }: { id: number; data: any }) {
    try {
      this.setLoading(true)
      const result = await $axios.$put(`/documents/updateTask/${id}`, data)
      this.setLoading(false)
      return result
    } catch (error) {
      errorStore.setError(error)
      this.setLoading(false)
      throw error
    }
  }
}

export default Documents
