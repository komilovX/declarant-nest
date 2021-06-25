<template>
  <el-dialog
    title="Товары"
    :visible.sync="visible"
    :before-close="onClose"
    custom-class="w-11/12 md:w-1/2"
  >
    <div class="mb-1 df">
      <app-input
        :value="name"
        style="max-width: 60%"
        class="mr1"
        @on-change="name = $event"
      />
      <app-add-button @on-click="addProduct" />
    </div>
    <el-table v-loading="loading" :data="products" size="small" border>
      <el-table-column min-width="70" label="#" type="index" align="center" />
      <el-table-column
        min-width="110"
        label="Наименование"
        align="center"
        prop="name"
      />
      <el-table-column label="Удалить" align="center">
        <template slot-scope="{ row: { id } }">
          <el-button
            type="danger"
            plain
            size="mini"
            icon="el-icon-delete"
            class="px-1.5 py-1"
            @click="deleteProduct(id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { dataStore } from '~/store'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    products: {
      type: Array,
      default: () => [],
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      name: '',
    }
  },
  computed: {
    loading() {
      return dataStore.loading
    },
  },
  methods: {
    async addProduct() {
      if (this.name) {
        try {
          await dataStore.addProduct({ name: this.name })
          this.name = ''
          this.$message.success('Товар успешно добавлен')
        } catch (e) {
          console.log(e)
        }
      }
    },
    async deleteProduct(id) {
      try {
        await dataStore.removeProduct(id)
        this.$message.success('Товар успешно удален')
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
