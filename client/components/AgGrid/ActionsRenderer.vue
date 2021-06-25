<template>
  <div class="df-se">
    <el-button
      v-if="params.showView"
      type="primary"
      size="mini"
      icon="el-icon-view"
      plain
      class="px-1.5"
      @click="viewClicked"
    />
    <el-button
      v-if="params.showEdit"
      type="primary"
      size="small"
      icon="el-icon-edit"
      plain
      circle
      @click="editClicked"
    />
    <el-badge :value="showBadge" class="item">
      <el-button
        v-if="params.showMessage"
        type="primary"
        size="small"
        icon="el-icon-chat-dot-round"
        plain
        circle
        :disabled="params.loading"
        @click="messageClicked"
      />
    </el-badge>
    <el-button
      v-if="params.showDelete"
      v-role:delete="params.pageRoles"
      type="danger"
      size="mini"
      icon="el-icon-delete"
      plain
      class="px-1.5"
      @click="deleteClicked"
    />
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  computed: {
    showBadge() {
      return ''
    },
  },
  methods: {
    viewClicked() {
      this.params.viewClicked(this.params.node.data)
    },
    editClicked() {
      this.params.editClicked()
    },
    messageClicked() {
      this.params.messageClicked(this.params.data)
    },
    deleteClicked() {
      this.params.deleteClicked(this.params.data)
    },
  },
})
</script>
