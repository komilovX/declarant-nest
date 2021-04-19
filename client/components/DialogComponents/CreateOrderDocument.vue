<template>
  <el-dialog
    custom-class="w-11/12 md:w-3/4"
    title="Добавление документ"
    :visible.sync="visible"
    :before-close="onClose"
  >
    <el-form ref="documentForm" :model="documentForm" :rules="rules">
      <el-row :gutter="15">
        <el-col :span="24" :md="3" :sm="24">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="documentForm.documentTypeId"
              size="small"
              filterable
              class="width90"
              placeholder="№"
            >
              <el-option
                v-for="c in documents"
                :key="c.id"
                :label="c.number"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="documentForm.documentTypeId"
              size="small"
              filterable
              placeholder="Наименование"
            >
              <el-option
                v-for="c in documents"
                :key="c.id"
                :label="c.name"
                :value="c.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="7" :sm="12">
          <el-form-item prop="price">
            <div class="flex">
              <el-input
                v-model="documentForm.price"
                clearable
                placeholder="Цена"
                class="mr-2"
                size="small"
                style="min-width: 100px"
                type="text"
              />
              <el-select v-model="documentForm.currency" size="small">
                <el-option
                  v-for="s in currencyList"
                  :key="s.value"
                  :label="s.type"
                  :value="s.value"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="6" :sm="24">
          <el-form-item prop="comment">
            <el-input
              v-model="documentForm.comment"
              placeholder="Примечание"
              type="text"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item>
            <el-upload
              ref="documentUpload"
              action="https://localhost:3000"
              :auto-upload="false"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button
                :disabled="!documentForm.documentTypeId"
                size="mini"
                plain
                type="primary"
                >Загрузить</el-button
              >
            </el-upload>
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
import AppAddButton from '../AppComponents/AppAddButton.vue'
import { documentsStore, documentTypeStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'
import { currencyList } from '~/utils/data'

export default {
  components: { AppAddButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    order_id: {
      type: [String, Number],
      required: true,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      currencyList,
      loading: false,
      fileList: [],
      documentForm: {
        documentTypeId: null,
        order: null,
        price: '',
        currency: '',
        comment: '',
      },
      rules: mapRulesByValue(['documentTypeId']),
    }
  },
  computed: {
    documents() {
      return documentTypeStore.documentTypes.filter(
        ({ types }) =>
          types.includes(DocumenTypes.DECLARANT) ||
          types.includes(DocumenTypes.SERVICE)
      )
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const { documentTypeId, price, order, currency } = this[formName]
            const fd = new FormData()
            fd.append('documentTypeId', documentTypeId)
            fd.append('orderId', this.order_id)
            fd.append('number', order)
            fd.append('type', DocumenTypes.DECLARANT)
            if (price) {
              fd.append('price', price)
              fd.append('currency', currency)
            }
            this.fileList.forEach((file) =>
              fd.append('files', file.raw, file.name)
            )
            const document = await documentsStore.createDocument(fd)
            this.$emit('documentAdded', document)
            this.$message.success('Документ успешно добовлен')
            this.$refs.documentForm.resetFields()
            this.$refs.documentUpload.clearFiles()
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }
      })
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
  },
}
</script>
