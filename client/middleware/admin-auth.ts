import { Middleware } from '@nuxt/types'
import { authStore } from '~/store'

const myMiddleware: Middleware = ({ redirect }) => {
  if (!authStore.user) {
    redirect('/login?message=login')
  }
}

export default myMiddleware
