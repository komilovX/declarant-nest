<template>
  <div>
    <el-table :data="decoratedDocuments" size="mini" border>
      <el-table-column min-width="70" label="№" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType.number }}
        </template>
      </el-table-column>
      <el-table-column min-width="80" label="Наименование" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType.name }}
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="Файл" align="center">
        <template
          slot-scope="{ row: { files }, row }"
          class="flex justify-center"
        >
          <span v-if="!files">-</span>
          <div v-else>
            <div
              v-for="(file, idx) in files"
              :key="idx"
              class="flex justify-center"
            >
              <a
                v-href="file"
                target="_blank"
                class="flex justify-center max-h-12"
              >
                <img v-image="file" />&nbsp;
              </a>
              <el-button
                type="text"
                icon="el-icon-close"
                style="color: red"
                class="p-0"
                @click="deleteFile(row, file)"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="80" label="Удалить" align="center">
        <template slot-scope="{ row: { id, creator } }">
          <el-button
            v-if="creator.id == authStore.user.id"
            :loading="documentsStore.loading"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            class="px-1.5 py-1"
            @click="$emit('delete-document', id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="decoratedForm" :model="decoratedForm" :rules="rules">
      <el-row :gutter="15" class="flex justify-center px-2 py-3">
        <el-col :span="24" :md="6" :sm="6" :xs="12">
          <el-form-item prop="id">
            <el-select
              v-model="decoratedForm.id"
              size="mini"
              filterable
              class="width90"
              placeholder="Номер"
              @change="(val) => onSelectChange(val, 'decoratedForm')"
            >
              <el-option
                v-for="c in documents"
                :key="c.id"
                :label="c.number"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="8" :sm="8" :xs="12">
          <el-form-item prop="number">
            <el-input
              v-model="decoratedForm.name"
              placeholder="Наименование"
              size="mini"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="4">
          <el-form-item>
            <el-upload
              ref="decoratedUpload"
              action="https://localhost:3000"
              :auto-upload="false"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button size="mini" plain type="primary"
                >Загрузить файл</el-button
              >
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="5">
          <el-form-item id="submit-button">
            <app-add-button
              :loading="loading"
              @on-click="submitForm('decoratedForm')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { clearForm } from '@/utils/order.util'
import AppAddButton from '../AppComponents/AppAddButton.vue'
import { authStore, documentsStore, documentTypeStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'

export default {
  components: { AppAddButton },
  props: {
    decoratedDocuments: {
      type: Array,
      default: () => [],
    },
    order_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      authStore,
      documentsStore,
      loading: false,
      fileList: [],
      decoratedForm: {
        id: '',
        name: '',
      },
      rules: {
        id: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    documents() {
      const ids = this.decoratedDocuments.map((d) => d.documentType.number)
      return documentTypeStore.documentTypes
        .filter((doc) => doc.types.includes(DocumenTypes.DECORATED))
        .filter((d) => !ids.includes(d.number))
    },
  },
  methods: {
    handleFileChange(file) {
      const type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        this.$message.error('Файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.fileList.push(file)
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    onSelectChange(val, formName) {
      const document = this.documents.find((d) => d.id == val)
      if (document) {
        this[formName].name = document.name
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.fileList.length) {
          try {
            const { id } = this[formName]
            const fd = new FormData()
            fd.append('documentTypeId', id)
            fd.append('orderId', this.order_id)
            fd.append('type', DocumenTypes.DECORATED)
            this.fileList.forEach((file) =>
              fd.append('files', file.raw, file.name)
            )
            const document = await documentsStore.createDocument(fd)
            this.$emit('decoratedDocumentAdded', document)
            this.$message.success('Документ успешно добовлен')
            this.$refs.decoratedUpload.clearFiles()
            clearForm.bind(this)(formName)
            this.fileList = []
          } catch (error) {
            console.log(error)
          }
        } else {
          if (!this.fileList.length) {
            this.$message.error('No File')
          }
          return false
        }
      })
    },
    async deleteFile(row, file) {
      try {
        await documentsStore.deleteDocumentFile({ id: row.id, file })
        row.files = row.files.filter((f) => f !== file)
        this.$message.success('Файл успешна удалена')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 5px;
}
</style>
