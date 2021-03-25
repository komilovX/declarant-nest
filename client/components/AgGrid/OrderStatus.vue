<template>
  <div style="display: inline-block">
    <el-tag :key="status" size="small" :type="colors[status]" effect="plain">
      {{ statuses[status] }}
    </el-tag>
  </div>
</template>

<script>
import Vue from 'vue'
import { statuses } from '~/utils/data'

export default Vue.extend({
  data() {
    return {
      status: null,
      colors: {
        new: 'success',
        inspection: 'danger',
        document: 'warning',
        registration: 'info',
        finished: 'primary',
      },
      statuses,
    }
  },
  mounted() {
    this.status = this.params.data ? this.params.data.status : 'finished'
  },
})
</script>
