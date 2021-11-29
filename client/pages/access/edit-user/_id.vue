<template>
  <div id="scrollinElement">
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-lg font-medium">Редактирование пользователя</h2>
    </div>
    <div>
      <el-row>
        <el-col :xs="24" :sm="12">
          <el-form
            ref="employerForm"
            :model="employerForm"
            status-icon
            :rules="rules"
            label-width="150px"
            label-position="left"
            class="demo-ruleForm"
          >
            <el-form-item label="Имя" prop="name">
              <el-input v-model="employerForm.name" size="small" type="text" />
            </el-form-item>
            <el-form-item label="Имя пользователя" prop="username">
              <el-input
                v-model="employerForm.username"
                size="small"
                type="text"
              />
            </el-form-item>
            <el-form-item label="Логин" prop="login">
              <el-input v-model="employerForm.login" size="small" type="text" />
            </el-form-item>
            <el-form-item label="Отдель" prop="departments">
              <el-select
                v-model="employerForm.departments"
                multiple
                placeholder="Отдель"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="item in dataStore.departments"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Роль" prop="role" class="mb2">
              <el-select v-model="employerForm.role" size="small">
                <el-option
                  v-for="s in rolesStore.roles"
                  :key="s.role"
                  :label="s.name"
                  :value="s.role"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
              <el-input
                v-model="employerForm.password"
                size="small"
                type="password"
              />
            </el-form-item>
            <el-form-item id="submit-button">
              <el-button
                type="success"
                :loading="userStore.loading"
                size="small"
                @click="submitForm('employerForm')"
              >
                Обновить
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { dataStore, rolesStore, userStore } from '~/store'
import { mapRulesByValue } from '~/utils/form-rules'
export default {
  middleware: ['admin-auth'],
  data() {
    return {
      rolesStore,
      userStore,
      dataStore,
      employerForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: '',
        username: '',
      },
      rules: mapRulesByValue(['name', 'login', 'username', 'role']),
    }
  },
  async fetch() {
    try {
      if (!rolesStore.roles.length) {
        await rolesStore.fetchRoles()
      }
      await dataStore.fetchDepartments()
      await userStore.findUserById(+this.$route.params.id)
      this.setUser()
    } catch (error) {}
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.employerForm.name,
            login: this.employerForm.login,
            role: this.employerForm.role,
            username: this.employerForm.username,
            departments: this.employerForm.departments,
          }
          if (this.employerForm.password) {
            formData.password = this.employerForm.password
          }
          try {
            await this.userStore.editUser({ id: userStore.user.id, formData })
            this.$message.success('Сотрудник успешно обновлен')
            this.$router.push('/access/users')
          } catch (e) {
            console.log(e)
          }
        } else {
          return false
        }
      })
    },
    setUser() {
      if (userStore.user) {
        const { name, username, login, role, departments = [] } = userStore.user

        this.employerForm.name = name
        this.employerForm.username = username
        this.employerForm.login = login
        this.employerForm.departments = departments
        this.employerForm.role = role?.role
      }
    },
  },
}
</script>
