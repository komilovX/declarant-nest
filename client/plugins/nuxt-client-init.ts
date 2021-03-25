import { authStore } from '~/store'
export default async () => {
  await authStore.clientInit()
}
