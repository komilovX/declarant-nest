<template>
  <el-row>
    <el-col :span="16" :sm="24" :md="16">
      <div v-role:create="'data-products'" class="mb-1 df">
        <app-input
          :value="name"
          style="max-width: 80%"
          class="mr1"
          @on-change="name = $event"
        />
        <app-add-button @on-click="addProduct" />
      </div>
      <el-table :data="products" size="small" border>
        <el-table-column min-width="70" label="#" type="index" align="center" />
        <app-table-column label="Наименование" :width="250">
          <template #default="{ index, row }">
            <app-input-row
              :row="row"
              :value="products[index].name"
              @on-change="products[index].name = $event"
            />
          </template>
        </app-table-column>
        <app-table-column label="Действия">
          <template #default="{ row: { id, changed }, index }">
            <app-table-actions
              v-role:update="'data-products'"
              :changed="changed"
              @on-changed="products[index].changed = true"
              @on-cancel="products[index].changed = false"
              @on-delete="deleteProduct(id)"
              @on-save="editProduct(id, index)"
            />
          </template>
        </app-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import AppAddButton from '~/components/AppComponents/AppAddButton.vue'
import AppInput from '~/components/AppComponents/AppInput.vue'
import AppInputRow from '~/components/AppComponents/AppInputRow.vue'
import AppTableActions from '~/components/AppComponents/AppTableActions.vue'
import AppTableColumn from '~/components/AppComponents/AppTableColumn.vue'
import { authStore, dataStore } from '~/store'

export default {
  components: {
    AppInput,
    AppAddButton,
    AppTableColumn,
    AppInputRow,
    AppTableActions,
  },
  validate() {
    const pages = authStore.user?.role.pages
    if (pages) {
      const page = pages.find((p) => p.value === 'data-products')
      if (page) {
        return true
      }
      return false
    }
    return false
  },
  data() {
    return {
      dataStore,
      name: '',
    }
  },
  async fetch() {
    try {
      await dataStore.fetchProducts()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    products() {
      return dataStore.products.map((c) => ({ ...c, changed: false }))
    },
  },
  methods: {
    async addProduct() {
      if (this.name) {
        try {
          await this.$store.dispatch('data/addProduct', { name: this.name })
          this.name = ''
          this.$message.success('товар успешно добавлен')
        } catch (e) {
          console.log(e)
        }
      }
    },
    async editProduct(id, index) {
      try {
        const product = this.products[index]
        if (!product.name) {
          this.error = true
          return
        }
        await this.dataStore.updateProduct({ data: product, id })
        this.products[index].changed = false
        this.$message.success('Oбнавлена')
      } catch (e) {
        console.log(e)
      }
    },
    deleteProduct(id) {
      const text = 'Уверены, что хотите удалить этот товар?'
      this.$confirm(text, 'Подтверждение', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning',
      })
        .then(async () => {
          try {
            await this.$store.dispatch('data/removeProduct', id)
          } catch (e) {
            console.error(e)
          }
        })
        .catch(() => {})
    },
  },
}
</script>
