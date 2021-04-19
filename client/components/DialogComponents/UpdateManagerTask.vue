<template>
  <el-dialog
    title="Изменить"
    :before-close="onClose"
    :visible.sync="visible"
    custom-class="w-24 md:w-3/4"
  >
    <el-form
      ref="taskForm"
      :model="taskForm"
      class="mt1"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="15">
        <el-col :span="24" :md="8" :sm="18">
          <el-form-item class="flex justify-end">
            <div class="flex">
              <div v-if="document.files" class="flex">
                <div
                  v-for="(file, idx) in document.files"
                  :key="idx"
                  class="flex items-center mr-4"
                >
                  <a
                    v-href="file"
                    target="_blank"
                    class="flex items-center justify-center"
                  >
                    <img v-image="file" />&nbsp;
                  </a>
                  <el-button
                    type="text"
                    icon="el-icon-close"
                    style="color: red"
                    class="p-0"
                    @click="deleteDocumentFile(file)"
                  />
                </div>
              </div>
              <el-upload
                ref="fileUpload"
                :file-list="fileList"
                action="https://localhost:3000"
                :auto-upload="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
              >
                <el-button size="mini" type="primary" plain>
                  Добавить файл
                </el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="24">
          <el-form-item prop="price">
            <div
              v-for="(p, ind) in taskForm.price"
              :key="ind"
              class="flex items-center"
            >
              <el-input
                v-model="taskForm.price[ind].price"
                placeholder="Цена"
                type="text"
                class="mr-1"
                size="small"
              />
              <el-select
                v-model="taskForm.price[ind].currency"
                size="small"
                class="mr-2"
                placeholder="Валюта"
              >
                <el-option
                  v-for="s in currencyList"
                  :key="s.value"
                  :label="s.type"
                  :value="s.value"
                />
              </el-select>
              <i
                v-if="ind === 0"
                class="el-icon-circle-plus fs-icon text-lg cursor-pointer text-blue-500"
                @click="taskForm.price.push({ price: null, currency: null })"
              />
              <i
                v-else
                class="el-icon-close fs-icon text-lg cursor-pointer text-gray-500"
                @click="taskForm.price.splice(ind, 1)"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="24">
          <el-form-item prop="comment">
            <el-input
              v-model="taskForm.comment"
              placeholder="Примечание"
              type="text"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="18" class="mb1">
          <el-form-item id="submit-button">
            <app-save-button
              :loading="documentsStore.loading"
              @on-click="updateTask('taskForm')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import AppSaveButton from '../AppComponents/AppSaveButton.vue'
import { userStore, documentsStore } from '~/store'
import { currencyList } from '~/utils/data'

export default {
  components: { AppSaveButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    document: {
      type: Object,
      required: true,
    },
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const validatePass = (_rule, values, callback) => {
      values.forEach((v) => {
        if (!v.price) {
          callback(new Error('Пожалуйста заполните это поле'))
        }
      })
      callback()
    }
    return {
      userStore,
      documentsStore,
      currencyList,
      fileList: [],
      taskForm: {
        price: [],
        comment: null,
      },
      rules: {
        price: [
          {
            validator: validatePass,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  watch: {
    document() {
      this.updateForm()
    },
  },
  mounted() {
    this.updateForm()
  },
  methods: {
    updateForm() {
      if (Object.keys(this.document).length) {
        this.taskForm.comment = this.document?.comment
        this.taskForm.price = this.document?.price.length
          ? this.document.price
          : [{ price: null, currency: null }]
      }
    },
    updateTask() {
      this.$refs.taskForm.validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              ...this.taskForm,
              orderId: this.orderId,
            }
            const document = await documentsStore.updateDocument({
              id: this.document.id,
              data,
            })
            this.$emit('documentUpdated', document)
            this.$message.success('Документ успешно обновлен')
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }
      })
    },
    async handleFileChange(file) {
      const type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf|csv|xls|xlsx/)
      if (idx == -1) {
        this.$message.error(
          'файлы толка с расширением png|jpeg|docx|doc|pdf|xls|xlsx '
        )
        this.fileList = []
        return
      }
      try {
        const fd = new FormData()
        fd.append('file', file.raw, file.name)
        const newFile = await this.documentsStore.addDocumentFile({
          id: this.document.id,
          fd,
        })
        this.$message.success('Файл успешна добавлена')
        this.$refs.fileUpload.clearFiles()
        this.$emit('fileAdded', newFile)
        return
      } catch (error) {
        console.log(error)
      }
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    async deleteDocumentFile(file) {
      try {
        await documentsStore.deleteDocumentFile({ id: this.document.id, file })
        this.$message.success('Файл успешна удалена')
        this.$emit('fileRemoved', file)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
