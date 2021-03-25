<template>
  <el-dialog
    title="Клиент фирма"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-11/12 md:w-1/2"
  >
    <el-form ref="clientsForm" :model="clientsForm" :rules="rules">
      <el-row :gutter="15" class="mt1">
        <el-col :span="24" :md="9" :sm="24">
          <el-form-item label="Дата" prop="date">
            <el-date-picker
              v-model="clientsForm.date"
              type="date"
              placeholder="Дата"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="7" :sm="24">
          <el-form-item label="Название" prop="name">
            <el-input
              v-model="clientsForm.name"
              placeholder="Название"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item label="Инфо" prop="info">
            <el-input
              v-model="clientsForm.info"
              placeholder="Название"
              type="text"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          :loading="dataStore.loading"
          @click="submitClientForm('clientsForm')"
        >
          Добавить
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import { dataStore } from '~/store'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Form',
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      dataStore,
      clientsForm: {
        name: '',
        info: '',
        date: new Date(),
      },
      rules: mapRulesByValue(['name', 'info', 'date']),
    }
  },
  methods: {
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            console.log('this.clientsForm', this.clientsForm)
            await this.dataStore.addClient(this.clientsForm)
            this.$refs[formName].resetFields()
            this.$message.success('Клиент успешно добавлен')
          } catch (e) {}
        } else {
          return false
        }
      })
    },
  },
}
</script>
