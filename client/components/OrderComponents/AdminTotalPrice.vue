<template>
  <div class="container mt-4">
    <div class="inputs flex">
      <div class="flex mr-2">
        <label for="kurs" class="font-medium">Курс: </label>
        <el-input id="kurs" v-model="course" size="mini" type="number" />
      </div>
      <div class="flex mr-2">
        <label for="persent" class="font-medium">Коефициент: </label>
        <el-input id="persent" v-model="percent" size="mini" type="number" />
      </div>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-refresh"
        circle
        plain
        @click="updateAndReload"
      />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Сумма НЦ</th>
          <th>Сумма Капуста</th>
          <th>Сумма перечес</th>
        </tr>
      </thead>
      <tr>
        <th style="width: 100px">ИТОГО</th>
        <td>{{ price.sum | numberFormatter }}</td>
        <td>{{ price.dollar | numberFormatter }}</td>
        <td>{{ invoice | numberFormatter }}</td>
      </tr>
      <tr>
        <th>Приход</th>
        <td><el-input v-model="comingSum" size="mini" type="number" /></td>
        <td><el-input v-model="comingDollar" size="mini" type="number" /></td>
        <td><el-input v-model="comingInvoice" size="mini" type="number" /></td>
      </tr>
      <tr>
        <th>Сальдо</th>
        <td>{{ saldoSum | numberFormatter }}</td>
        <td>{{ saldoDollar | numberFormatter }}</td>
        <td>{{ saldoInvoice | numberFormatter }}</td>
      </tr>
      <tr>
        <th>TOTAL KAPUSTA</th>
        <td colspan="3" style="font-weight: bold">
          {{ totalPrice | numberFormatter }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { ordersStore } from '~/store'
export default {
  props: {
    price: {
      type: Object,
      default: () => ({ dollar: 0, sum: 0, invoice: 0 }),
    },
    // eslint-disable-next-line vue/prop-name-casing
    price_info: {
      type: Object,
      default: () => ({}),
    },
    order_id: {
      type: [Number, String],
      required: true,
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
  methods: {
    async updateData() {
      try {
        const data = {
          id: this.price_info.id,
          course: +this.course,
          percent: +this.percent,
          comingSum: +this.comingSum,
          comingDollar: +this.comingDollar,
          comingInvoice: +this.comingInvoice,
        }
        await ordersStore.updateOrderPrice({ id: this.order_id, data })
      } catch (e) {
        console.error('error', e)
      }
    },
    updateAndReload() {
      this.updateData()
      // location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  overflow-x: auto;
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  border-spacing: 2px;
  background: #d4fdc0;
  color: #606266;
  font-size: 12px;
  max-width: 100%;
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
  .flex {
    align-items: center;
  }
  label {
    margin-right: 5px;
  }
}
</style>
