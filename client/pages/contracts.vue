<template>
  <div>
    <app-header header-text="Контракты" @on-click="openContractDialog" />
    <el-card class="w-full">
      <el-input
        v-model="filterText"
        size="small"
        placeholder="Filter keyword"
        class="md:w-1/2 sm:w-full"
      />

      <el-tree
        ref="tree"
        class="mt-4"
        :load="loadNode"
        :props="defaultProps"
        node-key="id"
        lazy
        :filter-node-method="filterNode"
      >
        <div slot-scope="{ node, data, node: { label } }">
          <div v-if="node.level === 3">
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
                  <app-add-button @on-click="addContractNumber(data, node)" />
                </div>
                <el-button slot="reference" type="text" size="mini">
                  Добавить
                </el-button>
              </el-popover>
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
                  <app-add-button @on-click="addContractFile(data, node)" />
                </div>
                <el-button slot="reference" type="text" size="mini">
                  Добавить
                </el-button>
              </el-popover>
              <el-button
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
                <a v-href="label" target="_blank" class="mr-2">
                  <img v-image="label" />
                </a>
              </span>
              <el-button
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
      :visible="dialogVisible"
      :title="dialogTitle"
      :clients="dataStore.clients"
      :shippers="dataStore.shippers"
      :documents="documentTypeStore.documentTypes"
      :on-close="closeDialog"
    />
  </div>
</template>

<script>
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'
import AppHeader from '~/components/AppComponents/AppHeader.vue'
import CreateContractDialog from '~/components/DialogComponents/CreateContractDialog.vue'
import { dataStore, documentTypeStore, contractStore } from '~/store'

export default {
  components: { AppHeader, CreateContractDialog, AppAddButton },
  data() {
    return {
      dataStore,
      documentTypeStore,
      contractStore,
      dialogVisible: false,
      dialogTitle: 'Добавление контрактов',
      filterText: '',
      file: '',
      fileList: [],
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
    async openContractDialog() {
      try {
        await this.dataStore.fetchClients()
        await this.dataStore.fetchShippers()
        await this.documentTypeStore.fetchDocumentTypes()
        this.dialogVisible = true
      } catch (error) {}
    },
    closeDialog() {
      this.dialogVisible = false
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
    async addContractNumber(data, node) {
      try {
        const res = await this.contractStore.addContractNumber({
          id: data.contractId,
          number: this.contractNumber,
        })
        this.$refs.tree.append({ id: res.id, name: res.number }, node)
        this.contractNumber = ''
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
            { id: res.id, name: res.file, date: res.date, leaf: true },
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
            id: contract.documentTypeId,
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
            clientId: client.client.id,
          }
        })
        resolve(clients)
      }
      if (node.level === 2) {
        const { documentTypeId, clientId } = node.data
        let shippers = await this.$axios.$get(
          `/contract?documentTypeId=${documentTypeId}&clientId=${clientId}`
        )
        shippers = shippers.map((data) => {
          return {
            contractId: data.id,
            name: data.shipper.name,
          }
        })
        resolve(shippers)
      }
      if (node.level === 3) {
        const { contractId } = node.data
        const contract = await this.$axios.$get(
          `/contract?contractId=${contractId}`
        )
        const numbers = contract.map((data) => {
          return {
            name: data.number,
            id: data.id,
            files: data.files,
          }
        })
        resolve(numbers)
      }
      if (node.level === 4) {
        const files = node.data.files.map((data) => {
          return {
            name: data.file,
            id: data.id,
            date: data.date,
            leaf: true,
          }
        })
        resolve(files)
      }
    },
  },
}
</script>
