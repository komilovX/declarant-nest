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
        <p>Создан: {{ row.createdAt | dateFormatter }}</p>
        <p>Cоздатель: {{ row.creator && row.creator.name }}</p>
        <p>Заметка: {{ row.taskText }}</p>
      </template>
    </el-table-column>
    <el-table-column min-width="70" label="№" align="center">
      <template slot-scope="{ row: { documentType } }">
        {{ documentType && documentType.number }}
      </template>
    </el-table-column>
    <el-table-column min-width="80" label="Наименование" align="center">
      <template slot-scope="{ row: { documentType } }">
        {{ documentType && documentType.name }}
      </template>
    </el-table-column>
    <el-table-column
      min-width="150"
      label="Исполнитель"
      align="center"
      prop="declarant"
      show-overflow-tooltip
    >
      <template slot-scope="{ row: { declarant } }">
        {{ declarant && declarant.name }}
      </template>
    </el-table-column>
    <el-table-column min-width="80" label="Срок" align="center">
      <template slot-scope="{ row: { expire } }">
        {{ expire | dateFormatter }}
      </template>
    </el-table-column>
    <el-table-column min-width="150" label="Файл" align="center">
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
    <el-table-column min-width="100" label="Изменить" align="center">
      <template slot-scope="{ row: { id, status }, row }">
        <el-tooltip content="Возвращаться" placement="top">
          <el-button
            v-if="status === DocumentStatus.DONE"
            type="warning"
            size="mini"
            icon="el-icon-refresh-left"
            plain
            class="px-1.5 py-1"
            @click="updateStatus(DocumentStatus.RETURNED, id)"
          />
        </el-tooltip>
        <el-button
          :disabled="status !== DocumentStatus.TASK"
          type="primary"
          size="mini"
          icon="el-icon-edit"
          plain
          class="px-1.5 py-1"
          @click="$emit('updateDocument', row)"
        />
        <el-button
          :disabled="status !== DocumentStatus.TASK"
          :loading="documentsStore.loading"
          icon="el-icon-delete"
          size="mini"
          type="danger"
          plain
          class="px-1.5 py-1"
          @click="$emit('deleteDocument', id)"
        />
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
      tableRowClassName,
      DocumentStatus,
      documentsStore,
    }
  },
  methods: {
    updateStatus(status, id) {
      this.$prompt('Почему вы возвращаете этот документ', 'Подтверждение', {
        confirmButtonText: 'Отправить',
        cancelButtonText: 'Отменить',
      })
        .then(async ({ value }) => {
          const data = {
            status,
            orderId: this.orderId,
            returnText: value,
          }
          const document = await documentsStore.updateDocument({
            id,
            data,
          })
          this.$emit('documentUpdated', document)
          this.$message.success('Документ успешно обновлен')
        })
        .catch(() => {})
    },
  },
}
</script>
