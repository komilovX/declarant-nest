<template>
  <div>
    <app-header header-text="Архивы" :button="false" />
    <data-grid :fetch-data="fetchData" :column-defs="orderTableColumn" />
  </div>
</template>

<script>
import OrderStatus from '~/components/AgGrid/OrderStatus'
import DataGrid from '~/components/DataGrid'
import ActionRenderer from '~/components/AgGrid/ActionsRenderer'
import { authStore, dataStore, userStore } from '~/store'
import { statuses } from '~/utils/data'
import AppHeader from '~/components/AppComponents/AppHeader.vue'
import { fetchOrderFilters } from '~/utils/fetch-service'

export default {
  components: { DataGrid, AppHeader },
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'archive')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data: () => {
    return {
      order_id: 0,
    }
  },
  async fetch({ error }) {
    try {
      await fetchOrderFilters()
    } catch (err) {
      error(err)
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
          width: 200,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => {
            return value?.name
          },
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Создатель',
            options: userStore.users.map((u) => ({
              label: u.name,
              value: u.id,
            })),
            onParentModelChanged: () => {},
          },
        },
        {
          headerName: 'Грузоотправитель',
          field: 'shipper',
          width: 250,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value?.name,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Грузоотправитель',
            options: dataStore.shippers.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Клиент фирма',
          field: 'client',
          width: 200,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value?.name,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Клиент фирма',
            options: dataStore.clients.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Товар',
          field: 'product',
          width: 200,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value?.name,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Товар',
            options: dataStore.products.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Исполнитель',
          field: 'declarant',
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value?.name,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Создатель',
            options: userStore.users.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
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
          suppressFilterButton: true,
          cellRendererFramework: OrderStatus,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Статус',
            options: Object.keys(statuses).map((key) => ({
              label: statuses[key],
              value: key,
            })),
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
            viewClicked(data) {
              that.$router.push(`/archive/${data.id}`)
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
