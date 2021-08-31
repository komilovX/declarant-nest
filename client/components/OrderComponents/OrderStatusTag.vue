<template>
  <div style="display: inline-block">
    <el-tag
      v-if="!select"
      :key="status"
      size="small"
      :type="colors[status]"
      effect="plain"
    >
      {{ statuses[status] }}
    </el-tag>
    <div v-else class="df">
      <el-select v-model="orderStatus" size="small" class="mr1">
        <el-option
          v-for="s in Object.keys(statuses)"
          :key="s"
          :label="statuses[s]"
          :value="s"
        />
      </el-select>
      <el-button
        type="success"
        size="mini"
        circle
        plain
        icon="el-icon-check"
        :loading="ordersStore.loading"
        :disabled="updateDisabled"
        @click="updateOrderStatus"
      />
    </div>
  </div>
</template>

<script>
import { ordersStore } from '~/store'
import { statuses } from '~/utils/data'

export default {
  props: {
    status: {
      type: String,
      default: 'new',
    },
    select: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: Number,
      required: true,
    },
    updateDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderStatus: this.status,
      ordersStore,
      statuses,
      colors: {
        new: 'success',
        inspection: 'danger',
        document: 'warning',
        registration: 'info',
        finished: 'primary',
      },
    }
  },
  methods: {
    async updateOrderStatus() {
      try {
        await ordersStore.updateOrderItems({
          id: this.orderId,
          data: { status: this.orderStatus },
        })
        this.$message.success('Статус успешно обновлен')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
