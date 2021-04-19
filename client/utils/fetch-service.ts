import { dataStore, documentTypeStore, userStore } from '~/store'

export const fetchOrderFilters = async () => {
  try {
    if (!userStore.users.length) {
      await userStore.fetchUsers()
    }
    if (!dataStore.shippers.length) {
      await dataStore.fetchShippers()
    }
    if (!dataStore.clients.length) {
      await dataStore.fetchClients()
    }
    if (!dataStore.products.length) {
      await dataStore.fetchProducts()
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchTaskFilters = async () => {
  try {
    if (!userStore.users.length) {
      await userStore.fetchUsers()
    }
    if (!dataStore.shippers.length) {
      await dataStore.fetchShippers()
    }
    if (!dataStore.clients.length) {
      await dataStore.fetchClients()
    }
    if (!dataStore.products.length) {
      await dataStore.fetchProducts()
    }
    if (!documentTypeStore.documentTypes.length) {
      await documentTypeStore.fetchDocumentTypes()
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
