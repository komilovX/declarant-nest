<template>
  <el-dialog
    title="Контракты"
    :visible.sync="visible"
    :before-close="onClose"
    class="w-24 md:w-auto"
  >
    <el-tree
      ref="tree"
      class="mt-4"
      :load="loadNode"
      :props="defaultProps"
      node-key="id"
      lazy
    >
      <div slot-scope="{ node, data, node: { label } }">
        <div v-if="node.level === 3">
          <div class="flex items-center">
            <span class="flex items-center mr-6">
              <span class="mr-2">{{ data.date | dateFormatter }}</span>
              <a v-href="label" target="_blank" class="mr-2">
                <img v-image="label" />
              </a>
            </span>
          </div>
        </div>
        <span v-else>{{ node.label }}</span>
      </div>
    </el-tree>
  </el-dialog>
</template>

<script>
import { contractStore } from '~/store'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      required: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
    shipperId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      contractStore,
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
      },
    }
  },
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        let documents = await this.contractStore.fetchContractsForOrder({
          clientId: this.clientId,
          shipperId: this.shipperId,
        })
        if (documents) {
          console.log(`documents`, documents)
          documents = documents.map((contract) => {
            return {
              name: `${contract.documentType.number} - ${contract.documentType.name}`,
              id: contract.documentTypeId,
              contractId: contract.id,
            }
          })
          return resolve(documents)
        }
      }
      if (node.level === 1) {
        const { contractId } = node.data
        const contract = await this.$axios.$get(
          `/contract?contractId=${contractId}`
        )
        console.log(`contract`, contract)
        const numbers = contract.map((data) => {
          return {
            name: data.number,
            id: data.id,
            files: data.files,
          }
        })

        resolve(numbers)
      }
      if (node.level === 2) {
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
