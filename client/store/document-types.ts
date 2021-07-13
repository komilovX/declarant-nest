import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'
import { DocumentTypesI } from '~/utils/types'

@Module({
  namespaced: true,
  name: 'document-types',
  stateFactory: true,
})
class DocumentType extends VuexModule {
  loading: boolean = false
  isRequested: boolean = false
  documentTypes: DocumentTypesI[] = []

  @Mutation
  setRequested(requested: boolean) {
    this.isRequested = requested
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setDocumentTypes(documentTypes: DocumentTypesI[]) {
    this.documentTypes = documentTypes
  }

  @Mutation
  setDocumentType(documentType: DocumentTypesI) {
    this.documentTypes = [...this.documentTypes, documentType]
  }

  @Mutation
  editDocumentType(documentType: DocumentTypesI) {
    const index = this.documentTypes.findIndex((r) => r.id === documentType.id)
    this.documentTypes = [
      ...this.documentTypes.slice(0, index),
      documentType,
      ...this.documentTypes.slice(index + 1, this.documentTypes.length),
    ]
  }

  @Action({ rawError: true })
  async fetchDocumentTypes() {
    try {
      this.setLoading(true)
      const documentTypes = await $axios.$get('/document-type')
      this.setDocumentTypes(documentTypes)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async fetchDocumentTypesWithType(type: string) {
    try {
      this.setLoading(true)
      const documentTypes = await $axios.$get(`/document-type?type=${type}`)
      this.setDocumentTypes(documentTypes)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addDocumentType(data: DocumentTypesI) {
    try {
      this.setLoading(true)
      const documentType = await $axios.$post('/document-type', data)

      this.setDocumentType(documentType)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async updateDocumentType({ data, id }: { data: DocumentTypesI; id: number }) {
    try {
      this.setLoading(true)
      const documentType = await $axios.$put(`/document-type/${id}`, data)

      this.editDocumentType(documentType)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default DocumentType
