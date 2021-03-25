<template>
  <el-dialog
    title="Грузоотправитель"
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
      <app-add-button @on-click="addShipper" />
    </div>
    <el-table :data="shippers" size="small" border>
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
            @click="deleteShipper(id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    shippers: {
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
      loading: false,
      name: '',
    }
  },
  methods: {
    async addShipper() {
      if (this.name) {
        this.loading = true
        try {
          const shipper = await this.$axios.$post('api/shippers', {
            name: this.name,
          })
          this.loading = false
          this.name = ''
          this.$message.success('Грузоотправитель успешно добавлен')
          this.$emit('shipperAdded', shipper)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      }
    },
    async deleteShipper(id) {
      try {
        await this.$axios.$delete(`api/shippers/${id}`)
        this.$emit('shipper-deleted', id)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
