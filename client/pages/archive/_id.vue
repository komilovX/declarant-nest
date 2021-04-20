<template>
  <div class="admin-container">
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-xl font-medium mr-4">#{{ $route.params.id }}</h2>
      <el-button
        v-role:update="'orders'"
        type="primary"
        size="mini"
        @click="$router.push(`/orders/${order.id}`)"
      >
        Изменить <i class="header-icon el-icon-edit" />
      </el-button>
    </div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="10" :sm="24">
        <el-collapse value="1">
          <el-collapse-item name="1">
            <template slot="title">
              <h3 class="mr1 text-base font-medium">Детали</h3>
            </template>
            <order-info :order="order" />
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" :md="14" :sm="24">
        <el-collapse :value="['1', '2']">
          <el-collapse-item name="1" class="mb-4">
            <template slot="title">
              <h3 class="text-base font-medium">
                Входящие документы ({{ incomingDocuments.length }})
              </h3>
            </template>
            <admin-file-table :documents="incomingDocuments" />
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <h3 class="text-base font-medium">
                Документы оформленные ({{ decoratedDocuments.length }})
              </h3>
            </template>
            <admin-file-table :documents="decoratedDocuments" />
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" class="mb-2 mt-6">
        <div class="flex" style="align-items: center">
          <h4 class="text-center text-lg font-medium mr-4">
            Необходимые Услуги, Документы
          </h4>
        </div>
        <div
          class="mt-3 p-2 bg-white flex justify-between items-center inline-block"
        >
          <order-task-statuses />
          <el-button type="text" @click="contractDialog = true"
            >Контракты</el-button
          >
        </div>
        <admin-info-table
          :service-list="serviceList"
          :button="!order.deleted && !order.archived"
        />
        <div class="mb-14">
          <div class="flex py-4" style="align-items: center">
            <h4 class="text-center text-lg font-medium mr-4">
              Ваши документы и услуги
            </h4>
          </div>
          <admin-personal-table
            :documents="adminPersonalDocuments"
            :button="!order.deleted && !order.archived"
          />
        </div>
        <admin-total-price
          v-if="serviceList.length > 0 || adminPersonalDocuments.length > 0"
          ref="totalPriceRef"
          :price="totalPrice"
          :order_id="order.id"
          :price_info="orderPrice"
          :archived="true"
        />
        <div v-role:update="'archive'" class="flex mt-2">
          <el-button size="small" type="primary" plain @click="printDocument">
            Печатать
          </el-button>
          <el-button
            v-if="serviceList.length > 0"
            size="small"
            type="success"
            :loading="finishLoading"
            @click="changeOrderStatus"
          >
            Восстановить
          </el-button>
        </div>
        <convert-order-pdf
          id="print-area"
          ref="converter"
          :service-list="serviceList"
          :price="totalPrice"
          :price_info="orderPrice"
        />
      </el-col>
    </el-row>
    <order-contracts
      :visible="contractDialog"
      :on-close="() => (contractDialog = false)"
      :clientId="order.client.id"
      :shipperId="order.shipper.id"
    />
  </div>
</template>

<script>
import AdminTotalPrice from '@/components/OrderComponents/AdminTotalPrice.vue'
import OrderInfo from '~/components/OrderComponents/OrderInfo.vue'
import AdminFileTable from '~/components/OrderComponents/AdminFileTable.vue'
import AdminInfoTable from '~/components/OrderComponents/AdminInfoTable.vue'
import ConvertOrderPdf from '~/components/OrderComponents/ConvertOrderPdf.vue'

import { authStore, documentTypeStore, ordersStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'
import OrderTaskStatuses from '~/components/OrderComponents/OrderTaskStatuses.vue'
import AdminPersonalTable from '~/components/OrderComponents/AdminPersonalTable.vue'
import OrderContracts from '~/components/OrderComponents/OrderContracts.vue'
import { DocumentStatus } from '~/utils/data'

export default {
  components: {
    OrderInfo,
    AdminTotalPrice,
    AdminInfoTable,
    AdminFileTable,
    ConvertOrderPdf,
    OrderTaskStatuses,
    AdminPersonalTable,
    OrderContracts,
  },
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
  async asyncData({ route, error }) {
    try {
      const {
        documents,
        orderPrice,
        ...order
      } = await ordersStore.findOrderByIdWithDetails(route.params.id)
      if (!documentTypeStore.documentTypes.length) {
        await documentTypeStore.fetchDocumentTypes()
      }
      return { order, documents, orderPrice }
    } catch (err) {
      error(err)
    }
  },
  data() {
    return {
      documentTypeStore,
      finishLoading: false,
      contractDialog: false,
    }
  },
  computed: {
    totalPrice() {
      let dollar = 0
      let sum = 0
      let invoice = 0
      this.serviceList.concat(this.adminPersonalDocuments).forEach((doc) => {
        doc.price.forEach((p) => {
          if (p.currency == '$') {
            dollar += +p.price
          } else if (p.currency == 'sum') {
            sum += +p.price
          } else {
            invoice += +p.price
          }
        })
      })
      return { dollar, sum, invoice }
    },
    incomingDocuments() {
      return this.documents.filter((doc) => doc.type === DocumenTypes.INCOMING)
    },
    decoratedDocuments() {
      return this.documents.filter((doc) => doc.type === DocumenTypes.DECORATED)
    },
    adminPersonalDocuments() {
      return this.documents.filter(
        ({ type, status }) =>
          type === DocumenTypes.DECLARANT && status === DocumentStatus.NEW
      )
    },
    serviceList() {
      return this.documents.filter(
        ({ type, status }) =>
          type === DocumenTypes.DECLARANT && status !== DocumentStatus.NEW
      )
    },
  },
  methods: {
    async changeOrderStatus() {
      try {
        await ordersStore.updateOrderItems({
          id: this.order.id,
          data: { archived: false },
        })
        this.$router.push('/archive')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
