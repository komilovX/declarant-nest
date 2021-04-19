<template>
  <div>
    <app-header header-text="Архивы" :button="false" />
    <data-grid :fetch-data="fetchData" :column-defs="orderTableColumn" />
  </div>
</template>

<script>
import DataGrid from '../components/DataGrid'
import ActionRenderer from '../components/AgGrid/ActionsRenderer'
import OrderStatus from '../components/AgGrid/OrderStatus'
import { authStore } from '~/store'
import { statuses } from '~/utils/data'
import AppHeader from '~/components/AppComponents/AppHeader.vue'

export default {
  components: { DataGrid, AppHeader },
  middleware: ['admin-auth'],
  data: () => {
    return {
      order_id: 0,
    }
  },
  computed: {
    orderTableColumn() {
      const that = this
      return [
        {
          headerName: 'Заяавка №',
          field: 'id',
          sortable: true,
          width: 140,
        },
        {
          headerName: 'Дата',
          field: 'date',
          filter: 'agDateColumnFilter',
          sortable: true,
          width: 200,
          cellRenderer: ({ value = new Date() }) => {
            return new Intl.DateTimeFormat('ru-RU').format(new Date(value))
          },
        },
        { headerName: 'Пост №', field: 'post_number', width: 150 },
        {
          headerName: 'Создатель',
          field: 'user',
          cellRenderer: ({ value }) => value?.name,
        },
        {
          headerName: 'Грузоотправитель',
          field: 'shipper',
          width: 250,
          cellRenderer: ({ value }) => value?.name,
        },
        {
          headerName: 'Клиент фирма',
          field: 'client',
          width: 200,
          cellRenderer: ({ value }) => value?.name,
        },
        {
          headerName: 'Товара',
          field: 'product',
          width: 200,
          cellRenderer: ({ value }) => value?.name,
        },
        {
          headerName: 'Исполнитель',
          field: 'declarant',
          width: 250,
          cellRenderer: ({ value }) => value?.name,
        },
        {
          headerName: 'Контейнер №',
          field: 'container',
          width: 180,
        },
        {
          headerName: 'Статус',
          field: 'status',
          sortable: false,
          noSearch: true,
          width: 170,
          suppressFilterButton: true,
          cellRendererFramework: OrderStatus,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Select',
            options: statuses,
          },
        },
        {
          headerName: 'Действия',
          pinned: 'right',
          noSearch: true,
          filter: false,
          sortable: false,
          width: 110,
          cellRendererFramework: ActionRenderer,
          cellRendererParams: {
            showView: true,
            showMessage: false,
            showDelete: false,
            loading: that.chatLoading,
            userId: authStore.user.id,
            viewClicked(id) {
              that.$router.push(`/orders/details/${id}`)
            },
          },
        },
      ]
    },
  },
  methods: {
    async fetchData(queryData) {
      try {
        return await this.$axios.$post('/orders/grid?archived=true', queryData)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
