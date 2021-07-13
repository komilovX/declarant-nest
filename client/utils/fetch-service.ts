import { dataStore, documentTypeStore, userStore } from '~/store'

export const fetchOrderFilters = async () => {
  try {
    if (!userStore.isRequested) {
      await userStore.fetchUsers()
      userStore.setRequested(true)
    }
    if (!dataStore.isRequested) {
      await dataStore.fetchShippers()
      await dataStore.fetchClients()
      await dataStore.fetchProducts()
      dataStore.setRequested(true)
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const fetchTaskFilters = async () => {
  try {
    if (!userStore.isRequested) {
      await userStore.fetchUsers()
      userStore.setRequested(true)
    }
    if (!dataStore.shippers.length) {
      await dataStore.fetchShippers()
      await dataStore.fetchClients()
      await dataStore.fetchProducts()
    }
    if (!documentTypeStore.isRequested) {
      await documentTypeStore.fetchDocumentTypes()
      documentTypeStore.setRequested(true)
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
