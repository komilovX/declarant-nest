<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <h2 class="mr-2 text-lg font-medium">Пользователи</h2>
        <app-add-button
          v-role:create="'access-users'"
          @on-click="$router.push('/access/add-user')"
        />
      </div>
      <div>
        <el-input
          v-model="search"
          placeholder="Быстрый поиск"
          prefix-icon="el-icon-search"
          size="small"
          class="md:w-72 w-1/3"
        />
      </div>
    </div>
    <hr class="my-2" />
    <div>
      <el-table
        v-loading="userStore.loading"
        :data="
          userStore.users.filter(
            (a) =>
              !search || a.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        tooltip-effect="light"
        size="mini"
        class="w-100 rounded border-black"
      >
        <el-table-column
          label="Имя"
          width="250"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          width="200"
          prop="login"
          label="Логин"
          show-overflow-tooltip
        />
        <el-table-column
          :filters="
            rolesStore.roles.map((r) => ({ text: r.name, value: r.role }))
          "
          :filter-method="filterRole"
          filter-placement="bottom-end"
          show-overflow-tooltip
          max-width="300"
          min-width="200"
          label="Должность"
        >
          <template slot-scope="{ row: { role } }">
            <p class="text-blue-500">{{ role.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          min-width="200"
          label="Отдел"
          align="center"
        >
          <template slot-scope="{ row: { departments } }">
            <div>
              <span
                v-for="d of departments"
                :key="d.id"
                class="text-green-500 mr-2"
                >{{ d.name }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{ row: { id } }">
            <div class="flex items-center">
              <i
                v-role:update="'access-users'"
                class="el-icon-edit text-blue-500 text-lg mr-4 cursor-pointer"
                @click="$router.push(`/access/edit-user/${id}`)"
              />
              <i
                v-role:delete="'access-users'"
                class="el-icon-delete text-red-600 text-lg cursor-pointer"
                @click="removeUser(id)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import accessForm from '@/mixins/accessForm'
import { userStore, rolesStore, authStore } from '~/store'
export default {
  mixins: [accessForm],
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'access-users')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data: () => ({
    userStore,
    rolesStore,
    usersList: [],
    search: '',
  }),
  async fetch() {
    try {
      await userStore.fetchUsers()
      if (!rolesStore.roles.length) {
        await rolesStore.fetchRoles()
      }
    } catch (error) {}
  },
  methods: {
    removeUser(id) {
      const text = 'Уверены, что хотите удалить этого cотрудника?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await userStore.deleteUser(id)
            this.adminList = this.adminList.filter((t) => t.id != id)
            this.$message.success('Поставщик удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    filterRole(value, row) {
      return row.role === value
    },
  },
}
</script>
