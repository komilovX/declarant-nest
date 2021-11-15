<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Календарь" name="first">
      <Calendar :events="events" :tasks="tasks" />
    </el-tab-pane>
    <el-tab-pane label="Отчеты" name="second">
      <TaskInformation v-if="statistics" :statistics="statistics" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Calendar from '~/components/StatisticComponents/Calendar.vue'
import TaskInformation from '~/components/StatisticComponents/TaskInformation.vue'
import { eventsStore, statisticsStore } from '~/store'
export default {
  components: { Calendar, TaskInformation },
  data() {
    return {
      activeName: 'first',
      events: [],
      tasks: [],
      statistics: null,
    }
  },
  async fetch() {
    try {
      this.events = await eventsStore.findAll()
      this.tasks = await statisticsStore.findTasksForCalendar()
      // console.log(`this.tasks`, this.tasks)
    } catch (error) {
      console.log(`error`, error)
    }
  },
  methods: {
    async handleClick({ name }) {
      if (name === 'second' && !this.statistics) {
        this.statistics = await statisticsStore.findTasksAndOrdersCount()
      }
    },
  },
}
</script>
