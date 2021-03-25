<template>
  <div>
    <Nuxt />
  </div>
</template>
<script>
import { errorStore } from '~/store'

export default {
  data() {
    return {
      errorStore,
    }
  },
  computed: {
    error() {
      return this.errorStore.error
    },
  },
  watch: {
    error(error) {
      if (typeof error === 'object') {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (Array.isArray(error.response.data.message)) {
            this.$message.error(error.response.data.message[0])
          } else {
            this.$message.error(error.response.data.message)
          }
        } else {
          this.$message.error('Что-то пошло не так')
        }
      } else {
        this.$message.error(error)
      }
    },
  },
}
</script>
