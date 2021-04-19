export const notificationUtils = {
  orderCreated: (userName: string, orderId: number) => {
    return `${userName} добавил в систему новая заявка с номером ${orderId}`
  },
  orderGivenToYou: (userName: string, orderId: any) => {
    return `Новый заказ с id ${orderId} передал вам от ${userName}`
  },
  documentGivenToYou: (docNumber, orderId) => {
    return `Документ ${docNumber} в заявке ${orderId} дается вам`
  },
  documentReturned: (docNumber, orderId) => {
    return `Документ ${docNumber} в заявке ${orderId} вернулся`
  },
  documentAcepted: (docNumber, orderId) => {
    return `Документ ${docNumber} в заявке ${orderId} закончил`
  },
  documentFinished: (docNumber, orderId) => {
    return `Документ ${docNumber} в заявке ${orderId} принял`
  },
}
