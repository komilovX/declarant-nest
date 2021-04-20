<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <h2 class="mr-2 text-lg font-medium">Документы</h2>
        <app-add-button
          v-role:create="'data-documents'"
          size="small"
          @on-click="dialogVisible = true"
        />
      </div>
      <el-input
        v-model="search"
        placeholder="Быстрый поиск"
        prefix-icon="el-icon-search"
        size="medium"
        class="w-1/3 mb-2"
      />
    </div>
    <hr class="my-2" />
    <div>
      <el-table
        :data="
          documentTypeStore.documentTypes.filter(
            (a) =>
              !search ||
              a.name.toLowerCase().includes(search.toLowerCase()) ||
              a.number.toLowerCase().includes(search.toLowerCase())
          )
        "
        size="small"
        border
      >
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
              v-role:update="'data-documents'"
              type="primary"
              plain
              size="mini"
              icon="el-icon-edit"
              class="px-1.5 py-1"
              :disabled="dataStore.loading"
              @click="editDocument($index)"
            />
            <el-button
              v-role:delete="'data-documents'"
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
import DocumentDialog from '~/components/DialogComponents/DocumentDialog.vue'
import { authStore, dataStore, documentTypeStore } from '~/store'
import { documentTypes } from '~/utils/data'

export default {
  components: { DocumentDialog },
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'data-documents')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data: () => ({
    search: '',
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
