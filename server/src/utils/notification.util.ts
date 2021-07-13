import { DocumentType } from 'src/document-type/document-type.entity'

export const notificationUtils = {
  orderCreated: (userName: string, orderId: number) => {
    return `${userName} добавил в систему новая заявка с номером ${orderId}`
  },
  orderGivenToYou: (userName: string, orderId: any) => {
    return `Новый заказ с id ${orderId} передал вам от ${userName}`
  },
  documentGivenToYou: (documentType: DocumentType, orderId) => {
    return `Документ ${documentType.name}-${documentType.number} в заявке ${orderId} дается вам`
  },
  documentReturned: (documentType: DocumentType, orderId) => {
    return `Документ ${documentType.name}-${documentType.number} в заявке ${orderId} вернулся`
  },
  documentAcepted: (documentType: DocumentType, orderId) => {
    return `Документ ${documentType.name}-${documentType.number} в заявке ${orderId} закончил`
  },
  documentFinished: (documentType: DocumentType, orderId) => {
    return `Документ ${documentType.name}-${documentType.number} в заявке ${orderId} принял`
  },
  documentDone: (documentType: DocumentType, orderId) => {
    return `Документ ${documentType.name}-${documentType.number} в заявке ${orderId} выполнено`
  },
}
