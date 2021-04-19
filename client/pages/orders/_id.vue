<template>
  <div>
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-xl font-medium">Редактирование</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20" class="mb-8">
        <el-col :span="24" :md="22" :sm="24">
          <h3 class="text-lg mb-1">Входящие документы</h3>
          <el-table :data="documents" size="small">
            <el-table-column min-width="70" label="№" align="center">
              <template slot-scope="{ row: { documentType } }">
                {{ documentType.number }}
              </template>
            </el-table-column>
            <el-table-column min-width="80" label="Наименование" align="center">
              <template slot-scope="{ row: { documentType } }">
                {{ documentType.name }}
              </template>
            </el-table-column>
            <el-table-column
              min-width="80"
              label="Номер"
              align="center"
              prop="price"
            >
              <template slot-scope="{ $index }">
                <el-input
                  v-model="documents[$index].number"
                  size="mini"
                  type="text"
                />
              </template>
            </el-table-column>
            <el-table-column
              min-width="130"
              label="Цена"
              align="center"
              prop="price"
            >
              <template slot-scope="{ row: { needPrice, price } }">
                <div v-if="needPrice" class="flex mr-1">
                  <el-input
                    v-model="price[0].price"
                    size="mini"
                    style="min-width: 80px; margin-right: 4px"
                    type="number"
                  />
                  <el-select
                    v-model="price[0].currency"
                    placeholder="Валюта"
                    size="mini"
                  >
                    <el-option
                      v-for="s in currencyList"
                      :key="s.value"
                      :label="s.type"
                      :value="s.value"
                    />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="120" label="Файл" align="center">
              <template
                slot-scope="{ row: { files }, row }"
                class="flex justify-center"
              >
                <span v-if="!files">-</span>
                <div v-else>
                  <div
                    v-for="(file, idx) in files"
                    :key="idx"
                    class="flex justify-center"
                  >
                    <a
                      v-href="file"
                      target="_blank"
                      class="flex justify-center max-h-12"
                    >
                      <img v-image="file" />&nbsp;
                    </a>
                    <el-button
                      type="text"
                      icon="el-icon-close"
                      style="color: red"
                      class="p-0"
                      @click="deleteDocumentFile(row, file)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="Загрузить" align="center">
              <template slot-scope="{ row: { number }, row }">
                <el-upload
                  :ref="`fileUpload${number}`"
                  action="https://localhost:3000"
                  :auto-upload="false"
                  :on-change="(file) => handleFileChange(file, row)"
                  :on-remove="(file) => handleFileRemove(file)"
                >
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    class="text-base px-2 py-0.5"
                    icon="el-icon-upload"
                  />
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="Действия" align="center">
              <template slot-scope="{ row: { id }, row }">
                <el-button
                  size="mini"
                  type="success"
                  plain
                  icon="el-icon-check"
                  class="px-1.5 py-1"
                  :loading="ordersStore.loading"
                  @click="updateIncomingDocument(row)"
                />
                <el-button
                  size="mini"
                  type="danger"
                  :loading="documentsStore.loading"
                  plain
                  icon="el-icon-delete"
                  class="px-1.5 py-1"
                  @click="deleteDocument(id)"
                />
              </template>
            </el-table-column>
          </el-table>
          <app-add-button class="mt-2" @on-click="incomingDialog = true" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form
          ref="ordersForm"
          class="orders-form"
          :model="ordersForm"
          status-icon
          :rules="rules"
          label-width="160px"
          label-position="top"
        >
          <el-col :span="24" :md="24">
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Дата" prop="date">
                <el-date-picker
                  v-model="ordersForm.date"
                  size="small"
                  disabled
                  type="date"
                  placeholder="Pick a day"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="4" :sm="12">
              <el-form-item label="Пост номер" prop="post_number">
                <el-input
                  v-model="ordersForm.post_number"
                  size="small"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Дата прибытие" prop="date_income">
                <el-date-picker
                  v-model="ordersForm.date_income"
                  size="small"
                  type="date"
                  placeholder="Pick a day"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Клиент фирма" prop="clientId">
                <div class="flex">
                  <el-select
                    v-model="ordersForm.clientId"
                    filterable
                    size="small"
                    style="width: 100%; flex-grow: 1"
                    placeholder="Клиент фирма"
                    @change="onClientSelectChange"
                  >
                    <el-option
                      v-for="(c, index) in dataStore.clients"
                      :key="index"
                      :label="c.name"
                      :value="c.id"
                    />
                  </el-select>
                  <el-tooltip
                    v-if="ordersForm.client"
                    effect="dark"
                    :content="getClientInfo"
                    placement="bottom-end"
                    style="margin: 0 4px"
                  >
                    <i class="el-icon-info" />
                  </el-tooltip>
                  <el-button
                    size="mini"
                    icon="el-icon-circle-plus"
                    class="fs-icon text-lg"
                    type="text"
                    @click="clientDialogVisible = true"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="4" :sm="12">
              <el-form-item label="Клиент владелец" prop="clientDirectorId">
                <el-select
                  v-model="ordersForm.clientDirectorId"
                  filterable
                  size="small"
                  style="width: 100%; flex-grow: 1"
                  placeholder="Клиент владелец"
                >
                  <el-option
                    v-for="(c, index) in clientDirectors"
                    :key="index"
                    :label="c.name"
                    :value="c.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" :md="20">
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Грузоотправитель" prop="shipperId">
                <div class="flex">
                  <el-select
                    v-model="ordersForm.shipperId"
                    filterable
                    size="small"
                    style="width: 100%; flex-grow: 1"
                    placeholder="Грузоотправитель"
                  >
                    <el-option
                      v-for="(c, index) in dataStore.shippers"
                      :key="index"
                      :label="c.name"
                      :value="c.id"
                    />
                  </el-select>
                  <el-button
                    size="mini"
                    icon="el-icon-circle-plus"
                    class="fs-icon text-lg"
                    type="text"
                    @click="shipperDialogVisible = true"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Номер контейнера" prop="container">
                <el-input
                  v-model="ordersForm.container"
                  size="small"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item label="Название товара" prop="productId">
                <div class="flex">
                  <el-select
                    v-model="ordersForm.productId"
                    filterable
                    size="small"
                    style="width: 100%; flex-grow: 1"
                    placeholder="Название товара"
                  >
                    <el-option
                      v-for="(c, index) in dataStore.products"
                      :key="index"
                      :label="c.name"
                      :value="c.id"
                    />
                  </el-select>
                  <el-button
                    size="mini"
                    icon="el-icon-circle-plus"
                    class="fs-icon text-lg"
                    type="text"
                    @click="productDialogVisible = true"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" :md="5" :sm="12">
              <el-form-item prop="declarantId" label="Исполнитель">
                <el-select
                  v-model="ordersForm.declarantId"
                  filterable
                  size="small"
                >
                  <el-option
                    v-for="s in userStore.users"
                    :key="s.id"
                    :label="s.name"
                    :value="s.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item id="submit-button">
                <el-button
                  size="small"
                  type="success"
                  :loading="ordersStore.loading"
                  @click="submitForm('ordersForm')"
                  >Сохранить</el-button
                >
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
      <create-client-dialog
        :visible="clientDialogVisible"
        :on-close="() => (clientDialogVisible = false)"
        @clinetAdded="clients.push($event)"
      />
      <shipper-dialog
        :visible="shipperDialogVisible"
        :shippers="dataStore.shippers"
        :on-close="() => (shipperDialogVisible = false)"
      />
      <product-dialog
        :visible="productDialogVisible"
        :products="dataStore.products"
        :loading="dataStore.loading"
        :on-close="() => (productDialogVisible = false)"
      />
      <add-incoming-document
        :documents="incomingDocuments"
        :visible="incomingDialog"
        :on-close="() => (incomingDialog = false)"
        :order_id="order.id"
        @documentAdded="incomingDocumentAdded($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import ShipperDialog from '@/components/DialogComponents/ShipperDialog.vue'
