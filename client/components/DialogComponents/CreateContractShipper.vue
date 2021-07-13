<template>
  <el-dialog
    title="Добавление грузоотправителов"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-96"
  >
    <el-form
      ref="contractShipperForm"
      :model="contractForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Грузоотправители" prop="shipperId">
        <el-select
          v-model="contractForm.shipperId"
          filterable
          placeholder="Грузоотправители"
          style="width: 100%"
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
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          :loading="contractStore.loading"
          @click="submitShipperForm('contractShipperForm')"
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
    clientId: {
      type: Number,
      required: true,
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
      },
      rules: mapRulesByValue(['shipperId']),
    }
  },
  methods: {
    submitShipperForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              clientId: this.clientId,
              shipperId: this.contractForm.shipperId,
            }
            const res = await this.contractStore.addContractShipper(data)
            this.$refs[formName].resetFields()
            this.$emit('contractShipperForm', res)
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
