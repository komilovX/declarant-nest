import Vue from 'vue'

Vue.filter('dateFormatter', function (date: Date) {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
})

Vue.filter('numberFormatter', function (number: any) {
  return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(number)
})
