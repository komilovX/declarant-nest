import { mapRulesByValue } from '@/utils/form-rules.js'
export default {
  middleware: ['admin-auth'],
  data() {
    return {
      changePassword: false,
      loading: false,
      roles: [
        { role: 'admin', label: 'Администратор', type: 'danger' },
        { role: 'declarant', label: 'Декларант', type: 'primary' },
        { role: 'manager', label: 'Вед Менеджер', type: 'info' },
      ],
      employerForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: '',
        username: '',
      },
      rules: mapRulesByValue(['name', 'login', 'username', 'password', 'role']),
    }
  },
}
