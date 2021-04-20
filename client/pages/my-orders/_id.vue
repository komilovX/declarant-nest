<template>
  <div class="admin-container">
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-xl font-medium mr-4">#{{ $route.params.id }}</h2>
    </div>
    <el-row :gutter="20" class="p1">
      <el-col :span="24" :md="10" :sm="24">
        <el-collapse value="1">
          <el-collapse-item name="1">
            <template slot="title">
              <h3 class="mr1 text-base font-medium">Детали</h3>
            </template>
            <order-info :order="order" :select="true" />
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
          <el-collapse-item
            name="2"
            class="p-0"
            style="padding: 0px !important"
          >
            <template slot="title">
              <h3 class="text-base font-medium">
                Документы оформленные ({{ decoratedDocuments.length }})
              </h3>
            </template>
            <decorated-document
              :decorated-documents="decoratedDocuments"
              :order_id="Number($route.params.id)"
              @delete-document="deleteDecoratedDocument($event)"
              @decoratedDocumentAdded="documents.push($event)"
            />
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" class="mb-2 mt-6">
        <div class="flex" style="align-items: center">
          <h4 class="text-center text-lg font-medium mr-4">
            Необходимые Услуги, Документы
          </h4>
        </div>
        <declarant-task-form
          :orderId="order.id"
          :documents="declarantDocumentTypes"
          @documentAdded="documents.push($event)"
        />
        <div class="bg-white">
          <div
            class="mt-2 p-2 bg-white flex justify-between items-center inline-block"
          >
            <order-task-statuses />
            <el-button type="text" @click="contractDialog = true"
              >Контракты</el-button
            >
          </div>
          <update-declarant-task
            :visible="updateDialog"
            :documents="declarantDocumentTypes"
            :document="changedDocument"
            :orderId="order.id"
            :onClose="() => (updateDialog = false)"
            @documentUpdated="documentUpdated"
          />
        </div>

        <declarant-task-table
          :documents="declarantDocuments"
          :orderId="order.id"
          @deleteDocument="deleteDocument($event)"
          @updateDocument="openUpdateDialog($event)"
          @documentUpdated="documentUpdated($event)"
        />
        <order-contracts
          :visible="contractDialog"
          :on-close="() => (contractDialog = false)"
          :clientId="order.client.id"
          :shipperId="order.shipper.id"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrderInfo from '~/components/OrderComponents/OrderInfo.vue'
import AdminFileTable from '~/components/OrderComponents/AdminFileTable.vue'
import {
  documentTypeStore,
  ordersStore,
  userStore,
  documentsStore,
  authStore,
} from '~/store'
import { DocumenTypes } from '~/utils/enums'
import DecoratedDocument from '~/components/OrderComponents/DecoratedDocument.vue'
import DeclarantTaskForm from '~/components/OrderComponents/DeclarantTaskForm.vue'
import DeclarantTaskTable from '~/components/OrderComponents/DeclarantTaskTable.vue'
import UpdateDeclarantTask from '~/components/DialogComponents/UpdateDeclarantTask.vue'
import OrderTaskStatuses from '~/components/OrderComponents/OrderTaskStatuses.vue'

export default {
  components: {
    OrderInfo,
    AdminFileTable,
    DecoratedDocument,
    DeclarantTaskForm,
    DeclarantTaskTable,
    UpdateDeclarantTask,
    OrderTaskStatuses,
  },
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'my-orders')
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
        documents = [],
        orderPrice,
        ...order
      } = await ordersStore.findOrderByIdWithDetailsForDeclarant(
        route.params.id,
        'declarant'
      )
      if (!documentTypeStore.documentTypes.length) {
        await documentTypeStore.fetchDocumentTypes()
      }
      if (!userStore.users.length) {
        await userStore.fetchUsers()
      }
      return { order, documents, orderPrice }
    } catch (err) {
      error(err)
    }
  },
  data() {
    return {
      documentTypeStore,
      documentsStore,
      changedDocument: {},
      updateDialog: false,
      contractDialog: false,
    }
  },
  computed: {
    incomingDocuments() {
      return this.documents.filter((doc) => doc.type === DocumenTypes.INCOMING)
    },
    decoratedDocuments() {
      return this.documents.filter((doc) => doc.type === DocumenTypes.DECORATED)
    },
    declarantDocuments() {
      return this.documents.filter(
        (doc) =>
          doc.type === DocumenTypes.DECLARANT &&
          doc.creator?.id === authStore.user.id
      )
    },
    declarantDocumentTypes() {
      return this.documentTypeStore.documentTypes.filter(
        (doc) =>
          doc.types.includes(DocumenTypes.DECLARANT) ||
          doc.types.includes(DocumenTypes.SERVICE)
      )
    },
  },
  methods: {
    openUpdateDialog(row) {
      this.changedDocument = row
      this.updateDialog = true
    },
    documentUpdated(document) {
      const index = this.documents.findIndex((d) => d.id === document.id)
      if (index !== -1) {
        this.documents.splice(index, 1, document)
        this.updateDialog = false
      }
    },
    async deleteDocument(id) {
      try {
        await documentsStore.deleteDocument(id)
        this.$message.success('Документ успешна удалена')
        this.documents = this.documents.filter((doc) => doc.id != id)
      } catch (e) {}
    },
  },
}
</script>
<style>
.el-collapse-item__content {
  padding-bottom: 0px !important;
}
</style>
