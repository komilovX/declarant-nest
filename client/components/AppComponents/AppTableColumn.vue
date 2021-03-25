<template>
  <el-table-column
    :min-width="width"
    :label="label"
    align="center"
    show-overflow-tooltip
  >
    <template slot-scope="{ row, $index }">
      <slot :row="row" :index="$index"></slot>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '150',
    },
  },
}
</script>

<style lang="scss" scoped></style>
