<template>
  <div>
    <div class="flex items-center">
      <h2 class="mr-2 text-lg font-medium">Заявки</h2>
      <app-add-button
        v-role:create="'orders'"
        size="mini"
        @on-click="$router.push('/orders/create-order')"
      />
    </div>
    <hr class="my-2" />
    <data-grid
      ref="dataGrid"
      :fetch-data="fetchData"
      :column-defs="orderTableColumn"
      :height="74"
    />
  </div>
</template>

<script>
import DataGrid from '../../components/DataGrid'
import ActionRenderer from '../../components/AgGrid/ActionsRenderer'
import OrderStatus from '../../components/AgGrid/OrderStatus'
import { authStore, dataStore, ordersStore, userStore } from '~/store'
import { statuses } from '~/utils/data'
import { fetchOrderFilters } from '~/utils/fetch-service'
export default {
  components: { DataGrid },
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'orders')
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
      newDeclarant: '',
    }
  },
  async fetch({ error }) {
    try {
      await fetchOrderFilters()
    } catch (err) {
      error(err)
    }
  },
  head() {
    return {
      title: 'Заявки',
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
          cellRendererFramework: ActionRenderer,
          cellRendererParams: {
            showView: true,
            showMessage: false,
            showDelete: true,
            pageRoles: 'orders',
            loading: that.chatLoading,
            userId: authStore.user.id,
            viewClicked(data) {
              that.$router.push(`/orders/details/${data.id}`)
            },
            messageClicked(order) {
              that.participants = [
                {
                  id: order.declarant_id,
                  name: order.declarant,
                },
                {
                  id: that.user.userId,
                  name: authStore.user.id,
                },
              ]
              that.order_id = order.id
              that.fetchMessages(order.id)
            },
            deleteClicked(data) {
              that.deleteOrder(data.id)
            },
          },
        },
      ]
    },
  },
  methods: {
    async fetchData(queryData) {
      try {
        return await this.$axios.$post('/orders/grid', queryData)
      } catch (error) {
        console.log(error)
      }
    },
    statusFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Select',
        options: Object.keys(this.statuses).map((key) => ({
          value: key,
          key: this.statuses[key],
        })),
      }
    },
    changeOrderStatus(index) {
      this.orders[index].archived = true
    },
    filterTag(value, row) {
      return row.status === value
    },
    deleteOrder(id) {
      const text = 'Уверены, что хотите удалить этого заявка?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ordersStore.updateOrderItems({
              id,
              data: { deleted: true },
            })
            this.$refs.dataGrid.redrawRows()
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
  },
}
</script>
