<template>
  <el-dialog
    width="80vw"
    title="Редактирование"
    :visible.sync="visible"
    :before-close="onClose"
  >
    <el-table border :data="[document]" size="mini">
      <el-table-column width="80" label="№" align="center" prop="number" />
      <el-table-column
        width="130"
        label="Наименование"
        align="center"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="document.type == 'declarant'"
        min-width="150"
        label="Файл"
        align="center"
      >
        <template slot-scope="{ row: { id, files } }">
          <div
            v-for="(f, idx) in files"
            :key="idx"
            style="display: inline-block"
          >
            <a
              :href="`/uploads/${f}`"
              target="_blank"
              style="
                color: #3a8ee6;
                padding: 0 1px;
                display: inline;
                text-decoration: underline;
              "
            >
              <img
                :src="`/file-images/${getFileFormat(f)}`"
                alt="File"
                width="25"
                height="20"
              />
            </a>
            <el-button
              type="text"
              icon="el-icon-close"
              style="color: red"
              @click="$emit('file-deleted', { id, file: f })"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="document.type == 'declarant'"
        label="Загрузить"
        align="center"
      >
        <el-upload
          ref="fileUpload"
          :auto-upload="false"
          action="http://localhost:3000"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-button size="mini" type="primary" icon="el-icon-upload" />
        </el-upload>
      </el-table-column>
      <el-table-column
        min-width="180"
        label="Сумма"
        align="center"
        prop="price"
        show-overflow-tooltip
      >
        <template slot-scope="{ row: { price } }">
          <div class="df">
            <div class="df" style="flex-direction: column">
              <div v-for="(p, index) in price" :key="index" class="df mb05">
                <el-input
                  v-model="p.price"
                  size="small"
                  class="mr1"
                  type="number"
                  style="min-width: 70px"
                />
                <el-select
                  v-model="p.currency"
                  size="small"
                  placeholder="Валюта"
                >
                  <el-option
                    v-for="s in currencyList"
                    :key="s.type"
                    :label="s.type"
                    :value="s.value"
                  />
                </el-select>
              </div>
            </div>
            <el-button
              icon="el-icon-plus"
              size="small"
              style="color: #67c23a"
              type="text"
              class="delete-button"
              @click="addPriceColumn"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        label="Примечание"
        align="center"
        prop="comment"
        show-overflow-tooltip
      >
        <template slot-scope>
          <div class="df">
            <el-input
              :value="document.comment"
              size="small"
              class="mr1"
              type="text"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        plain
        size="small"
        @click="
          $emit('delete-document', { type: document.type, id: document.id })
        "
        >Удалить</el-button
      >
      <app-save-button type="primary" @on-click="updateDocument" />
    </span>
  </el-dialog>
</template>

<script>
import AppSaveButton from '../AppComponents/AppSaveButton.vue'
export default {
  components: { AppSaveButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    document: {
      type: Object,
      default: () => ({}),
    },
    order_id: {
      type: [String, Number],
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      fileList: [],
    }
  },
  methods: {
    async updateDocument() {
      try {
        this.loading = true
        const { comment, id } = this.document
        const price = this.document.price.filter((p) => p.price)
        if (this.document.type == 'service') {
          const result = await this.$axios.$put(`api/service/${id}`, {
            price: JSON.stringify(price),
            comment: comment || '',
          })
          this.$emit('updated', { document: result, type: 'service' })
        } else {
          const fd = new FormData()
          fd.append('price', JSON.stringify(price))
          fd.append('comment', comment || '')
          if (this.fileList) {
            this.fileList.forEach((file) => {
              fd.append('files', file.raw, file.name)
            })
          }
          const result = await this.$axios.$put(
            `api/orders/declarant/${id}`,
            fd
          )
          this.$emit('updated', { document: result, type: 'document' })
          this.$refs.fileUpload.clearFiles()
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    handleFileChange(file) {
      const type = file.raw.type
      const idx = type.search(/png|jpeg|docx|doc|pdf/)
      if (idx == -1) {
        this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
        return
      }
      this.fileList.push(file)
    },
    addPriceColumn() {
      // this.document.price.push({ price: '', currency: '' })
    },
  },
}
</script>
