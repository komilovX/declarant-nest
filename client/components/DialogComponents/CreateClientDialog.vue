<template>
  <el-dialog
    title="Клиент фирма"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-11/12 md:w-3/4"
  >
    <el-form
      ref="clientsForm"
      :model="clientsForm"
      :rules="rules"
      label-position="top"
    >
      <el-row :gutter="15" class="mt1">
        <el-col :span="24" :md="5" :sm="12">
          <el-form-item label="Дата" prop="date">
            <el-date-picker
              v-model="clientsForm.date"
              type="date"
              placeholder="Дата"
              style="max-width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="12">
          <el-form-item label="Название" prop="name">
            <el-input
              v-model="clientsForm.name"
              placeholder="Название"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="12">
          <el-form-item label="Инфо" prop="info">
            <el-input
              v-model="clientsForm.info"
              placeholder="Название"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="12">
          <el-form-item label="Владелец" prop="directors">
            <div
              v-for="(d, ind) in clientsForm.directors"
              :key="ind"
              class="flex items-center"
            >
              <el-input
                v-model="clientsForm.directors[ind]"
                placeholder="Название"
                class="mb-1 mr-2"
                type="text"
              />
              <i
                v-if="ind === 0"
                class="el-icon-circle-plus fs-icon text-lg cursor-pointer text-blue-500"
                @click="clientsForm.directors.push('')"
              />
              <i
                v-else
                class="el-icon-close fs-icon text-lg cursor-pointer text-gray-500"
                @click="clientsForm.directors.splice(ind, 1)"
              />
            </div>
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
    const validatePass = (_rule, values, callback) => {
      values.forEach((v) => {
        if (v === '') {
          callback(new Error('Пожалуйста заполните это поле'))
        }
      })
      callback()
    }
    return {
      dataStore,
      clientsForm: {
        name: '',
        info: '',
        date: new Date(),
        directors: [''],
      },
      rules: {
        ...mapRulesByValue(['name', 'info', 'date']),
        directors: [
          {
            validator: validatePass,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
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
