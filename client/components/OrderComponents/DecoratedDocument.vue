<template>
  <div>
    <el-table :data="decoratedDocuments" size="mini" border>
      <el-table-column
        v-if="postNumber"
        label="Справочный номер"
        align="center"
        style="font-size: 10px"
      >
        <template slot-scope="{ row: { postDate, referenceNumber } }">
          {{ postNumber }}/{{ postDate | dateFormatter
          }}{{ referenceNumber && `/${referenceNumber}` }}
        </template>
      </el-table-column>
      <el-table-column min-width="70" label="Документ" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType.name }}
        </template>
      </el-table-column>
      <el-table-column min-width="70" label="Файл" align="center">
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
    <div class="px-2 py-1">
      <el-button type="text" @click="visible = true">Добавить</el-button>
    </div>
    <el-dialog
      custom-class="w-11/12 md:w-3/5"
      title="Добавление документ"
      :visible.sync="visible"
      :before-close="() => (visible = false)"
    >
      <el-row :gutter="15">
        <el-form ref="decoratedForm" :model="decoratedForm" :rules="rules">
          <el-col :span="24" :md="6" :sm="6" :xs="12">
            <el-form-item prop="id">
              <el-select
                v-model="decoratedForm.id"
                size="mini"
                filterable
                class="width90"
                placeholder="Документ"
              >
                <el-option
                  v-for="c in documents"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="6" :sm="12">
            <el-form-item prop="postDate">
              <el-date-picker
                v-model="decoratedForm.postDate"
                size="small"
                style="max-width: 100%"
                placeholder="Пост дата"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="6" :sm="24">
            <el-form-item prop="order">
              <el-input
                v-model="decoratedForm.referenceNumber"
                placeholder="Справочный номер"
                size="small"
                type="text"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="6" :sm="4">
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
          <el-col>
            <el-form-item id="submit-button">
              <app-add-button
                :loading="loading"
                @on-click="submitForm('decoratedForm')"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
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
    postNumber: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      authStore,
      documentsStore,
      loading: false,
      fileList: [],
      visible: false,
      decoratedForm: {
        id: '',
        name: '',
        postDate: '',
        referenceNumber: '',
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
        this.$refs.decoratedUpload.clearFiles()
        return
      }
      this.fileList.push(file)
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.fileList.length) {
          try {
            const { id, postDate, referenceNumber } = this[formName]

            const fd = new FormData()
            fd.append('documentTypeId', id)
            fd.append('orderId', this.order_id)
            postDate && fd.append('postDate', postDate)
            referenceNumber && fd.append('referenceNumber', referenceNumber)
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
