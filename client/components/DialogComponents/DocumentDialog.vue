<template>
  <el-dialog
    width="70vw"
    :title="
      type === 'create' ? 'Добавление документ' : 'Редактировать документ'
    "
    :visible.sync="visible"
    :before-close="() => $emit('close')"
  >
    <el-form ref="documentForm" :model="documentForm" :rules="rules">
      <el-row :gutter="15" class="mt1">
        <el-col :span="24" :md="5" :sm="12">
          <el-form-item label="Номер" prop="number">
            <el-input
              v-model="documentForm.number"
              placeholder="Номер"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="12">
          <el-form-item label="Название" prop="name">
            <el-input
              v-model="documentForm.name"
              placeholder="Название"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="12">
          <el-form-item label="Инфо" prop="info">
            <el-input
              v-model="documentForm.info"
              placeholder="Инфо"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="12">
          <el-form-item label="Тип" prop="types">
            <el-select v-model="documentForm.types" multiple placeholder="Тип">
              <el-option
                v-for="[key, value] in Object.entries(documentTypes)"
                :key="key"
                :label="value"
                :value="key"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="5" :sm="12">
          <el-form-item label="Отдель" prop="departments">
            <el-select
              v-model="documentForm.departments"
              multiple
              placeholder="Отдель"
            >
              <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="flex justify-end">
        <el-button
          :loading="documentTypeStore.loading"
          size="mini"
          type="success"
          @click="submitForm('documentForm')"
          >{{ type === 'create' ? 'Добавить' : 'Обновить' }}</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import { documentTypes } from '@/utils/data'
import { documentTypeStore } from '~/store'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    departments: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: 'create',
    },
    document: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      documentTypeStore,
      documentTypes,
      documentForm: {
        name: null,
        number: null,
        info: '',
        types: [],
        departments: [],
      },
      rules: mapRulesByValue([
        'name',
        'number',
        'info',
        'types',
        'departments',
      ]),
    }
  },
  watch: {
    type(value) {
      if (value === 'edit') {
        this.setDocument()
      } else {
        this.$refs.documentForm.resetFields()
      }
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (this.type === 'create') {
              await this.documentTypeStore.addDocumentType(this.documentForm)
            } else {
              await this.documentTypeStore.updateDocumentType({
                data: this.documentForm,
                id: this.document.id,
              })
            }
            this.$refs[formName].resetFields()
            this.$emit('close')
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    setDocument() {
      this.documentForm.name = this.document.name
      this.documentForm.number = this.document.number + ''
      this.documentForm.info = this.document.info
      this.documentForm.types = this.document.types
      this.documentForm.departments = this.document.departments
    },
  },
}
</script>
