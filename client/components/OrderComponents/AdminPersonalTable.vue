<template>
  <div>
    <el-table
      border
      :data="documents"
      :row-class-name="tableRowClassName"
      size="mini"
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <p>Создан: {{ row.createdAt | dateFormatter }}</p>
          <p>Cоздатель: {{ row.creator && row.creator.name }}</p>
          <p>Примечание: {{ row.comment }}</p>
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
      <el-table-column min-width="100" label="Файл" align="center">
        <template slot-scope="{ row: { files } }">
          <span v-if="!files"></span>
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
        min-width="100"
        label="Сумма НЦ"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price } }">
          <span v-for="(p, index) in price" :key="index">
            <span v-if="p.currency === 'sum'">
              {{ p.price | numberFormatter }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        label="Сумма Капуста"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price } }">
          <span v-for="(p, index) in price" :key="index">
            <span v-if="p.currency === '$'">
              {{ p.price | numberFormatter }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
        label="Перечисление"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price } }">
          <span v-for="(p, index) in price" :key="index">
            <span v-if="p.currency === 'invoice'">
              {{ p.price | numberFormatter }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="Изменить" align="center">
        <template v-if="button" slot-scope="{ row }">
          <el-button
            v-if="row.creator.id === authStore.user.id"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            plain
            class="px-1.5 py-1"
            @click="$emit('updateDocument', row)"
          />
          <el-button
            v-if="row.creator.id === authStore.user.id"
            :loading="documentsStore.loading"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            plain
            class="px-1.5 py-1"
            @click="$emit('deleteDocument', row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { authStore, documentsStore } from '~/store'
import { tableRowClassName } from '~/utils/order.util'

export default {
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    button: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tableRowClassName,
      documentsStore,
      authStore,
    }
  },
  computed: {
    user() {
      return authStore.user
    },
  },
}
</script>
<style lang="scss" scoped>
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
