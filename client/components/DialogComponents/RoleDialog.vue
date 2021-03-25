<template>
  <el-dialog
    :title="type == 'create' ? 'Новая роль' : 'Изменить роль'"
    :visible="visible"
    @close="$emit('closeDialog')"
  >
    <el-form
      ref="rolesForm"
      :model="roleForm"
      :rules="rules"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="Роль" prop="role">
        <el-input v-model="roleForm.role" size="small" placeholder="Роль" />
      </el-form-item>
      <el-form-item label="Название" prop="name">
        <el-input v-model="roleForm.name" size="small" placeholder="Название" />
      </el-form-item>
      <el-form-item label="Описание" prop="description">
        <el-input
          v-model="roleForm.description"
          size="small"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Описание роли"
        />
      </el-form-item>
      <el-form-item label="Cтраницы">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="value"
          :default-checked-keys="checkedKeys"
          class="permission-tree"
        />
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <el-button type="danger" plain size="small" @click="$emit('closeDialog')">
        отменить
      </el-button>
      <el-button
        type="primary"
        size="small"
        :loading="rolesStore.loading"
        @click="submitForm('rolesForm')"
      >
        подтвердить
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Tree } from 'element-ui'
import Vue from 'vue'
import { sidebarRoles } from '@/assets/config/sidebar'
import { rolesStore } from '~/store'
import { mapRulesByValue } from '~/utils/form-rules'
export default Vue.extend({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'create',
    },
    role: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rolesStore,
      checkedKeys: [],
      defaultProps: {
        children: 'childs',
        label: 'name',
      },
      roleForm: {
        role: '',
        name: '',
        description: '',
      },
      treeData: sidebarRoles,
      rules: mapRulesByValue(['name', 'role', 'description']),
    }
  },
  watch: {
    type(value) {
      if (value === 'edit') {
        this.setRole()
      }
    },
  },
  mounted() {
    if (this.type === 'edit') {
      this.setRole()
    }
  },
  methods: {
    setRole() {
      const sitePages = [...sidebarRoles]
        .filter((c) => c.childs)
        .map((c) => c.value)

      this.roleForm.role = this.role.role
      this.roleForm.name = this.role.name
      this.roleForm.description = this.role.description
      this.checkedKeys = this.role.pages
        .filter((c: any) => !sitePages.includes(c.name))
        .map((r: any) => r.name)
    },
    submitForm(form: any) {
      ;(this.$refs[form] as any).validate(
        async (valid: boolean | undefined): Promise<any> => {
          if (valid) {
            const formData = {
              name: this.roleForm.name,
              role: this.roleForm.role,
              description: this.roleForm.description,
            }
            const halfCheckedKeys = (this.$refs
              .tree as Tree).getHalfCheckedKeys()

            const keys = (this.$refs.tree as Tree).getCheckedKeys()
            const pages = halfCheckedKeys.concat(keys)
            try {
              if (this.type === 'create') {
                await this.rolesStore.createRole({ ...formData, pages })
                this.$message.success('Роль успешно добавлен')
              } else {
                await this.rolesStore.updateRole({
                  role: { ...formData, pages },
                  id: this.role.id,
                })
                this.$message.success('Роль успешно обнавлен')
              }
              this.$emit('closeDialog')
            } catch (e) {
              console.log(e)
            }
          } else {
            return false
          }
        }
      )
    },
  },
})
</script>
