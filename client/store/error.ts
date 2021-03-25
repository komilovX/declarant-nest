import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  namespaced: true,
  name: 'error',
  stateFactory: true,
})
class Error extends VuexModule {
  error: any = null

  @Mutation
  setError(error: any) {
    this.error = error
  }

  @Mutation
  clearError() {
    this.error = null
  }
}

export default Error
