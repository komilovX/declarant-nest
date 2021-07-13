<template>
  <el-dialog
    title="Добавление клиентнтов"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-96"
  >
    <el-form
      ref="contractClientForm"
      :model="contractForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Клиенти" prop="clientId">
        <el-select
          v-model="contractForm.clientId"
          filterable
          placeholder="Клиент"
          style="width: 100%"
        >
          <el-option
            v-for="item in clients"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          :loading="contractStore.loading"
          @click="submitClientForm('contractClientForm')"
        >
          Добавить
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import { contractStore } from '~/store'

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
    documentTypeId: {
      type: Number,
      required: true,
    },
    clients: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      contractStore,
      contractForm: {
        clientId: null,
      },
      rules: mapRulesByValue(['clientId']),
    }
  },
  methods: {
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              clientId: this.contractForm.clientId,
              documentTypeId: this.documentTypeId,
            }
            const res = await this.contractStore.addContractClient(data)
            this.$refs[formName].resetFields()
            this.$emit('contractClientAdded', res)
            this.$message.success('Контракт успешно добавлен')
          } catch (e) {}
        } else {
          return false
        }
      })
    },
  },
}
</script>
