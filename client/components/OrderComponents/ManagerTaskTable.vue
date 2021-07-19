<template>
  <el-table
    v-if="documents.length"
    border
    :data="documents"
    :row-class-name="tableRowClassName"
    size="mini"
  >
    <el-table-column type="expand">
      <template slot-scope="{ row }">
        <p>Кто дал: {{ row.creator && row.creator.name }}</p>
        <p>Создан: {{ row.createdAt | dateFormatter }}</p>
        <p>Заметка: {{ row.taskText }}</p>
      </template>
    </el-table-column>
    <el-table-column
      width="140"
      label="Документ"
      align="center"
      show-overflow-tooltip
    >
      <template slot-scope="{ row: { documentType } }">
        {{ documentType && `${documentType.number} - ${documentType.name}` }}
      </template>
    </el-table-column>
    <el-table-column
      width="150"
      label="Срок"
      align="center"
      show-overflow-tooltip
    >
      <template slot-scope="{ row: { expire } }" class="text-center">
        {{ expire | dateFormatter }}
      </template>
    </el-table-column>
    <el-table-column min-width="150" label="Файлы" align="center">
      <template slot-scope="{ row: { files } }">
        <span v-if="!files">-</span>
        <div v-else class="flex justify-center">
          <a
            v-for="(file, idx) in files"
            :key="idx"
            v-href="file"
            target="_blank"
            class="mr-2 flex justify-center max-h-12 p-1"
          >
            <img v-image="file" />&nbsp;
          </a>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      min-width="180"
      label="Сумма"
      align="center"
      prop="price"
      show-overflow-tooltip
    >
      <template slot-scope="{ row: { price } }">
        <div>
          <span v-for="(p, index) in price" :key="index">
            {{ p.price | numberFormatter }} {{ p.currency | getCurrency }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="100" label="Изменить" align="center">
      <template slot-scope="{ row: { status, id }, row }">
        <el-tooltip content="Готово" placement="top">
          <el-button
            v-if="
              status === DocumentStatus.TASK ||
              status === DocumentStatus.RETURNED
            "
            :loading="documentsStore.loading"
            type="success"
            size="mini"
            icon="el-icon-check"
            plain
            class="px-1.5 py-1"
            @click="updateStatus(DocumentStatus.DONE, id)"
          />
        </el-tooltip>
        <el-button
          v-if="status !== DocumentStatus.FINISHED"
          type="primary"
          size="mini"
          icon="el-icon-edit"
          plain
          class="px-1.5 py-1"
          @click="$emit('updateDocument', row)"
        />
        <el-popover
          v-if="row.returnText && status === DocumentStatus.RETURNED"
          placement="top-start"
          class="ml-1"
          width="200"
          trigger="hover"
          :content="row.returnText"
        >
          <el-button
            slot="reference"
            size="mini"
            type="text"
            icon="el-icon-info"
          />
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { documentsStore } from '~/store'
import { DocumentStatus } from '~/utils/data'
import { tableRowClassName } from '~/utils/order.util'

export default {
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      DocumentStatus,
      tableRowClassName,
      documentsStore,
    }
  },
  methods: {
    async updateStatus(status, id) {
      try {
        const data = {
          status,
          orderId: this.orderId,
        }
        console.log(`data`, data)
        const document = await documentsStore.updateDocument({
          id,
          data,
        })
        this.$emit('documentUpdated', document)
        this.$message.success('Документ успешно обновлен')
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
  },
}
</script>
