import { extname } from 'path'

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx|ppt|pptx)$/)) {
    return callback(
      new Error('Only image and document files are allowed!'),
      false,
    )
  }
  callback(null, true)
}

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0]
  const fileExtName = extname(file.originalname)
  const randomName = Array(6)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
  callback(null, `${name}-${randomName}${fileExtName}`)
}
