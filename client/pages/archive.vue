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
      newDeclarant: '',
      isChatOpen: false,
      messages: [],
      participants: [],
      chatLoading: false,
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
        return await this.$axios.$post('/orders/grid', queryData)
      } catch (error) {
        console.log(error)
      }
    },
    async fetchMessages(id) {
      try {
        this.chatLoading = true
        let messages = await this.$axios.$get(`api/message/${id}`)
        messages = messages.map((message) => {
          if (this.user.userId == message.author) {
            message.author = 'me'
          }
          return message
        })
        this.messages = messages
        this.isChatOpen = true
        this.chatLoading = false
      } catch (error) {
        this.chatLoading = false
        throw error
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
    async updateDeclarant(currentDeclarant, index) {
      try {
        const { id } = this.declarants.find(
          ({ name }) => name === currentDeclarant
        )
        const formData = {
          id: this.orders[index].id,
          declarant: currentDeclarant,
          declarant_id: id,
        }
        await this.$store.dispatch('orders/updateOrder', formData)
        this.$message.success('Oбнавлена')
        this.orders[index].archived = false
      } catch (error) {
        console.log(error)
      }
    },
    deleteOrder(row) {
      const text = 'Уверены, что хотите удалить этого заявка?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$axios.$put(`api/orders/${row.id}/delete`)
            this.orders = this.orders.filter(({ id }) => id != row.id)
          } catch (e) {
            console.log(e)
          }
        })
        .catch(() => {})
    },
  },
}
</script>
