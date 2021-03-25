<template>
  <el-input
    v-if="type === 'input'"
    placeholder="Название"
    size="mini"
    :value="value"
    type="text"
    @input="onChange($event)"
  />
  <el-select
    v-else-if="type === 'select'"
    value="value"
    size="mini"
    @change.stop="onChange"
  >
    <el-option
      v-for="s in declarants"
      :key="s.id"
      :label="s.name"
      :value="s.name"
    />
  </el-select>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'input',
    },
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onChange(val) {
      this.$emit('on-change', val)
    },
  },
}
</script>

<style lang="scss" scoped></style>
