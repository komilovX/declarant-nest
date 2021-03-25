export function createFormData(formName) {
  const fd = new FormData()
  const { file } = this[formName]
  if (file) {
    fd.append('file', file.raw, file.name)
  }
  Object.keys(this[formName]).forEach((key) => {
    fd.append(`${key}`, this[formName][key])
  })
  return fd
}

export function capitalize(string) {
  if (typeof string !== 'string') {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function handleFile(file, fileList, formName) {
  let type = file.raw.type
  const idx = type.search(/png|jpeg|docx|doc|pdf/)
  if (idx == -1) {
    fileList = []
    this.$message.error('файлы толка с расширением png|jpeg|docx|doc|pdf ')
    return
  }
  this[formName].file = file
}

export function clearForm(formName) {
  if (this[formName]) {
    Object.keys(this[formName]).forEach((d) => (this[formName][d] = ''))
  }
}
