<template>
  <div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="22" :sm="24">
        <div class="flex items-center mb-2">
          <h4 class="mr-4">Клиенты</h4>
          <app-add-button
            v-role:create="'data-clients'"
            @on-click="dialogVisible = true"
          />
        </div>
        <el-alert
          v-if="error"
          class="mb1"
          title="Пожалуйста, заполните все поля формы"
          type="error"
          center
          show-icon
        />
        <el-table
          border
          :data="clients"
          tooltip-effect="light"
          style="width: 100%"
          size="small"
        >
          <app-table-column width="130" label="Дата">
            <template #default="{ index, row: { date, changed } }">
              <el-date-picker
                v-if="changed"
                v-model="clients[index].date"
                size="mini"
                style="width: 95%"
                type="date"
                placeholder="Дата"
              />
              <span v-else>{{ date | dateFormatter }}</span>
            </template>
          </app-table-column>
          <app-table-column label="Клиент фирма">
            <template #default="{ index, row }">
              <app-input-row
                :row="row"
                :value="clients[index].name"
                @on-change="clients[index].name = $event"
              />
            </template>
          </app-table-column>
          <app-table-column label="Инфо">
            <template #default="{ index, row }">
              <app-input-row
                :row="row"
                :value="clients[index].info"
                @on-change="clients[index].info = $event"
              />
            </template>
          </app-table-column>
          <app-table-column label="Владелец">
            <template #default="{ row: { directors, changed, id }, index }">
              <div v-if="changed">
                <div
                  v-for="(d, ind) in directors"
                  :key="ind"
                  class="flex items-center"
                >
                  <el-input
                    :value="directors[ind].name"
                    placeholder="Название"
                    class="mb-1 mr-2"
                    type="text"
                    size="mini"
                    @input="(value) => editClientDirector(id, ind, value)"
                  />
                  <i
                    v-if="ind === 0"
                    class="el-icon-circle-plus fs-icon text-lg cursor-pointer text-blue-500"
                    @click="addDirector(id, index)"
                  />
                  <i
                    v-else
                    class="el-icon-close fs-icon text-lg cursor-pointer text-gray-500"
                    @click="deleteDirector(id, ind)"
                  />
                </div>
              </div>
              <div v-else>
                <div v-for="(director, ind) in directors" :key="ind">
                  {{ director.name }}
                </div>
              </div>
            </template>
          </app-table-column>
          <app-table-column label="Действия">
            <template #default="{ row: { id, changed }, index }">
              <app-table-actions
                v-role:update="'data-clients'"
                :changed="changed"
                @on-changed="clients[index].changed = true"
                @on-cancel="clients[index].changed = false"
                @on-delete="deleteClient(id)"
                @on-save="updateClient(id, index)"
              />
            </template>
          </app-table-column>
        </el-table>
        <ClientDialog
          :visible="dialogVisible"
          :on-close="() => (dialogVisible = false)"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ClientDialog from '@/components/DialogComponents/CreateClientDialog.vue'
import AppTableActions from '~/components/AppComponents/AppTableActions.vue'
import AppTableColumn from '~/components/AppComponents/AppTableColumn.vue'
import { authStore, dataStore } from '~/store'
import AppInputRow from '~/components/AppComponents/AppInputRow.vue'
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'

export default {
  components: {
    ClientDialog,
    AppTableActions,
    AppTableColumn,
    AppInputRow,
    AppAddButton,
  },
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'data-clients')
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
      dialogVisible: false,
      error: false,
    }
  },
  async fetch() {
    try {
      await dataStore.fetchClients()
    } catch (error) {}
  },
  computed: {
    clients() {
      return dataStore.clients.map((c) => ({ ...c, changed: false }))
    },
  },
  methods: {
    async updateClient(id, index) {
      try {
        const client = this.clients[index]
        if (!client.date || !client.name) {
          this.error = true
          return
        }
        await this.dataStore.updateClient({ data: client, id })
        this.clients[index].changed = false
        this.$message.success('Oбнавлена')
      } catch (e) {
        console.log(e)
      }
    },
    deleteClient(id) {
      const text = 'Уверены, что хотите удалить этот клиент?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.dataStore.removeClient(id)
            this.$message.success('Клиент удалена')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
    addDirector(id, index) {
      dataStore.addClientDirector(id)
      this.clients[index].changed = true
    },
    deleteDirector(id, index) {
      dataStore.deleteClientDirector({ id, index })
      this.clients[index].changed = true
    },
    editClientDirector(id, index, value) {
      dataStore.editClientDirector({ id, index, value })
    },
  },
}
</script>
