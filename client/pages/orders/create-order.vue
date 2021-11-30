<template>
  <div>
    <div class="flex items-center border-b border-gray-300 pb-2 mb-4">
      <i
        class="el-icon-arrow-left mr-4 text-blue-500 text-2xl font-xl cursor-pointer"
        @click="$router.back()"
      />
      <h2 class="text-xl font-medium">Cоздание заявки</h2>
    </div>
    <div class="form p1">
      <el-row :gutter="20" class="mb-8">
        <el-col :span="24" :md="22" :sm="24">
          <h3 class="text-lg mb-1">Входящие документы</h3>
          <el-table :data="filteredDocuments" size="small">
            <el-table-column
              min-width="90"
              label="№"
              align="center"
              prop="number"
            />
            <el-table-column
              min-width="110"
              label="Наименование"
              align="center"
              prop="name"
            />
            <el-table-column
              min-width="110"
              label="Номер"
              align="center"
              prop="price"
            >
              <template slot-scope="{ $index }">
                <el-input
                  v-model="filteredDocuments[$index].order"
                  size="mini"
                  type="text"
                  style="width: 60%"
                />
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              label="Цена"
              align="center"
              prop="price"
            >
              <template slot-scope="{ row: { needPrice }, $index }">
                <div v-if="needPrice" class="flex mr-1">
                  <el-input
                    v-model="filteredDocuments[$index].price"
                    size="mini"
                    style="min-width: 70px; margin-right: 4px"
                    type="text"
                  />
                  <el-select
                    v-model="filteredDocuments[$index].currency"
                    size="mini"
                  >
                    <el-option
                      v-for="s in currencyList"
                      :key="s.type"
                      :label="s.type"
                      :value="s.value"
                    />
                  </el-select>
                  <el-button
                    size="mini"
                    icon="el-icon-close"
                    class="fs-icon"
                    type="text"
                    @click="changePriceInputStatus($index)"
                  />
                </div>
                <el-button
                  v-else
                  size="small"
                  type="text"
                  class="mt-2"
                  @click="changePriceInputStatus($index)"
                >
                  Добавить
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="Загрузить файл" align="center">
              <template slot-scope="{ row: { number } }">
                <el-upload
                  action="https://localhost:3000"
                  :auto-upload="false"
                  :on-change="(file) => handleFileChange(file, number)"
                  :on-remove="handleFileRemove"
                >
                  <el-button
                    size="mini"
                    type="primary"
                    class="text-base px-2 py-0.5"
                    plain
                    icon="el-icon-upload"
                  />
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
          <app-add-button class="mt-4" @on-click="visibleDialog = true" />
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
          <el-col :span="12" :md="5" :sm="12">
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
                  class="w-full mr-2"
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
          <el-col :span="12" :md="5" :sm="12">
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
          <el-col></el-col>
          <el-col :span="12" :md="5" :sm="12">
            <el-form-item label="Грузоотправитель" prop="shipperId">
              <div class="flex">
                <el-select
                  v-model="ordersForm.shipperId"
                  filterable
                  size="small"
                  class="mr-2"
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
                  class="w-full mr-2"
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
          <el-col :span="12" :md="5" :sm="12" style="padding-left: 0">
            <el-form-item prop="declarantId" label="Исполнитель">
              <el-select
                v-model="ordersForm.declarantId"
                filterable
                size="small"
                class="w-full"
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
          <el-col class="mt-2">
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
        :on-close="() => (productDialogVisible = false)"
      />
      <!-- Dialog -->
      <el-dialog
        title="Загрузить"
        :visible.sync="visibleDialog"
        custom-class="w-11/12 md:w-1/2"
      >
        <el-table
          ref="multipleTable"
          :data="documents"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column width="150" label="№" align="center" prop="number" />
          <el-table-column label="Наименование" align="center" prop="name" />
        </el-table>
        <el-button
          :loading="ordersStore.loading"
          size="small"
          type="primary"
          class="mt-2"
          @click="addDocuments"
        >
          Добавить
        </el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import ShipperDialog from '@/components/DialogComponents/ShipperDialog.vue'
import CreateClientDialog from '~/components/DialogComponents/CreateClientDialog.vue'
import {
  dataStore,
  documentTypeStore,
  userStore,
  ordersStore,
  authStore,
} from '~/store'
import ProductDialog from '~/components/DialogComponents/ProductDialog.vue'
import { currencyList } from '~/utils/data'

export default {
  components: { ShipperDialog, CreateClientDialog, ProductDialog },
  middleware: ['admin-auth'],
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'orders')
      if (page && page.create) {
        return true
      }
      return false
    }
    return false
  },
  data: () => ({
    dataStore,
    documentTypeStore,
    userStore,
    ordersStore,
    currencyList,
    visibleDialog: false,
    clientDialogVisible: false,
    productDialogVisible: false,
    shipperDialogVisible: false,
    clientDirectors: [],
    filteredDocuments: [],
    multipleSelection: [],
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
      'clientDirectorId',
      'declarantId',
      'post_number',
      'shipperId',
    ]),
  }),
  async fetch() {
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
    } catch (error) {
      console.log(error)
    }
  },
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
    documents: {
      get() {
        return this.documentTypeStore.documentTypes.filter((doc) =>
          doc.types.includes('incoming')
        )
      },
      set(value) {
        this.documentTypeStore.setDocumentTypes(value)
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const fd = new FormData()
            Object.keys(this.ordersForm).forEach((key) => {
              fd.append(key, this.ordersForm[key])
            })
            const incomingDocuments = this.filteredDocuments.map((doc) => {
              return {
                documentTypeId: doc.id,
                number: doc.order,
                price: doc.price,
                currency: doc.currency,
              }
            })
            fd.append('documents', JSON.stringify(incomingDocuments))
            this.fileList.forEach((d) => {
              if (d) {
                fd.append('files', d.raw, d.name)
              }
            })
            await this.ordersStore.createOrder(fd)
            this.$message.success('Заявки успешна добавлена')
            this.$router.back()
          } catch (error) {
            console.log(error)
          }
        } else {
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePriceInputStatus(idx) {
      this.filteredDocuments[idx].needPrice = !this.filteredDocuments[idx]
        .needPrice
    },
    handleFileChange(file, number) {
      const type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf|csv|xls|xlsx/)
      if (idx == -1) {
        this.$message.error(
          'файлы толка с расширением png|jpeg|docx|doc|pdf|xls|xlsx '
        )
        return
      }
      file.name = `${number}-${file.name}`
      this.fileList.push(file)
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    addDocuments() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((d) => {
          this.filteredDocuments.push({
            id: d.id,
            number: d.number,
            name: d.name,
            order: null,
            price: null,
            currency: '$',
            needPrice: false,
          })
        })
        const documentIds = this.multipleSelection.map((p) => p.id)
        this.documents = this.documents.filter(
          (d) => !documentIds.includes(d.id)
        )
        this.visibleDialog = false
      } else {
        this.$message.info('No data')
      }
    },
    onClientSelectChange(clientId) {
      const client = dataStore.clients.find((c) => c.id === clientId)
      if (clientId) this.clientDirectors = client.directors
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
