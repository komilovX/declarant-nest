<template>
  <el-button
    :loading="loading"
    :size="size"
    type="success"
    @click="$emit('on-click')"
    >Добавить</el-button
  >
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'mini',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
