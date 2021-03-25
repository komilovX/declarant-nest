<template>
  <el-button
    type="primary"
    :size="size"
    :loading="loading"
    @click="$emit('on-click')"
  >
    Сохранить
  </el-button>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
