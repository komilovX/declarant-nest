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
            <decorated-document
              :decorated-documents="decoratedDocuments"
              :order_id="Number($route.params.id)"
              :documentTpes="decoratedDocumentTypes"
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
        <declarant-task-form />
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
} from '~/store'
import { DocumenTypes } from '~/utils/enums'
import DecoratedDocument from '~/components/OrderComponents/DecoratedDocument.vue'
import DeclarantTaskForm from '~/components/OrderComponents/DeclarantTaskForm.vue'

export default {
  components: {
    OrderInfo,
    AdminFileTable,
    DecoratedDocument,
    DeclarantTaskForm,
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
      if (!userStore.users.length) {
        await userStore.fetchUsers()
      }
      return { order, documents, orderPrice }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      documentTypeStore,
      documentsStore,
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
    decoratedDocumentTypes() {
      return this.documentTypeStore.documentTypes.filter((doc) =>
        doc.types.includes(DocumenTypes.DECORATED)
      )
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
        await this.$axios.$put(`api/orders/${this.order.id}/archive`)
        this.$router.push('/orders')
      } catch (e) {
        this.finishLoading = false
        console.log(e)
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
