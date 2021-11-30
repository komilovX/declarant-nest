<template>
  <div>
    <h4 v-if="name" class="mb1">{{ name }}</h4>
    <el-table border :data="documents" size="mini">
      <el-table-column
        v-if="postNumber"
        label="Справочный номер"
        align="center"
        style="font-size: 10px"
      >
        <template slot-scope="{ row: { postDate, referenceNumber } }">
          {{ postNumber }}/{{ postDate | dateFormatter
          }}{{ referenceNumber && `/${referenceNumber}` }}
        </template>
      </el-table-column>
      <el-table-column min-width="70" label="Документ" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType.name }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="70"
        label="Файл"
        align="center"
        class="flex content-center"
      >
        <template slot-scope="{ row: { files } }">
          <span v-if="!files">-</span>
          <div v-else class="flex justify-center">
            <a
              v-for="(file, idx) in files"
              :key="idx"
              v-href="file"
              target="_blank"
              class="mr-1 flex justify-center max-h-12 p-1"
            >
              <img v-image="file" />&nbsp;
            </a>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: '',
    },
    postNumber: {
      type: String,
      default: '',
    },
  },
}
</script>