import CreateClientDialog from '~/components/DialogComponents/CreateClientDialog.vue'
import ProductDialog from '~/components/DialogComponents/ProductDialog.vue'
import AddIncomingDocument from '~/components/DialogComponents/AddIncomingDocument.vue'
import { currencyList } from '~/utils/data'

import {
  dataStore,
  documentTypeStore,
  userStore,
  ordersStore,
  documentsStore,
  authStore,
} from '~/store'

export default {
  components: {
    ShipperDialog,
    CreateClientDialog,
    ProductDialog,
    AddIncomingDocument,
  },
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'orders')
      if (page && page.update) {
        return true
      }
      return false
    }
    return false
  },
  async asyncData({ route }) {
    try {
      if (!dataStore.clients.length) {
        await dataStore.fetchClients()
      }
      if (!dataStore.shippers.length) {
        await dataStore.fetchShippers()
      }
      if (!dataStore.products.length) {
        await dataStore.fetchProducts()
      }
      if (!documentTypeStore.documentTypes.length) {
        await documentTypeStore.fetchDocumentTypes()
      }
      if (!userStore.users.length) {
        await userStore.fetchUsers()
      }
      const { documents, order } = await ordersStore.findOrderById(
        route.params.id
      )
      const incomingDocuments = documents.map((d) => ({
        ...d,
        price: d.price.length ? d.price : [{ price: '', currency: '' }],
        needPrice: !!d.price,
      }))
      return { documents: incomingDocuments, order }
    } catch (error) {
      console.log(error)
    }
  },
  data: () => ({
    dataStore,
    documentTypeStore,
    documentsStore,
    userStore,
    ordersStore,
    currencyList,
    incomingDialog: false,
    clientDialogVisible: false,
    productDialogVisible: false,
    shipperDialogVisible: false,
    filteredDocuments: [],
    multipleSelection: [],
    clientDirectors: [],
    fileList: [],
    ordersForm: {
      date: new Date(),
      date_income: new Date(),
      container: '',
      clientId: '',
      clientDirectorId: '',
      shipperId: '',
      productId: '',
      post_number: '',
      declarantId: '',
    },
    rules: mapRulesByValue([
      'date_income',
      'container',
      'productId',
      'clientId',
      'declarantId',
      'post_number',
      'shipperId',
    ]),
  }),
  computed: {
    getClientInfo() {
      const client = this.clients.find(
        (c) => c.name == this.ordersForm.client_company
      )
      return client
        ? `${client.name} ${client.info} ${client.date} `
        : 'No selected client'
    },
    getDeclarants() {
      if (this.isAdmin) {
        return this.declarants
      } else {
        return this.declarants.filter(({ id }) => id == this.user.userId)
      }
    },
    incomingDocuments() {
      const documents = this.documents.map((d) => d.documentType.number)
      return documentTypeStore.documentTypes.filter(
        (d) => !documents.includes(d.number)
      )
    },
  },
  beforeMount() {
    this.ordersForm.date = this.order.date
    this.ordersForm.date_income = this.order.date_income
    this.ordersForm.container = this.order.container
    this.ordersForm.post_number = this.order.post_number
    this.ordersForm.clientId = this.order.client?.id
    this.ordersForm.shipperId = this.order.shipper?.id
    this.ordersForm.declarantId = this.order.declarant?.id
    this.ordersForm.productId = this.order.product?.id
    this.clientDirectors = this.order.client?.directors
    this.ordersForm.clientDirectorId = this.order.clientDirector?.id
  },
  methods: {
    async deleteDocument(id) {
      try {
        await documentsStore.deleteDocument(id)
        this.$message.success('Документ успешна удалена')
        this.documents = this.documents.filter((doc) => doc.id != id)
      } catch (e) {}
    },
    async deleteDocumentFile(row, file) {
      try {
        await documentsStore.deleteDocumentFile({ id: row.id, file })
        this.$message.success('Файл успешна удалена')
        row.files = row.files.filter((f) => f !== file)
      } catch (e) {
        console.log(e)
      }
    },
    incomingDocumentAdded(document) {
      this.documents.push(document)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await this.ordersStore.updateOrder({
              id: this.order.id,
              data: this.ordersForm,
            })
            this.$message.success('Заявки успешна обнавлена')
            this.$router.back()
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    async handleFileChange(file, row) {
      const type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf|csv|xls|xlsx/)
      if (idx == -1) {
        this.$message.error(
          'файлы толка с расширением png|jpeg|docx|doc|pdf|xls|xlsx '
        )
        return
      }
      try {
        const fd = new FormData()
        fd.append('file', file.raw, file.name)
        const newFile = await this.documentsStore.addDocumentFile({
          id: row.id,
          fd,
        })
        this.$message.success('Файл успешна добавлена')
        this.$refs[`fileUpload${row.number}`].clearFiles()
        row.files.push(newFile)
        return
      } catch (error) {
        console.log(error)
      }
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    async updateIncomingDocument(row) {
      try {
        await this.documentsStore.updateDocument({
          id: row.id,
          data: row,
        })
        this.$message.success('Заявки успешна обнавлена')
      } catch (error) {
        console.log(error)
      }
    },
    onClientSelectChange(clientId) {
      const client = dataStore.clients.find((c) => c.id === clientId)
      if (clientId) this.clientDirectors = client.directors
      this.ordersForm.clientDirectorId = null
    },
  },
}
</script>
<style>
.orders-form .el-form-item {
  margin-bottom: 10px !important;
}
.orders-form .el-form-item__label {
  padding: 0 !important;
  font-size: 11px;
}
.orders-form .el-date-editor {
  width: auto !important;
}
</style>
