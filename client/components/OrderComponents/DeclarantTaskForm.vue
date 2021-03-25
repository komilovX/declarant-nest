<template>
  <el-form
    ref="declarantForm"
    :model="declarantForm"
    class="mt1"
    :rules="rules"
  >
    <el-row :gutter="15">
      <el-col :span="24" :md="3" :sm="18">
        <el-form-item prop="number">
          <el-select
            v-model="declarantForm.number"
            size="small"
            filterable
            class="width90"
            placeholder="№"
            @change="(val) => onSelectChange(val, 'declarantForm')"
          >
            <el-option
              v-for="c in declarantDocumentTypes"
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
            v-model="declarantForm.documentTypeId"
            size="small"
            filterable
            class="width90"
            placeholder="Название"
            @change="(val) => onSelectChange(val, 'declarantForm')"
          >
            <el-option
              v-for="c in declarantDocumentTypes"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="4" :sm="24">
        <el-form-item prop="declarantId">
          <el-select
            v-model="declarantForm.declarantId"
            size="small"
            filterable
            placeholder="Исполнитель"
          >
            <el-option
              v-for="s in userStore.users"
              :key="s.id"
              :label="s.name"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" :md="4" :sm="18" class="mb1">
        <el-form-item id="submit-button">
          <app-save-button
            :loading="documentsStore.loading"
            @on-click="giveTask('declarantForm')"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { documentTypeStore, userStore, documentsStore } from '~/store'
import { DocumenTypes } from '~/utils/enums'

export default {
  data() {
    return {
      userStore,
      documentsStore,
      declarantForm: {
        documentTypeId: null,
        declarantId: null,
      },
      rules: {
        number: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    declarantDocumentTypes() {
      return documentTypeStore.documentTypes.filter(
        ({ types }) =>
          types.includes(DocumenTypes.DECLARANT) ||
          types.includes(DocumenTypes.SERVICE)
      )
    },
  },
}
</script>

<style></style>
