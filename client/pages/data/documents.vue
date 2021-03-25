<template>
  <div>
    <app-header header-text="Документы" @on-click="dialogVisible = true" />
    <div>
      <el-table :data="documentTypeStore.documentTypes" size="small" border>
        <el-table-column width="90" label="№" prop="number" align="center" />
        <el-table-column
          width="150"
          label="Наименование"
          show-overflow-tooltip
          align="center"
          prop="name"
        />
        <el-table-column
          width="200"
          label="Инфо"
          show-overflow-tooltip
          align="center"
          prop="info"
        />
        <el-table-column width="250" label="Тип" align="center">
          <template slot-scope="{ row: { types } }">
            <el-tag v-for="i in types" :key="i" class="m-0.5" size="small">{{
              documentTypes[i]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="250" label="Отдель" align="center">
          <template slot-scope="{ row: { departments } }">
            <el-tag
              v-for="i in departments"
              :key="i.id"
              type="success"
              class="mr-2"
              size="small"
              >{{ i.name }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Действия" align="center">
          <template slot-scope="{ row: { id }, $index }" class="flex">
            <el-button
              type="primary"
              plain
              size="mini"
              icon="el-icon-edit"
              class="px-1.5 py-1"
              :disabled="dataStore.loading"
              @click="editDocument($index)"
            />
            <el-button
              type="danger"
              plain
              size="mini"
              icon="el-icon-delete"
              class="px-1.5 py-1"
              :disabled="dataStore.loading"
              @click="removeDocument(id)"
            />
          </template>
        </el-table-column>
      </el-table>
      <document-dialog
        :document="document"
        :type="dialogType"
        :departments="dataStore.departments"
        :visible="dialogVisible"
        @close="closeDialog"
      />
    </div>
  </div>
</template>

<script>
import AppHeader from '../../components/AppComponents/AppHeader.vue'
import DocumentDialog from '~/components/DialogComponents/DocumentDialog.vue'
import { dataStore, documentTypeStore } from '~/store'
import { documentTypes } from '~/utils/data'

export default {
  components: { AppHeader, DocumentDialog },
  middleware: ['admin-auth'],
  data: () => ({
    dataStore,
    documentTypeStore,
    documentTypes,
    dialogVisible: false,
    dialogType: 'create',
    document: {},
  }),
  async fetch() {
    try {
      await dataStore.fetchDepartments()
      await documentTypeStore.fetchDocumentTypes()
    } catch (error) {}
  },
  methods: {
    removeDocument(id) {
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
    editDocument(index) {
      this.document = this.documentTypeStore.documentTypes[index]
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.dialogType = 'create'
    },
  },
}
</script>
