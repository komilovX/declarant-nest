<template>
  <div class="printArea">
    <table class="table">
      <tr>
        <th style="width: 60px">№</th>
        <th style="width: 120px">Наименование</th>
        <th style="width: 150px">Сумма НЦ</th>
        <th style="width: 150px">Сумма Капуста</th>
        <th style="width: 150px">Сумма перечес</th>
      </tr>
      <tr v-for="(document, index) in serviceList" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ document.name }}</td>
        <td>
          <span v-for="(p, ind) in document.price" :key="ind">
            <span v-if="p.currency === 'sum'">
              {{ p.price | numberFormatter) }}
            </span>
          </span>
        </td>
        <td>
          <span v-for="(p, ind) in document.price" :key="ind">
            <span v-if="p.currency === '$'">
              {{ p.price | numberFormatter }}
            </span>
          </span>
        </td>
        <td>
          <span v-for="(p, ind) in document.price" :key="ind">
            <span v-if="p.currency === 'invoice'">
              {{ p.price | numberFormatter }}
            </span>
          </span>
        </td>
      </tr>
    </table>
    <archive-total-price :price="price" :price_info="price_info" />
  </div>
</template>
<script>
import ArchiveTotalPrice from './ArchiveTotalPrice.vue'
export default {
  components: { ArchiveTotalPrice },
  props: {
    serviceList: {
      type: Array,
      default: () => [],
    },
    price: {
      type: Object,
      default: () => ({}),
    },
    price_info: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    tableRowClassName({ row, _rowIndex }) {
      if (row.type == 'service') {
        return 'service-row'
      }
      if (row.type == 'declarant') {
        return 'declarant-row'
      }
      return ''
    },
    print() {
      window.print()
    },
  },
}
</script>
<style>
.printArea {
  display: none;
}
@media print {
  body * {
    height: 0;
  }
  .printArea {
    visibility: visible;
    display: block;
    background-color: white;
    min-height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    font-size: 14px;
    line-height: 18px;
    z-index: 100000;
  }
}
</style>
<style lang="scss" scoped>
.printArea table {
  border-collapse: collapse;
  border-spacing: 0px;
  border-spacing: 2px;
  color: #606266;
  font-size: 12px;
}
table,
td,
th {
  border: 1px solid #ebeef5;
}
td,
th {
  padding: 10px;
  text-align: center;
}
.total-sum {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
}
</style>
