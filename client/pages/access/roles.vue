<template>
  <div>
    <div class="flex items-center">
      <h2 class="mr-2 text-lg font-medium">Роли</h2>
      <app-add-button
        v-role:create="'access-roles'"
        size="small"
        @on-click="openDialog"
      />
    </div>
    <hr class="my-2" />
    <div>
      <el-table :data="rolesStore.roles" class="w-100 rounded mt-6">
        <el-table-column
          min-width="180"
          align="center"
          label="Роль"
          width="220"
        >
          <template slot-scope="{ row }">
            {{ row.role }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="200"
          align="center"
          label="Название"
          width="220"
        >
          <template slot-scope="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column min-width="160" align="header-center" label="Описание">
          <template slot-scope="{ row }">
            {{ row.description }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{ row: { id }, $index }">
            <div class="flex items-center">
              <i
                v-role:update="'access-roles'"
                class="el-icon-edit text-blue-500 text-lg mr-4 cursor-pointer"
                @click="editRole($index)"
              />
              <i
                v-role:delete="'access-roles'"
                class="el-icon-delete text-red-600 text-lg cursor-pointer"
                @click="removeRole(id)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <role-dialog
        :role="role"
        :type="dialogType"
        :visible="dialogVisible"
        @closeDialog="dialogVisible = false"
      />
    </div>
  </div>
</template>

<script>
import accessForm from '@/mixins/accessForm'
import { authStore, rolesStore } from '~/store'
import RoleDialog from '~/components/DialogComponents/RoleDialog.vue'
export default {
  components: { RoleDialog },
  mixins: [accessForm],
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'access-roles')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data: () => ({
    rolesStore,
    usersList: [],
    search: '',
    dialogVisible: false,
    dialogType: 'create',
    role: {},
  }),
  async fetch() {
    try {
      await rolesStore.fetchRoles()
    } catch (error) {}
  },
  methods: {
    removeRole(id) {
      const text = 'Уверены, что хотите удалить этот роль?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.rolesStore.deleteRole(id)
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    editRole(index) {
      this.role = this.rolesStore.roles[index]
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    openDialog() {
      this.dialogVisible = true
      this.dialogType = 'create'
    },
  },
}
</script>
