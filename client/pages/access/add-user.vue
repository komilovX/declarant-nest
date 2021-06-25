<template>
  <div id="scrollinElement">
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-lg font-medium">Добавление пользователя</h2>
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
            <el-form-item label="ФИО" prop="name">
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
            <el-form-item label="Пароль" prop="password">
              <el-input
                v-model="employerForm.password"
                size="small"
                type="password"
              />
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
            <el-form-item id="submit-button">
              <el-button
                type="success"
                :loading="userStore.loading"
                size="small"
                @click="submitForm('employerForm')"
              >
                Сохранить
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import accessForm from '@/mixins/accessForm'
import { userStore, rolesStore } from '~/store'

export default {
  mixins: [accessForm],
  data() {
    return {
      userStore,
      rolesStore,
    }
  },
  async fetch() {
    try {
      if (!rolesStore.roles.length) {
        await rolesStore.fetchRoles()
      }
    } catch (error) {}
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.employerForm.name,
            login: this.employerForm.login,
            password: this.employerForm.password,
            role: this.employerForm.role,
            username: this.employerForm.username,
          }
          try {
            await this.userStore.addUser(formData)
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
  },
}
</script>
