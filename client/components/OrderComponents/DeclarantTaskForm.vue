<template>
  <el-form
    ref="declarantForm"
    :model="declarantForm"
    class="mt1"
    :rules="rules"
  >
    <el-row :gutter="15">
      <el-col :span="24" :md="3" :sm="18">
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
      <el-col :span="24" :md="4" :sm="24">
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
      <el-col :span="24" :md="4" :sm="24">
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
      <el-col :span="12" :md="4" :sm="12">
        <el-form-item prop="expire">
          <el-date-picker
            v-model="declarantForm.expire"
            size="small"
            style="max-width: 100%"
            placeholder="Срок"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="4" :sm="18" class="mb1">
        <el-form-item id="submit-button">
          <app-add-button
            :loading="documentsStore.loading"
            @on-click="giveTask('declarantForm')"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import AppAddButton from '../AppComponents/AppAddButton.vue'
import { documentTypeStore, userStore, documentsStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'

export default {
  components: { AppAddButton },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
    documents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      userStore,
      documentsStore,
      declarantForm: {
        documentTypeId: null,
        declarantId: null,
        expire: null,
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
        expire: [
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
    declarantDocumentTypes() {
      return documentTypeStore.documentTypes.filter(
        ({ types }) =>
          types.includes(DocumenTypes.DECLARANT) ||
          types.includes(DocumenTypes.SERVICE)
      )
    },
  },
  methods: {
    setDocumentType(val) {
      const document = documentTypeStore.documentTypes.find((d) => d.id == val)
      if (document) {
        this.declarantForm.type = document.types[0]
      }
    },
    giveTask() {
      this.$refs.declarantForm.validate(async (valid) => {
        if (valid) {
          try {
            const formData = {
              ...this.declarantForm,
              type: DocumenTypes.DECLARANT,
              orderId: this.orderId,
            }
            const document = await documentsStore.giveTask(formData)
            this.$emit('documentAdded', document)
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

<style></style>
