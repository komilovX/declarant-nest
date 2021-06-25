<template>
  <el-dialog
    :title="type == 'create' ? 'Новая роль' : 'Изменить роль'"
    :visible="visible"
    @close="$emit('closeDialog')"
  >
    <el-form
      ref="roleForm"
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
        <div class="flex justify-end">
          <span class="inline-block mx-8">R</span>
          <span class="inline-block mx-2">C</span>
          <span class="inline-block mx-8">U</span>
          <span class="inline-block ml-2">D</span>
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="value"
          :default-checked-keys="checkedKeys"
          class="permission-tree"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="!node.childNodes.length">
              <el-checkbox v-model="node.data.read" disabled />
              <el-checkbox
                v-model="node.data.create"
                :disabled="node.data.disabled"
              />
              <el-checkbox
                v-model="node.data.update"
                :disabled="node.data.disabled"
              />
              <el-checkbox
                v-model="node.data.delete"
                :disabled="node.data.disabled"
              />
            </span>
          </span>
        </el-tree>
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <el-button type="danger" plain size="mini" @click="$emit('closeDialog')">
        отменить
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="rolesStore.loading"
        @click="submitForm('roleForm')"
      >
        подтвердить
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Form, Tree } from 'element-ui'
import Vue from 'vue'
import { sidebarRoles } from '@/assets/config/sidebar'
import { rolesStore } from '~/store'
import { mapRulesByValue } from '~/utils/form-rules'
import { PagesI } from '~/store/roles'
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
        disabled: 'disabled',
      },
      roleForm: {
        role: '',
        name: '',
        description: '',
      },
      treeData: sidebarRoles(),
      rules: mapRulesByValue(['name', 'role', 'description']),
    }
  },
  watch: {
    type(value) {
      if (value === 'edit') {
        this.setRole()
      } else {
        this.clearFormInput()
        this.clearForms()
      }
    },
    role(value) {
      if (this.type === 'edit' && value) {
        this.setRole()
      }
    },
  },
  methods: {
    setRole() {
      const sitePages = sidebarRoles()
        .filter((c) => c.childs)
        .map((c) => c.value)

      this.roleForm.role = this.role.role
      this.roleForm.name = this.role.name
      this.roleForm.description = this.role.description
      this.checkedKeys = this.role?.pages
        .filter((c: any) => !sitePages.includes(c.value))
        .map((r: any) => r.value)

      if (this.role.pages) {
        this.treeData = sidebarRoles().map((role: any) => {
          if (role.childs) {
            const childs = role.childs.map((ch: any) => {
              const page = this.role.pages.find(
                (p: any) => p.value === ch.value
              )
              ch = { ...ch, ...page }
              return ch
            })
            role.childs = childs
            return role
          } else {
            const page = this.role.pages.find(
              (p: any) => p.value === role.value
            )
            role = { ...role, ...page }
            return role
          }
        })
      }
    },
    clearForms() {
      this.treeData = sidebarRoles()
      this.checkedKeys = sidebarRoles()
        .filter((d) => d.disabled)
        .map((d) => d.value) as any
    },
    clearFormInput() {
      ;(this.$refs.roleForm as Form).resetFields()
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
            const allCheckedKeys = halfCheckedKeys.concat(keys)

            const allTreeData: any = []
            this.treeData.forEach((data) => {
              if (data.childs) {
                const { childs, ...otherData } = data
                allTreeData.push(...childs)
                allTreeData.push(otherData)
              } else {
                allTreeData.push(data)
              }
            })

            const pages: PagesI[] = []
            allCheckedKeys.forEach((value: string) => {
              const page = allTreeData.find((p: any) => {
                return p.value === value
              })
              if (page) {
                pages.push(page)
              }
            })
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
