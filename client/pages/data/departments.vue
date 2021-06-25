<template>
  <div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="16" :sm="24">
        <div v-role:create="'data-departments'" class="mb-2 flex items-center">
          <app-input
            :value="name"
            class="mr-2 w-1 md:w-1/2"
            @on-change="name = $event"
          />
          <app-add-button
            :loading="dataStore.loading"
            @on-click="addDepartment"
          />
        </div>
        <el-table :data="dataStore.departments" size="small" border>
          <el-table-column width="80" label="№" type="index" align="center" />
          <el-table-column
            width="480"
            label="Наименование"
            align="center"
            prop="name"
          />
          <el-table-column width="145" label="Удалить" align="center">
            <template slot-scope="{ row: { id } }">
              <el-button
                v-role:update="'data-departments'"
                type="danger"
                plain
                size="mini"
                icon="el-icon-delete"
                class="px-1.5 py-1"
                :disabled="dataStore.loading"
                @click="deleteDepartment(id)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'
import AppInput from '~/components/AppComponents/AppInput.vue'
import { authStore, dataStore } from '~/store'
export default {
  components: { AppInput, AppAddButton },
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'data-departments')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data() {
    return {
      dataStore,
      name: '',
    }
  },
  async fetch() {
    await dataStore.fetchDepartments()
    console.log('dataStore', dataStore.departments)
  },
  methods: {
    async addDepartment() {
      if (this.name) {
        try {
          await this.dataStore.addDepartment({
            name: this.name,
          })
          this.name = ''
          this.$message.success('Отдель успешно добавлен')
        } catch (e) {
          console.log(e)
        }
      }
    },
    async deleteDepartment(id) {
      try {
        await this.dataStore.removeDepartment(id)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
