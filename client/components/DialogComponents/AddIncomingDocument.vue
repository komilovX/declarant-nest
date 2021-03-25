<template>
  <el-dialog
    custom-class="w-11/12 md:w-3/5"
    title="Добавление документ"
    :visible.sync="visible"
    :before-close="onClose"
  >
    <el-form ref="incomingForm" :model="incomingForm" :rules="rules">
      <el-row :gutter="15">
        <el-col :span="24" :md="3" :sm="24">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="incomingForm.documentTypeId"
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
        <el-col :span="24" :md="5" :sm="24">
          <el-form-item prop="documentTypeId">
            <el-select
              v-model="incomingForm.documentTypeId"
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
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item prop="order">
            <el-input
              v-model="incomingForm.order"
              placeholder="Номер"
              size="small"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="8" :sm="24">
          <el-form-item prop="price">
            <div class="flex">
              <el-input
                v-model="incomingForm.price"
                placeholder="Цена"
                class="mr-2"
                size="small"
                style="min-width: 120px"
                type="text"
              />
              <el-select v-model="incomingForm.currency" size="small">
                <el-option
                  v-for="s in ['$', 'uzs', 'перечисление']"
                  :key="s"
                  :label="s"
                  :value="s"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" :md="4" :sm="24">
          <el-form-item>
            <el-upload
              ref="decoratedUpload"
              action="https://localhost:3000"
              :auto-upload="false"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <el-button
                :disabled="!incomingForm.documentTypeId"
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
          @on-click="submitForm('incomingForm')"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapRulesByValue } from '@/utils/form-rules.js'
import AppAddButton from '../AppComponents/AppAddButton.vue'
import { documentsStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'
export default {
  components: { AppAddButton },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Array,
      default: () => [],
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
      loading: false,
      fileList: [],
      incomingForm: {
        documentTypeId: null,
        order: null,
        price: '',
        currency: '',
      },
      rules: mapRulesByValue(['documentTypeId']),
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const { documentTypeId, price, order, currency } = this[formName]
            const fd = new FormData()
            fd.append('documentTypeId', documentTypeId)
            fd.append('price', price)
            fd.append('orderId', this.order_id)
            fd.append('number', order)
            fd.append('type', DocumenTypes.INCOMING)
            fd.append('currency', currency)
            this.fileList.forEach((file) =>
              fd.append('files', file.raw, file.name)
            )
            const document = await documentsStore.createDocument(fd)
            document.needPrice = false
            this.$emit('documentAdded', document)
            this.$message.success('Документ успешно обновлен')
            this.$refs.incomingForm.resetFields()
            this.$refs.decoratedUpload.clearFiles()
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
