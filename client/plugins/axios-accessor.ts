import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const accessor: Plugin = ({ $axios, redirect }) => {
  $axios.onError((error: any) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      redirect('/login?message=session')
    }
  })
  initializeAxios($axios)
}

export default accessor
