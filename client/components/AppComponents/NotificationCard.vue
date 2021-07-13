<template>
  <el-card class="box-card m-2">
    <div slot="header" class="clearfix flex items-center justify-between">
      <span>{{ notification.date | dateFormatter }}</span>
      <el-button type="text" @click="$emit('messageReaded', notification.id)"
        ><i class="el-icon-close"
      /></el-button>
    </div>
    <div class="text item">
      {{ notification.message }}
    </div>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { NotificationI } from '~/utils/types'
export default Vue.extend({
  props: {
    notification: {
      type: Object as () => NotificationI,
      required: true,
    },
  },
})
</script>
