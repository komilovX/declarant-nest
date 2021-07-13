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
              <span class="mr-2 overflow-text" :title="data.fileName">{{
                data.fileName
              }}</span>
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
// import groupBy from 'lodash.groupby'
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
        // const doc = groupBy(documents, (val) => {
        //   return val.document.documentType.id
        // })
        const doc = documents.map((doc) => {
          const numbers = doc.shippers[0] ? doc.shippers[0].numbers : []
          return {
            documentType: doc.document.documentType,
            numbers,
          }
        })
        console.log(`doc`, doc)
        if (doc) {
          documents = doc.map((d) => {
            return {
              name: `${d.documentType.number} - ${d.documentType.name}`,
              id: d.id,
              numbers: d.numbers,
            }
          })
          return resolve(documents)
        }
      }
      if (node.level === 1) {
        const { numbers } = node.data
        const data = numbers.map((data) => {
          return {
            name: data.number,
            id: data.id,
            files: data.files,
          }
        })

        resolve(data)
      }
      if (node.level === 2) {
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
