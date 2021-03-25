import Vue from 'vue'
Vue.directive('href', {
  bind: (el, binding, _vnode) => {
    el.setAttribute('href', `http://localhost:8080/uploads/${binding.value}`)
  },
  update: (el, binding, _vnode) => {
    el.setAttribute('href', `http://localhost:8080/uploads/${binding.value}`)
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
    el.style.width = '20px'
    el.style.height = '20px'
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
