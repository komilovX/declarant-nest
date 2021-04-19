/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '~/store/auth'
import Data from '~/store/data'
import Error from '~/store/error'
import Roles from '~/store/roles'
import Users from '~/store/users'
import DocumentType from '~/store/document-types'
import Contracts from '~/store/contracts'
import Orders from '~/store/orders'
import Documents from '~/store/documents'
import Notifications from '~/store/notifications'
import Statistics from '~/store/statistics'

let authStore: Auth
let dataStore: Data
let userStore: Users
let documentTypeStore: DocumentType
let documentsStore: Documents
let contractStore: Contracts
let ordersStore: Orders
let rolesStore: Roles
let notificationStore: Notifications
let statisticsStore: Statistics
let errorStore: Error

function initialiseStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  dataStore = getModule(Data, store)
  userStore = getModule(Users, store)
  documentTypeStore = getModule(DocumentType, store)
  documentsStore = getModule(Documents, store)
  contractStore = getModule(Contracts, store)
  ordersStore = getModule(Orders, store)
  rolesStore = getModule(Roles, store)
  notificationStore = getModule(Notifications, store)
  statisticsStore = getModule(Statistics, store)
  errorStore = getModule(Error, store)
}

export {
  initialiseStores,
  authStore,
  dataStore,
  userStore,
  rolesStore,
  contractStore,
  ordersStore,
  errorStore,
  documentTypeStore,
  documentsStore,
  notificationStore,
  statisticsStore,
}
