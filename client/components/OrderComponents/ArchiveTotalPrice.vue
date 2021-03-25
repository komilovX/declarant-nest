<template>
  <div>
    <table class="table">
      <thead v-if="header">
        <tr>
          <th></th>
          <th>Сумма НЦ</th>
          <th>Сумма Капуста</th>
          <th>Сумма перечес</th>
        </tr>
      </thead>
      <tr>
        <th style="width: 180px">ИТОГО</th>
        <td style="width: 150px">{{ price.sum | numberFormatter }}</td>
        <td style="width: 150px">{{ price.dollar | numberFormatter }}</td>
        <td style="width: 150px">{{ invoice | numberFormatter }}</td>
      </tr>
      <tr>
        <th>Приход</th>
        <td>{{ comingSum | numberFormatter }}</td>
        <td>{{ comingDollar | numberFormatter }}</td>
        <td>{{ comingInvoice | numberFormatter }}</td>
      </tr>
      <tr>
        <th>Сальдо</th>
        <td>{{ saldoSum | numberFormatter }}</td>
        <td>{{ saldoDollar | numberFormatter }}</td>
        <td>{{ saldoInvoice | numberFormatter }}</td>
      </tr>
      <tr>
        <th>
          TOTAL KAPUSTA <br />
          KURS {{ course | numberFormatter }}
        </th>
        <td colspan="3" style="font-weight: bold">
          {{ totalPrice | numberFormatter }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    price: {
      type: Object,
      default: () => ({ dollar: 0, sum: 0, invoice: 0 }),
    },
    price_info: {
      type: Object,
      default: () => ({}),
    },
    header: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      course: null,
      percent: null,
      comingSum: 0,
      comingDollar: 0,
      comingInvoice: 0,
    }
  },
  computed: {
    invoice() {
      const percent = +this.percent ? this.percent : 1
      return this.price.invoice / percent
    },
    saldoSum() {
      return this.price.sum - this.comingSum
    },
    saldoDollar() {
      return this.price.dollar - this.comingDollar
    },
    saldoInvoice() {
      return this.invoice - this.comingInvoice
    },
    totalPrice() {
      const course = +this.course ? this.course : 1
      return (
        this.saldoSum / course + this.saldoDollar + this.saldoInvoice / course
      )
    },
  },
  mounted() {
    const {
      course = null,
      percent = null,
      comingSum = 0,
      comingDollar = 0,
      comingInvoice = 0,
    } = this.price_info
    this.course = course
    this.percent = percent
    this.comingSum = comingSum
    this.comingDollar = comingDollar
    this.comingInvoice = comingInvoice
  },
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  border-spacing: 0px;
  border-spacing: 2px;
  background: #95f06e;
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
  min-width: 130px;
}
.inputs {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
  .df {
    align-items: center;
  }
  label {
    margin-right: 5px;
  }
}
</style>
