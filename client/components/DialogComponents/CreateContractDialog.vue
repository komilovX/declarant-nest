<template>
  <el-dialog
    title="Добавление документов"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-96"
  >
    <el-form
      ref="contractForm"
      :model="contractForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Документ" prop="documentTypeId">
        <el-select
          v-model="contractForm.documentTypeId"
          filterable
          placeholder="Документ"
          style="width: 100%"
        >
          <el-option
            v-for="item in documents"
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
          @click="submitClientForm('contractForm')"
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
    documents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      contractStore,
      contractForm: {
        documentTypeId: null,
      },
      rules: mapRulesByValue(['documentTypeId']),
    }
  },
  methods: {
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.contractStore.addContract(this.contractForm)
            this.$refs[formName].resetFields()
            this.$emit('contractDocumentAdded', res)
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
