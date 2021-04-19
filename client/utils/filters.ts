import Vue from 'vue'
import { currencyList, documentStatusTexts } from './data'

Vue.filter('dateFormatter', function (date: Date) {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
})

Vue.filter('numberFormatter', function (number: any) {
  return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(number)
})

Vue.filter('getCurrency', function (currency: any) {
  return currencyList.find((c) => c.value == currency)
    ? currencyList.find((c) => c.value == currency)?.type
    : currency
})

Vue.filter('documentStatusFilter', function (value: any) {
  return documentStatusTexts[value] || value
})
