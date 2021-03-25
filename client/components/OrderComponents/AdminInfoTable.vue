<template>
  <div>
    <el-table
      border
      :data="serviceList"
      :row-class-name="tableRowClassName"
      size="mini"
      @row-dblclick="onRowDbClick"
    >
      <el-table-column width="60" label="№" align="center" prop="number" />
      <el-table-column
        width="120"
        label="Наименование"
        align="center"
        prop="name"
      />
      <el-table-column
        min-width="130"
        label="Исполнитель"
        align="center"
        prop="declarant"
      />
      <el-table-column min-width="100" label="Файл" align="center">
        <template slot-scope="{ row: { files } }">
          <span v-if="!files"></span>
          <div v-else>
            <a
              v-for="(f, idx) in files"
              :key="idx"
              :href="`/uploads/${f}`"
              target="_blank"
              style="color: #3a8ee6; padding: 0 2px; text-decoration: underline"
              ><img
                :src="`/file-images/${getFileFormat(f)}`"
                alt="File"
                width="25"
                height="20"
              /> </a
            >&nbsp;
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
              {{ numberFormatter(p.price) }}
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
              {{ numberFormatter(p.price) }}
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
              {{ numberFormatter(p.price) }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="Примечание"
        align="center"
        show-overflow-tooltip
        prop="comment"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    serviceList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.type == 'service') {
        return 'service-row'
      }
      if (row.type == 'declarant') {
        return 'declarant-row'
      }
      return ''
    },
    onRowDbClick(row) {
      if (this.user.userId == row.declarant_id) {
        this.$emit('document-clicked', row)
      } else {
        this.$message.info('Вы не можете редактировать этот документ')
      }
    },
  },
}
</script>
<style>
.el-table .service-row {
  background-color: rgba(252, 0, 0, 0.25);
}
.el-table .declarant-row {
  background-color: rgba(1, 69, 255, 0.2);
}
.el-table .task-row {
  background-color: rgba(248, 232, 85, 0.4);
}
</style>
<style lang="scss" scoped>
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
