<template>
  <el-dialog
    width="70vw"
    title="Добавление документ"
    :visible.sync="visible"
    :before-close="onClose"
  >
    <el-form ref="documentForm" :model="documentForm" :rules="rules">
      <el-row :gutter="15">
        <el-col :span="24" :md="4" :sm="18">
          <el-form-item prop="type">
            <el-select v-model="documentForm.type" size="small">
              <el-option
                v-for="s in documentTypes"
                :key="s.type"
                :label="s.type"
                :value="s.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="3" :sm="24">
          <el-form-item prop="number">
            <el-select
              v-model="documentForm.number"
              size="small"
              filterable
              class="width90"
              placeholder="№"
              @change="(val) => onSelectChange(val, 'document')"
            >
              <el-option
                v-for="c in getDocuments"
                :key="c.id"
                :label="c.number"
                :value="c.number"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item prop="name">
            <el-select
              v-model="documentForm.name"
              size="small"
              filterable
              placeholder="Наименование"
              @change="(val) => onSelectChange(val, 'service')"
            >
              <el-option
                v-for="c in getDocuments"
                :key="c.id"
                :label="c.name"
                :value="c.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="documentForm.type == 'document'"
          :span="24"
          :md="3"
          :sm="24"
        >
          <el-form-item>
            <el-upload
              ref="fileUpload"
              :auto-upload="false"
              action="http://localhost:3000"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button size="mini" type="primary">Загрузить</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="24">
          <el-form-item prop="price">
            <div class="df">
              <div class="df" style="flex-direction: column">
                <div
                  v-for="(p, index) in documentForm.price"
                  :key="index"
                  class="df mb05"
                >
                  <el-input
                    v-model="p.price"
                    size="small"
                    class="mr1"
                    type="number"
                    style="min-width: 70px"
                    placeholder="Цена"
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
                @click="addPriceColumn($index)"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item>
            <el-input
              v-model="documentForm.comment"
              size="small"
              type="text"
              placeholder="Примечание"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <app-add-button
          size="small"
          :loading="loading"
          @on-click="submitForm('documentForm')"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import { DocumenTypes } from '~/utils/enums'
import { currencyList } from '~/utils/data'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Array,
      default: () => [],
    },
    order: {
      type: Object,
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
      currencyList,
      documentTypes: [
        { type: 'документ', value: 'document' },
        { type: 'услуга', value: 'service' },
      ],
      fileList: [],
      documentForm: {
        type: 'document',
        name: null,
        number: null,
        price: [{ price: '', currency: '' }],
        comment: '',
        status: 'done',
      },
      rules: mapRulesByValue(['name', 'number']),
    }
  },
  computed: {
    getDocuments() {
      return this.documents.filter(
        (d) =>
          d.types.includes(DocumenTypes.DECLARANT) ||
          d.types.includes(DocumenTypes.SERVICE)
      )
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            let document
            const { name, number, comment, status } = this[formName]
            const { product, client_company, shipper } = this.order
            const price = this[formName].price.filter((p) => p.price)
            if (this[formName].type == 'document') {
              const fd = new FormData()
              fd.append('name', name)
              fd.append('number', number)
              fd.append('comment', comment)
              fd.append('product', product)
              fd.append('client_company', client_company)
              fd.append('shipper', shipper)
              fd.append('price', JSON.stringify(price))
              fd.append('status', status)
              this.fileList.forEach((file) =>
                fd.append('files', file.raw, file.name)
              )
              const formData = {
                id: this.order.id,
                form: fd,
              }
              document = await this.$store.dispatch(
                `orders/addDeclarantDocuments`,
                formData
              )
              this.$refs.fileUpload.clearFiles()
            } else {
              document = await this.$store.dispatch(`orders/createService`, {
                order_id: this.order.id,
                name,
                number,
                comment,
                price,
                status,
                product,
                client_company,
                shipper,
              })
            }
            this.$emit('documentAdded', { document, type: this[formName].type })
            this.loading = false
            this.$message.success('Документ успешно добавлен')
            this.$refs.documentForm.resetFields()
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }
      })
    },
    onSelectChange(val) {
      const document = this.documents.find(
        (d) => d.number == val || d.name == val
      )
      if (document) {
        this.documentForm.name = document.name
        this.documentForm.number = document.number
      }
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
    handleFileRemove(file) {
      this.fileList = this.fileList.filter(({ uid }) => uid !== file.uid)
    },
    addPriceColumn() {
      this.documentForm.price.push({ price: '', currency: '' })
    },
  },
}
</script>
