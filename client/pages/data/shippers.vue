<template>
  <div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="16" :sm="24">
        <div class="mb-2 flex items-center">
          <app-input
            :value="name"
            class="mr-2 w-1 md:w-1/2"
            @on-change="name = $event"
          />
          <app-add-button @on-click="addShipper" />
        </div>
        <el-table :data="dataStore.shippers" size="small" border>
          <el-table-column
            min-width="70"
            label="№"
            type="index"
            align="center"
          />
          <el-table-column
            width="450"
            label="Наименование"
            show-overflow-tooltip
            align="center"
            prop="name"
          />
          <el-table-column label="Удалить" align="center">
            <template slot-scope="{ row: { id } }">
              <el-button
                type="danger"
                plain
                size="mini"
                icon="el-icon-delete"
                class="px-1.5 py-1"
                @click="deleteShipper(id)"
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
import { dataStore } from '~/store'

export default {
  components: { AppInput, AppAddButton },
  data() {
    return {
      dataStore,
      name: '',
    }
  },
  async fetch() {
    try {
      await dataStore.fetchShippers()
    } catch (error) {}
  },
  methods: {
    async addShipper() {
      if (this.name) {
        this.loading = true
        try {
          await this.dataStore.addShipper({ name: this.name })
          this.name = ''
          this.$message.success('Грузоотправитель успешно добавлен')
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      }
    },
    deleteShipper(id) {
      const text = 'Уверены, что хотите удалить этот грузоотправитель?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.dataStore.removeShipper(id)
            this.$message.success('Грузоотправитель удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
  },
}
</script>
