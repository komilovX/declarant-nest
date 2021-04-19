import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Clients, DocumentTypesI, Shippers } from '@/utils/types'
import { $axios } from '~/utils/api'
import { errorStore } from '~/utils/store-accessor'

interface ContractNumbers {
  id: number
  number: string
}

export interface ContractI {
  id?: number
  client?: Clients
  shipper?: Shippers
  documentNumber?: ContractNumbers[]
  documentType: DocumentTypesI
  documentTypeId: number
}

@Module({
  namespaced: true,
  name: 'contracts',
  stateFactory: true,
})
class Contracts extends VuexModule {
  loading: boolean = false
  contracts: ContractI[] = []

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }

  @Mutation
  setContracts(contracts: ContractI[]) {
    this.contracts = contracts
  }

  @Mutation
  setContract(contract: ContractI) {
    this.contracts = this.contracts.concat([contract])
  }

  @Action({ rawError: true })
  async fetchContracts() {
    try {
      this.setLoading(true)
      const contracts = await $axios.$get('/contract')
      this.setContracts(contracts)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async fetchContractsForOrder({
    clientId,
    shipperId,
  }: {
    clientId: number
    shipperId: number
  }) {
    try {
      return await $axios.$get(
        `/contract/orders?clientId=${clientId}&shipperId=${shipperId}`
      )
    } catch (error) {
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addContract(data: any) {
    try {
      this.setLoading(true)
      const contract = await $axios.$post('/contract', data)

      this.setContract(contract)
      this.setLoading(false)
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addContractNumber({ id, number }: { id: number; number: string }) {
    try {
      this.setLoading(true)
      const contract = await $axios.$put(`/contract/number/${id}`, { number })
      this.setLoading(false)
      return contract
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async deleteContractNumber(id: number) {
    try {
      this.setLoading(true)
      const number = await $axios.$delete(`/contract/number/${id}`)
      this.setLoading(false)
      return number
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async addContractFile({ id, file }: { id: number; file: File }) {
    try {
      this.setLoading(true)
      const fd = new FormData()
      fd.append('file', file, file.name)
      const result = await $axios.$put(`/contract/file/${id}`, fd)
      this.setLoading(false)
      return result
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }

  @Action({ rawError: true })
  async deleteContractFile(id: number) {
    try {
      this.setLoading(true)
      const result = await $axios.$delete(`/contract/file/${id}`)
      this.setLoading(false)
      return result
    } catch (error) {
      this.setLoading(false)
      errorStore.setError(error)
      throw error
    }
  }
}

export default Contracts
