<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="mr-2 text-lg font-medium">Мои задачи</h2>
      <order-task-statuses />
    </div>
    <hr class="my-2" />
    <el-tabs type="border-card" stretch>
      <el-tab-pane label="Нужно сделать">
        <data-grid
          :fetch-data="fetchNewTasks"
          :column-defs="orderTableColumn"
          :cellStyle="gridCellStyle"
        />
      </el-tab-pane>
      <el-tab-pane label="Законченный">
        <data-grid
          :fetch-data="fetchFinishedTasks"
          :column-defs="orderTableColumn"
          :cellStyle="gridCellStyle"
          :height="70"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataGrid from '~/components/DataGrid'
import ActionRenderer from '~/components/AgGrid/ActionsRenderer'
import { authStore, dataStore, documentTypeStore, userStore } from '~/store'
import { DocumentStatus } from '~/utils/data'
import OrderTaskStatuses from '~/components/OrderComponents/OrderTaskStatuses.vue'
import { fetchTaskFilters } from '~/utils/fetch-service'
import { gridCellStyle } from '~/utils/order.util.js'
export default {
  components: { DataGrid, OrderTaskStatuses },
  middleware: ['admin-auth'],
  data: () => {
    return {
      gridCellStyle,
      order_id: 0,
      newDeclarant: '',
    }
  },
  async fetch({ error }) {
    try {
      await fetchTaskFilters()
    } catch (err) {
      error(err)
    }
  },
  computed: {
    orderTableColumn() {
      const that = this
      return [
        {
          headerName: 'Заявка №',
          field: 'order',
          sortable: true,
          width: 110,
          cellRenderer: ({ value }) => value?.id,
        },
        {
          headerName: 'Номер документ',
          field: 'documentType.number',
          width: 120,
          headerTooltip: 'Номер документ',
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Номер документ',
            options: documentTypeStore.documentTypes.map((u) => ({
              label: u.number,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Наименование',
          field: 'documentType.name',
          width: 150,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Наименование',
            options: documentTypeStore.documentTypes.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Дата',
          field: 'createdAt',
          filter: 'agDateColumnFilter',
          sortable: true,
          width: 180,
          cellRenderer: ({ value = new Date() }) => {
            return new Intl.DateTimeFormat('ru-RU').format(new Date(value))
          },
        },
        {
          headerName: 'Cрок',
          field: 'expire',
          filter: 'agDateColumnFilter',
          sortable: true,
          width: 180,
          cellRenderer: ({ value = new Date() }) => {
            return new Intl.DateTimeFormat('ru-RU').format(new Date(value))
          },
        },
        {
          headerName: 'Пост №',
          field: 'order.post_number',
        },
        {
          headerName: 'Декларант',
          field: 'creator',
          width: 220,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
          cellRenderer: ({ value }) => value?.name,
          tooltipValueGetter: ({ value }) => value?.name,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            optionsLabel: 'Декларант',
            options: userStore.users.map((u) => ({
              label: u.name,
              value: u.id,
            })),
          },
        },
        {
          headerName: 'Грузоотправитель',
          field: 'order.shipper',
          width: 150,
          headerTooltip: 'Грузоотправитель',
          cellRenderer: ({ value }) => value?.name,
          tooltipValueGetter: ({ value }) => value?.name,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
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
          field: 'order.client',
          width: 220,
          cellRenderer: ({ value }) => value?.name,
          tooltipValueGetter: ({ value }) => value?.name,
          sortable: false,
          noSearch: true,
          suppressFilterButton: true,
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
          headerName: 'Товара',
          field: 'order.product',
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
          headerName: 'Контейнер №',
          field: 'order.container',
          width: 180,
          cellRenderer: ({ value }) => value,
        },
        {
          pinned: 'right',
          width: 100,
          noSearch: true,
          filter: false,
          sortable: false,
          cellRendererFramework: ActionRenderer,
          cellRendererParams: {
            showView: true,
            showMessage: false,
            showDelete: false,
            loading: that.chatLoading,
            userId: authStore.user.id,
            viewClicked(data) {
              that.$router.push(`/tasks/${data.order?.id}`)
            },
          },
        },
      ]
    },
  },
  methods: {
    async fetchNewTasks(queryData) {
      try {
        return await this.$axios.$post(
          `/documents/declarant?status=${DocumentStatus.TASK}&status=${DocumentStatus.RETURNED}`,
          queryData
        )
      } catch (error) {
        console.log(error)
      }
    },
    async fetchFinishedTasks(queryData) {
      try {
        return await this.$axios.$post(
          `/documents/declarant?status=${DocumentStatus.DONE}`,
          queryData
        )
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
  },
}
</script>
