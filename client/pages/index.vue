<template>
  <div>
    <order-cards v-if="statistics.orders" :orders="statistics.orders" />
    <task-cards class="mb-4 mt-2" :tasks="statistics.tasks" />
    <el-row :gutter="20" class="flex baseline">
      <el-col :span="24" :md="16" :sm="24">
        <h2 class="font-medium text-lg">Уведомления</h2>
        <el-table
          :data="notifications"
          style="width: 100%"
          max-height="350"
          class="mt-2 p-2"
        >
          <el-table-column label="Дата" width="150">
            <template slot-scope="{ row }">
              <i class="el-icon-time text-blue-500"></i>
              <span style="margin-left: 10px">{{
                row.date | dateFormatter
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Сообщение"
            min-width="350"
            prop="message"
            show-overflow-tooltip
          />
          <el-table-column align="center">
            <template slot-scope="{ row: { id } }">
              <el-tooltip content="прочитал">
                <i
                  class="el-icon-check cursor-pointer text-green-500"
                  @click="messageReaded(id)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrderCards from '~/components/StatisticComponents/OrderCards.vue'
import TaskCards from '~/components/StatisticComponents/TaskCards.vue'
import { notificationStore, statisticsStore } from '~/store'
export default {
  components: { TaskCards, OrderCards },
  async asyncData({ error }) {
    try {
      const notifications = await notificationStore.findAllNotifications()
      const statistics = await statisticsStore.findTasksAndOrdersCount()
      return { notifications, statistics }
    } catch (err) {
      console.warn(`err.code`, err.statusCode)
      error(err)
    }
  },
  data() {
    return {}
  },
  methods: {
    async messageReaded(id) {
      try {
        await notificationStore.changeToRead(id)
        this.notifications = this.notifications.filter((not) => not.id !== id)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
