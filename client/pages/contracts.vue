<template>
  <div>
    <div class="flex items-center">
      <h2 class="mr-2 text-lg font-medium">Документы</h2>
      <app-add-button
        v-role:create="'contracts'"
        size="mini"
        @on-click="openContractDialog"
      />
    </div>
    <hr class="my-2" />
    <el-card class="w-full">
      <el-tree
        v-if="show"
        ref="tree"
        class="mt-4"
        :load="loadNode"
        :props="defaultProps"
        node-key="id"
        lazy
        :filter-node-method="filterNode"
      >
        <div slot-scope="{ node, data, node: { label } }">
          <div v-if="node.level === 1">
            <span class="mr-4">{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="addContractClient(data, node)"
              >
                Добавить
              </el-button>
            </span>
            <el-button
              v-role:delete="'contracts'"
              class="ml-3"
              type="text"
              size="mini"
              @click="() => deleteContractDocument(node, data)"
            >
              Удалить
            </el-button>
          </div>
          <div v-else-if="node.level === 2">
            <span class="mr-4">{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="addContractShipper(data, node)"
              >
                Добавить
              </el-button>
            </span>
            <el-button
              v-role:delete="'contracts'"
              class="ml-3"
              type="text"
              size="mini"
              @click="() => deleteContractClient(node, data)"
            >
              Удалить
            </el-button>
          </div>
          <div v-else-if="node.level === 3">
            <span class="mr-4">{{ node.label }}</span>
            <span>
              <el-popover placement="right" width="300" trigger="click">
                <div>
                  <el-input
                    v-model="contractNumber"
                    size="mini"
                    class="mb-2"
                    type="text"
                  />
                  <app-add-button
                    v-role:create="'contracts'"
                    @on-click="addContractNumber(data, node)"
                  />
                </div>
                <el-button slot="reference" type="text" size="mini">
                  Добавить
                </el-button>
              </el-popover>
              <el-button
                v-role:delete="'contracts'"
                class="ml-3"
                type="text"
                size="mini"
                @click="() => deleteContractShipper(node, data)"
              >
                Удалить
              </el-button>
            </span>
          </div>
          <div v-else-if="node.level === 4" class="flex items-center">
            <span class="mr-6">{{ node.label }}</span>
            <span>
              <el-popover placement="right" width="300" trigger="click">
                <div>
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :auto-upload="false"
                    :on-change="onFileChange"
                    :file-list="fileList"
                    :limit="1"
                    class="mb-4"
                  >
                    <el-button size="small" type="primary"
                      >Загрузить файл</el-button
                    >
                  </el-upload>
                  <app-add-button
                    v-role:create="'contracts'"
                    @on-click="addContractFile(data, node)"
                  />
                </div>
                <el-button slot="reference" type="text" size="mini">
                  Добавить
                </el-button>
              </el-popover>
              <el-button
                v-role:delete="'contracts'"
                class="ml-3"
                type="text"
                size="mini"
                @click="() => deleteContractNumber(node, data)"
              >
                Удалить
              </el-button>
            </span>
          </div>
          <div v-else-if="node.level === 5">
            <div class="flex items-center">
              <span class="flex items-center mr-6">
                <span class="mr-2">{{ data.date | dateFormatter }}</span>
                <span class="mr-2 overflow-text" :title="data.fileName">{{
                  data.fileName
                }}</span>
                <a v-href="label" target="_blank" class="mr-2">
                  <img v-image="label" />
                </a>
              </span>
              <el-button
                v-role:delete="'contracts'"
                class="ml-2"
                type="text"
                size="mini"
                @click="() => deleteContractFile(node, data)"
              >
                Удалить
              </el-button>
            </div>
          </div>
          <span v-else>{{ node.label }}</span>
        </div>
      </el-tree>
    </el-card>
    <create-contract-dialog
      :visible="contractDialogVisible"
      :on-close="() => (contractDialogVisible = false)"
      :documents="documentTypeStore.documentTypes"
      @contractDocumentAdded="reload"
    />
    <create-contract-client
      :visible="contractClientVisible"
      :on-close="() => (contractClientVisible = false)"
      :clients="dataStore.clients"
      :documentTypeId="documentTypeId"
      @contractClientAdded="reload"
    />
    <create-contract-shipper
      :visible="contractShipperVisible"
      :on-close="() => (contractShipperVisible = false)"
      :shippers="dataStore.shippers"
      :clientId="clientId"
      @contractShipperForm="reload"
    />
  </div>
</template>

<script>
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'
import CreateContractDialog from '~/components/DialogComponents/CreateContractDialog.vue'
import CreateContractClient from '~/components/DialogComponents/CreateContractClient.vue'
import CreateContractShipper from '~/components/DialogComponents/CreateContractShipper.vue'
import { dataStore, documentTypeStore, contractStore, authStore } from '~/store'

export default {
  components: {
    CreateContractDialog,
    AppAddButton,
    CreateContractClient,
    CreateContractShipper,
  },
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'contracts')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data() {
    return {
      dataStore,
      documentTypeStore,
      contractStore,
      contractDialogVisible: false,
      contractClientVisible: false,
      contractShipperVisible: false,
      documentTypeId: -1,
      clientId: -1,
      filterText: '',
      file: '',
      show: true,
      fileList: [],
      currentNode: {},
      contractNumber: '',
      contractData: [],
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.includes(value)
    },
    reload() {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    async openContractDialog() {
      try {
        await this.documentTypeStore.fetchDocumentTypes()
        this.contractDialogVisible = true
      } catch (error) {}
    },
    onFileChange(file) {
      if (!file.name.match(/\.(jpg|jpeg|png|pdf|doc|docx|ppt|pptx)$/)) {
        this.$message.error('Разрешены только файлы изображений и документов!')
        this.fileList = []
        return
      }
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isLt4M) {
        this.$message.error('Размер файла не может превышать 4 МБ!')
        this.fileList = []
        return
      }
      this.file = file.raw
    },
    async addContractNumber(data) {
      try {
        await this.contractStore.addContractNumber({
          shipperId: data.shipperId,
          number: this.contractNumber,
        })
        this.$message.success('Добавлен')
        this.reload()
      } catch (error) {
        console.log(error)
      }
    },
    async addContractClient(data) {
      try {
        await this.dataStore.fetchClients()
        this.documentTypeId = data.id
        this.contractClientVisible = true
      } catch (error) {
        console.log(error)
      }
    },
    async addContractShipper(data) {
      try {
        await this.dataStore.fetchShippers()
        this.clientId = data.clientId
        this.contractShipperVisible = true
      } catch (error) {
        console.log(error)
      }
    },
    deleteContractNumber(node, data) {
      this.$confirm('Уверены, что хотите удалить этот файл?', 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.contractStore.deleteContractNumber(data.id)
            this.$refs.tree.remove(node)
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    deleteContractDocument(node, data) {
      this.$confirm(
        'Уверены, что хотите удалить этот документ?',
        'Подтверждение',
        {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await this.contractStore.deleteContractDocument(data.id)
            this.$refs.tree.remove(node)
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    deleteContractClient(node, data) {
      this.$confirm(
        'Уверены, что хотите удалить этот клиент?',
        'Подтверждение',
        {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await this.contractStore.deleteContractClient(data.clientId)
            this.$refs.tree.remove(node)
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    deleteContractShipper(node, data) {
      this.$confirm(
        'Уверены, что хотите удалить этот грузоотправител?',
        'Подтверждение',
        {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await this.contractStore.deleteContractShipper(data.shipperId)
            this.$refs.tree.remove(node)
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    deleteContractFile(node, data) {
      this.$confirm(
        'Уверены, что хотите удалить этот номер?',
        'Подтверждение',
        {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await this.contractStore.deleteContractFile(data.id)
            this.$refs.tree.remove(node)
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {})
    },
    async addContractFile(data, node) {
      if (this.file) {
        try {
          const res = await this.contractStore.addContractFile({
            id: data.id,
            file: this.file,
          })
          this.file = null
          this.fileList = []
          this.$refs.tree.append(
            {
              id: res.id,
              name: res.file,
              fileName: res.name,
              date: res.date,
              leaf: true,
            },
            node
          )
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$message.error('Файл не выбран')
      }
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        if (!this.contractStore.contracts.length) {
          await this.contractStore.fetchContracts()
        }
        const documents = this.contractStore.contracts.map((contract) => {
          return {
            name: `${contract.documentType.number} - ${contract.documentType.name}`,
            id: contract.id,
          }
        })
        return resolve(documents)
      }
      if (node.level === 1) {
        let clients = await this.$axios.$get(
          `/contract?documentTypeId=${node.data.id}`
        )
        clients = clients.map((client) => {
          return {
            name: client.client.name,
            documentTypeId: client.documentTypeId,
            clientId: client.id,
          }
        })
        resolve(clients)
      }
      if (node.level === 2) {
        const { clientId } = node.data
        let shippers = await this.$axios.$get(`/contract?clientId=${clientId}`)
        shippers = shippers.map((data) => {
          return {
            shipperId: data.id,
            name: data.shipper.name,
            numbers: data.numbers,
          }
        })
        resolve(shippers)
      }
      if (node.level === 3) {
        const { numbers } = node.data
        const contractNumbers = numbers.map((data) => {
          return {
            name: data.number,
            id: data.id,
            files: data.files,
          }
        })
        resolve(contractNumbers)
      }
      if (node.level === 4) {
        const files = node.data.files.map((data) => {
          return {
            name: data.file,
            id: data.id,
            date: data.date,
            fileName: data.name,
            leaf: true,
          }
        })
        resolve(files)
      }
    },
  },
}
</script>
