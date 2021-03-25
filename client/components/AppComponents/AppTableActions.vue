<template>
  <div class="flex" style="justify-content: center">
    <div class="flex">
      <el-tooltip v-if="!changed" content="Изменить">
        <el-button
          type="primary"
          plain
          size="mini"
          icon="el-icon-edit"
          class="px-1.5 py-1 mr-2"
          @click="$emit('on-changed')"
        />
      </el-tooltip>
      <div v-else class="flex">
        <el-tooltip content="Закрыть">
          <i
            class="el-icon-close text-black cursor-pointer mr-1.5 text-base"
            @click="$emit('on-cancel')"
          />
        </el-tooltip>
        <el-tooltip content="Сохранить">
          <i
            class="el-icon-check text-green-800 cursor-pointer text-base mr-2"
            @click="$emit('on-save')"
          />
        </el-tooltip>
      </div>
    </div>
    <el-tooltip content="Удалить">
      <el-button
        type="danger"
        plain
        size="mini"
        icon="el-icon-delete"
        class="px-1.5 py-1"
        @click="$emit('on-delete')"
      />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    changed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
