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
            <admin-file-table :documents="decoratedDocuments" />
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" class="mb-2 mt-6">
        <div>
          <h4 class="text-lg font-medium">Необходимые документы</h4>
          <div
            class="p-2 bg-white flex justify-between items-center inline-block"
          >
            <order-task-statuses />
            <el-button type="text" @click="contractDialog = true"
              >Контракты</el-button
            >
          </div>
        </div>
        <manager-task-table
          :documents="declarantDocuments"
          :orderId="order.id"
          @updateDocument="openUpdateDialog($event)"
          @documentUpdated="documentUpdated($event)"
        />
        <update-manager-task
          :visible="updateDialog"
          :document="changedDocument"
          :orderId="order.id"
          :onClose="() => (updateDialog = false)"
          @fileAdded="fileAdded($event)"
          @fileRemoved="fileRemoved($event)"
          @documentUpdated="documentUpdated"
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
import UpdateManagerTask from '~/components/DialogComponents/UpdateManagerTask.vue'
import ManagerTaskTable from '~/components/OrderComponents/ManagerTaskTable.vue'

export default {
  components: {
    OrderInfo,
    AdminFileTable,
    UpdateManagerTask,
    ManagerTaskTable,
  },
  async asyncData({ route, error }) {
    try {
      const { documents, ...order } = await ordersStore.findOrderByUserDocument(
        route.params.id
      )
      if (!documentTypeStore.documentTypes.length) {
        await documentTypeStore.fetchDocumentTypes()
      }
      if (!userStore.users.length) {
        await userStore.fetchUsers()
      }
      return { order, documents }
    } catch (err) {
      error(err)
    }
  },
  data() {
    return {
      documentTypeStore,
      documentsStore,
      updateDialog: false,
      contractDialog: false,
      changedDocument: {},
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
          doc.creator?.id !== authStore.user.id
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
    fileAdded(file) {
      const document = this.documents.find(
        (d) => d.id === this.changedDocument.id
      )
      if (document) {
        document.files ? document.files.push(file) : (document.files = [file])
      }
    },
    fileRemoved(file) {
      const document = this.documents.find(
        (d) => d.id === this.changedDocument.id
      )
      if (document) {
        document.files = document.files.filter((f) => f !== file)
      }
    },
  },
}
</script>
<style>
.el-collapse-item__content {
  padding-bottom: 0px !important;
}
</style>
