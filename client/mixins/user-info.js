export default {
  computed: {
    isDeclarant() {
      return this.user.role === 'declarant'
    },
    isManager() {
      return this.user.role === 'manager'
    },
    isAdmin() {
      return this.user.role === 'admin'
    },
  },
}
