<template>
  <div>
    <order-cards v-if="statistics.orders" :orders="statistics.orders" />
    <task-cards class="mb-4 mt-2" :tasks="statistics.tasks" />
  </div>
</template>
<script>
import OrderCards from '~/components/StatisticComponents/OrderCards.vue'
import TaskCards from '~/components/StatisticComponents/TaskCards.vue'
import { statisticsStore } from '~/store'
export default {
  components: { TaskCards, OrderCards },
  async asyncData({ error }) {
    try {
      const statistics = await statisticsStore.findTasksAndOrdersCount()
      return { statistics }
    } catch (err) {
      error(err)
    }
  },
}
</script>
