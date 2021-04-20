<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="onClose"
    class="w-24 md:w-auto"
  >
    <el-form ref="contractForm" :model="contractForm" :rules="rules">
      <el-row :gutter="15" class="mt1">
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item label="Документ" prop="documentTypeId">
            <el-select
              v-model="contractForm.documentTypeId"
              filterable
              placeholder="Документ"
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
        </el-col>
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item label="Клиент" prop="clientId">
            <el-select
              v-model="contractForm.clientId"
              filterable
              placeholder="Клиент"
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
        </el-col>
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item label="Грузоотправители" prop="shipperId">
            <el-select
              v-model="contractForm.shipperId"
              filterable
              placeholder="Грузоотправители"
            >
              <el-option
                v-for="item in shippers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
    title: {
      type: String,
      required: true,
    },
    documents: {
      type: Array,
      default: () => [],
    },
    clients: {
      type: Array,
      default: () => [],
    },
    shippers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      contractStore,
      contractForm: {
        shipperId: null,
        clientId: null,
        documentTypeId: null,
      },
      rules: mapRulesByValue(['shipperId', 'clientId', 'documentTypeId']),
    }
  },
  methods: {
    submitClientForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await this.contractStore.addContract(this.contractForm)
            this.$refs[formName].resetFields()
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
