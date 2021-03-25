<template>
  <div class="flex items-center my-1">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in items"
        :key="item.path"
        :to="{ path: item.path }"
      >
        <span class="text-blue-600 cursor-pointer">{{ item.name }}</span
        >/
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
