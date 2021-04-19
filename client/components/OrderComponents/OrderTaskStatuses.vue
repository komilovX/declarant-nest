<template>
  <div>
    <el-tag
      v-for="(key, index) in Object.keys(documentStatusTexts)"
      :key="index"
      v-status-type="key"
      size="small"
      class="mr-2"
      >{{ documentStatusTexts[key] | documentStatusFilter }}</el-tag
    >
  </div>
</template>
<script>
import { documentStatusTexts } from '~/utils/data'

export default {
  data() {
    return {
      documentStatusTexts,
    }
  },
}
</script>
