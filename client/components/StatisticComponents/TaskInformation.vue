<template>
  <div>
    <order-cards v-if="statistics.orders" :orders="statistics.orders" />
    <task-cards class="mb-4 mt-2" :tasks="statistics.tasks" />
  </div>
</template>
<script>
import OrderCards from '~/components/StatisticComponents/Cards/OrderCards.vue'
import TaskCards from '~/components/StatisticComponents/Cards/TaskCards.vue'

export default {
  components: { TaskCards, OrderCards },
  props: {
    statistics: {
      type: Object,
      required: true,
    },
  },
}
</script>
