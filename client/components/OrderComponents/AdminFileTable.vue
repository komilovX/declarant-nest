<template>
  <div>
    <h4 v-if="name" class="mb1">{{ name }}</h4>
    <el-table border :data="documents" size="mini">
      <el-table-column min-width="70" label="№" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType && documentType.number }}
        </template>
      </el-table-column>
      <el-table-column min-width="80" label="Наименование" align="center">
        <template slot-scope="{ row: { documentType } }">
          {{ documentType && documentType.name }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100"
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
  },
}
</script>
