<template>
  <ul class="order-detail p-1">
    <li>
      <span class="name text-base font-medium">Дата:</span>
      <span class="value">{{ order.date | dateFormatter }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Дата прибытие:</span>
      <span class="value">{{ order.date_income | dateFormatter }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Пост номер:</span>
      <span class="value">{{ order.post_number }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Грузоотправитель:</span>
      <span class="value">{{ order.shipper && order.shipper.name }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Клиент фирма:</span>
      <span class="value">{{ order.client && order.client.name }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Исполнитель:</span>
      <span class="value">{{ order.declarant && order.declarant.name }}</span>
    </li>
    <li>
      <span class="name text-base font-medium">Название товара:</span>
      <span class="value">{{ order.product && order.product.name }}</span>
    </li>
    <li style="padding: 5px">
      <span class="name text-base font-medium">Статус:&nbsp;</span>
      <span class="value">
        <order-status
          :select="select"
          :status="order.status"
          :order-id="order.id"
          :updateDisabled="updateDisabled"
        />
      </span>
    </li>
  </ul>
</template>
<script>
import OrderStatus from './OrderStatusTag.vue'
import { authStore } from '~/store'

export default {
  components: { OrderStatus },
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
    select: {
      type: Boolean,
      default: false,
    },
    updateDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    user() {
      return authStore.user
    },
  },
}
</script>
<style lang="scss" scoped>
.order-detail {
  overflow: hidden;
  list-style-type: none;
  & > li:not(:last-child) {
    border-bottom: 1px solid #eee;
    padding: 4px;
  }
}
</style>
