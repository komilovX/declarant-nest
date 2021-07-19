<template>
  <el-dialog
    title="Изменить"
    :before-close="onClose"
    :visible.sync="visible"
    class="w-24 md:w-auto"
  >
    <el-form
      ref="declarantForm"
      :model="declarantForm"
      class="mt1"
      :rules="rules"
    >
      <el-row :gutter="15">
        <el-col :span="24" :md="4" :sm="18">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="declarantForm.documentTypeId"
              size="small"
              filterable
              class="width90"
              placeholder="№"
              @change="setDocumentType"
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
        <el-col :span="24" :md="5" :sm="24">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="declarantForm.documentTypeId"
              size="small"
              filterable
              class="width90"
              placeholder="Название"
              @change="setDocumentType"
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
        <el-col :span="24" :md="7" :sm="24">
          <el-form-item prop="declarantId">
            <el-select
              v-model="declarantForm.declarantId"
              size="small"
              filterable
              placeholder="Исполнитель"
            >
              <el-option
                v-for="s in userStore.users"
                :key="s.id"
                :label="s.name"
                :value="s.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="7" :sm="24">
          <el-form-item prop="taskText">
            <el-input
              v-model="declarantForm.taskText"
              size="small"
              placeholder="Заметка"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="18" class="mb1">
          <el-form-item id="submit-button">
            <app-save-button
              :loading="documentsStore.loading"
              @on-click="updateTask('declarantForm')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { documentTypeStore, userStore, documentsStore } from '~/store'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    documents: {
      type: Array,
      default: () => [],
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
    return {
      userStore,
      documentsStore,
      declarantForm: {
        documentTypeId: null,
        declarantId: null,
        type: null,
        taskText: null,
      },
      rules: {
        documentTypeId: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        declarantId: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
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
        this.declarantForm.declarantId = this.document?.declarant?.id
        this.declarantForm.documentTypeId = this.document?.documentType?.id
        this.declarantForm.taskText = this.document?.taskText
      }
    },
    setDocumentType(val) {
      const document = documentTypeStore.documentTypes.find((d) => d.id == val)
      if (document) {
        this.declarantForm.type = document.types[0]
      }
    },
    updateTask() {
      this.$refs.declarantForm.validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              ...this.declarantForm,
              orderId: this.orderId,
            }
            const document = await documentsStore.updateTask({
              id: this.document.id,
              data,
            })
            this.$emit('documentUpdated', document)
            this.$message.success('Документ успешно обновлен')
            this.$refs.declarantForm.resetFields()
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }
      })
    },
  },
}
</script>
