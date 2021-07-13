import { DocumentStatus } from './data'

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

export function clearForm(formName) {
  if (this[formName]) {
    Object.keys(this[formName]).forEach((d) => (this[formName][d] = ''))
  }
}
export function tableRowClassName({ row }) {
  if (row.status == DocumentStatus.TASK) {
    return 'task-row'
  }
  if (row.status == DocumentStatus.DONE) {
    return 'done-row'
  }
  if (row.status == DocumentStatus.RETURNED) {
    return 'returned-row'
  }
  if (row.status == DocumentStatus.FINISHED) {
    return 'finished-row'
  }
  return ''
}

export function gridCellStyle(params) {
  if (params.data && params.data.status === DocumentStatus.TASK) {
    return { backgroundColor: '#fef0f0', textAlign: 'center' }
  }
  if (params.data && params.data.status === DocumentStatus.RETURNED) {
    return { backgroundColor: '#f4f4f5', textAlign: 'center' }
  }
  if (params.data && params.data.status === DocumentStatus.DONE) {
    return { backgroundColor: '#ecf5ff', textAlign: 'center' }
  }
  if (params.data && params.data.status === DocumentStatus.FINISHED) {
    return { backgroundColor: '#f0f9eb', textAlign: 'center' }
  }
  return { textAlign: 'center' }
}

export function archiveCellStyle(params) {
  if (params.data && params.data.deleted === true) {
    return { backgroundColor: '#fef0f0', textAlign: 'center' }
  }
  if (params.data && params.data.archived === DocumentStatus.RETURNED) {
    return { backgroundColor: '#ecf5ff', textAlign: 'center' }
  }
  return { textAlign: 'center' }
}
