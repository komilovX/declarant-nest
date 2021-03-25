<template>
  <div class="admin-container">
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-xl font-medium mr-4">#{{ $route.params.id }}</h2>
      <el-button
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
          <app-add-button @on-click="documentDialog = true" />
        </div>
        <div style="padding: 8px" class="df">
          <div class="cubics flex">
            <div class="flex mr1">
              <div class="service-row" />
              <span>Услуги</span>
            </div>
            <div class="flex">
              <div class="declarant-row" />
              <span>Документы</span>
            </div>
          </div>
        </div>
        <admin-info-table
          :service-list="serviceList"
          :button="!order.deleted && !order.archived"
          @document-clicked="openUpdateDialog"
        />
        <admin-total-price
          v-if="serviceList.length > 0"
          ref="totalPriceRef"
          :price="totalPrice"
          :order_id="order.id"
          :price_info="orderPrice"
        />
        <convert-order-pdf
          id="print-area"
          ref="converter"
          :service-list="serviceList"
          :price="totalPrice"
          :price_info="orderPrice"
        />
        <div class="df mt1">
          <el-button
            v-if="serviceList.length > 0"
            size="medium"
            type="primary"
            plain
            @click="printDocument"
          >
            Печатать
          </el-button>
          <el-button
            v-if="serviceList.length > 0"
            size="medium"
            type="success"
            :loading="finishLoading"
            @click="changeOrderStatus()"
            >Закончить</el-button
          >
        </div>
      </el-col>
    </el-row>
    <CreateOrderDocument
      :visible="documentDialog"
      :documents="documentTypeStore.documentTypes"
      :order="order"
      :on-close="() => (documentDialog = false)"
      @documentAdded="documentAdded($event)"
    />
    <update-order-document
      :visible="updateDialog"
      :document="changedDocument"
      :order_id="order.id"
      :on-close="() => (updateDialog = false)"
      @file-deleted="deleteDclarantFile($event)"
      @delete-document="deleteDocument($event)"
      @updated="onDocumentUpdated($event)"
      @documentAdded="documentAdded($event)"
    />
  </div>
</template>

<script>
import AdminTotalPrice from '@/components/OrderComponents/AdminTotalPrice.vue'
import CreateOrderDocument from '@/components/DialogComponents/CreateOrderDocument.vue'
import UpdateOrderDocument from '@/components/DialogComponents/UpdateOrderDocument.vue'
import OrderInfo from '~/components/OrderComponents/OrderInfo.vue'
import AdminFileTable from '~/components/OrderComponents/AdminFileTable.vue'
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'
import AdminInfoTable from '~/components/OrderComponents/AdminInfoTable.vue'
import ConvertOrderPdf from '~/components/OrderComponents/ConvertOrderPdf.vue'

import { documentTypeStore, ordersStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'

export default {
  components: {
    CreateOrderDocument,
    UpdateOrderDocument,
    OrderInfo,
    AppAddButton,
    AdminTotalPrice,
    AdminInfoTable,
    AdminFileTable,
    ConvertOrderPdf,
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.serviceList.length > 0) {
      this.$refs.totalPriceRef.updateData()
    }
    next()
  },
  async asyncData({ route }) {
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
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      documentTypeStore,
      finishLoading: false,
      documentDialog: false,
      updateDialog: false,
      changedDocument: {},
    }
  },
  computed: {
    serviceList() {
      return this.documents.filter(
        ({ documentType }) =>
          documentType === DocumenTypes.DECLARANT ||
          documentType === DocumenTypes.SERVICE
      )
    },
    totalPrice() {
      let dollar = 0
      let sum = 0
      let invoice = 0
      this.serviceList.forEach((doc) => {
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
  },
  methods: {
    documentAdded({ document, type }) {
      if (type == 'document') {
        this.declarant_documents.push(document)
      } else {
        this.services.push(document)
      }
      this.documentDialog = false
    },
    openUpdateDialog(row) {
      this.changedDocument = row
      this.updateDialog = true
    },
    async deleteDclarantFile({ id, file }) {
      try {
        await this.$store.dispatch('orders/deleteDeclarantDocumentFile', {
          id,
          file,
        })
        const index = this.declarant_documents.findIndex((d) => d.id == id)
        let files = JSON.parse(this.declarant_documents[index].files)
        files = JSON.stringify(files.filter((f) => f !== file))
        this.changedDocument.files = this.changedDocument.files.filter(
          (f) => f !== file
        )
        this.declarant_documents[index].files = files
      } catch (e) {
        console.log(e)
      }
    },
    onDocumentUpdated({ document, type }) {
      console.log('document', document)
      if (type === 'document') {
        const index = this.declarant_documents.findIndex(
          (d) => d.id == document.id
        )
        this.declarant_documents[index] = document
      } else {
        const index = this.services.findIndex((d) => d.id == document.id)
        this.services[index] = document
      }
      this.updateDialog = false
    },
    async deleteDocument({ id, type }) {
      try {
        if (type === 'declarant') {
          await this.$store.dispatch('orders/deleteDeclarantDocument', id)
          this.declarant_documents = this.declarant_documents.filter(
            (d) => d.id != id
          )
        } else {
          await this.$axios.$delete(`api/service/${id}`)
          this.services = this.services.filter((f) => f.id != id)
        }
        this.updateDialog = false
        this.$message.success('Документ успешно удален')
      } catch (e) {
        console.log(e)
      }
    },
    async changeOrderStatus() {
      try {
        this.finishLoading = true
        await this.$axios.$put(`api/orders/${this.order.id}/archive`)
        this.finishLoading = false
        this.$router.push('/orders')
      } catch (e) {
        this.finishLoading = false
        console.log(e)
      }
    },
    printDocument() {
      this.$refs.converter.print()
    },
  },
}
</script>

<style lang="scss" scoped>
.cubics {
  padding: 5px;
  [class$='-row'] {
    width: 20px;
    height: 20px;
    margin: 0 8px;
  }
  .service-row {
    background-color: rgba(252, 0, 0, 0.3);
  }
  .declarant-row {
    background-color: rgba(1, 69, 255, 0.3);
  }
  .task-row {
    background-color: rgba(248, 232, 85, 0.5);
  }
}
</style>
