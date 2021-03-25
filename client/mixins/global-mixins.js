export default {
  data() {
    return {
      statuses: {
        NEW: 'новое',
        INSPECTION: 'ждет досмотра',
        DOCUMENT: 'ждет документов',
        REGISTRATION: 'готов к офрмлению',
        FINISHED: 'оформлен',
      },
      fileFormats: {
        pdf: 'pdf',
        jpg: 'jpg',
        jpeg: 'jpg',
        png: 'jpg',
        doc: 'doc',
        docx: 'doc',
        xls: 'xls',
        xlsx: 'xls',
      },
      currencyList: [
        { type: '$', value: '$' },
        { type: 'сум', value: 'sum' },
        { type: 'перечисление', value: 'invoice' },
      ],
    }
  },
  methods: {
    getCurrency(currency) {
      return this.currencyList.find((c) => c.value == currency)
        ? this.currencyList.find((c) => c.value == currency).type
        : currency
    },
    getFileFormat(file) {
      const format = file
        .toLowerCase()
        .slice(file.lastIndexOf('.') + 1, file.length)
      return `${this.fileFormats[format] || 'file'}` + '.svg'
    },
    dateFormatter(date) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      return new Date(date).toLocaleString('ru-RU', options)
    },
    parcePrice(price) {
      if (price) {
        return JSON.parse(price)
      }
      return [{ price: 0, currency: '$' }]
    },
    numberFormatter(number) {
      return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(number)
    },
  },
}
