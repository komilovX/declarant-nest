import Vue from 'vue'
import { documentStatusColors } from './data'
import { UserPagesI } from './types'
import { authStore } from '~/store'

Vue.directive('role', {
  inserted: (el, binding, _vnode) => {
    const pages = authStore.user?.role.pages as UserPagesI[]
    if (pages) {
      const page = pages.find((p) => p.value === binding.value)
      const arg = binding.arg
      if (page && arg && !page[arg]) {
        el.remove()
      }
    }
  },
})

Vue.directive('href', {
  bind: (el, binding, _vnode) => {
    el.setAttribute('href', `http://localhost:8080/uploads/${binding.value}`)
  },
  update: (el, binding, _vnode) => {
    el.setAttribute('href', `http://localhost:8080/uploads/${binding.value}`)
  },
})

Vue.directive('status-type', {
  bind: (el, binding, _vnode) => {
    el.classList.add(
      `el-tag--${documentStatusColors[binding.value] || 'primary'}`
    )
  },
})

Vue.directive('image', {
  bind: (el, binding, _vnode) => {
    el.setAttribute(
      'src',
      `${window.location.origin}/file-images/${getFileFormat(binding.value)}`
    )
    el.style.width = '25px'
    el.style.height = '25px'
  },
  update: (el, binding, _vnode) => {
    el.setAttribute(
      'src',
      `${window.location.origin}/file-images/${getFileFormat(binding.value)}`
    )
    el.style.width = '25px'
    el.style.height = '25px'
  },
})

const fileFormats: any = {
  pdf: 'pdf',
  jpg: 'jpg',
  jpeg: 'jpg',
  png: 'jpg',
  doc: 'doc',
  docx: 'doc',
  xls: 'xls',
  xlsx: 'xls',
}

function getFileFormat(file: string) {
  const format = file
    .toLowerCase()
    .slice(file.lastIndexOf('.') + 1, file.length)
  return `${fileFormats[format] || 'file'}` + '.svg'
}
