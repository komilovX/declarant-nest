<template>
  <div class="small">
    <div class="flex justify-end">
      <el-date-picker
        v-model="lineValue"
        size="small"
        type="year"
        placeholder="Выберите год"
        :clearable="false"
      />
    </div>
    <LineChart
      :width="1000"
      :height="350"
      :chart-data="lineChartDataCollection"
    />
    <el-divider class="mt-10"><p class="bg-transparent">Заявки</p></el-divider>
    <PieChart
      :width="1000"
      :height="350"
      :chart-data="pieChartDataCollection"
    />
  </div>
</template>

<script>
import LineChart from '@/components/Charts/LineChart'
import PieChart from '@/components/Charts/PieChart'
export default {
  components: {
    LineChart,
    PieChart,
  },
  data() {
    return {
      lineValue: new Date().getFullYear().toString(),
      lineChartDataCollection: {},
      barChartDataCollection: {},
      pieChartDataCollection: {},
    }
  },
  mounted() {
    this.fillData()
  },
  methods: {
    fillData() {
      const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ]
      this.lineChartDataCollection = {
        labels: months,
        datasets: [
          {
            label: 'Полученная прибыль',
            data: [65, 59, 80, 81, 56, 55, 35, 81, 56, 55, 40, 50],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      }
      this.barChartDataCollection = {
        labels: months,
        datasets: [
          {
            label: 'Заявки',
            data: [12, 24, 34, 32, 14],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      }
      this.pieChartDataCollection = {
        labels: [
          'Проданные автомобили',
          'Cуществующие автомобили',
          'Ожидаемые автомобили',
        ],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10, 25, 15],
            backgroundColor: [
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
            ],
          },
        ],
      }
    },
  },
}
</script>

<style>
.small {
  max-width: 1200px;
  margin: 10px auto;
}
</style>
