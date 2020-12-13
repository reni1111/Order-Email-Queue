const{ generateId } = require('../../../utils/generateId')
const{ generateUpdateExpression } = require('../../../utils/generateUpdateExpression')

class Order {
  constructor({ id, ...orderData }={}) {
    const date = new Date()
    this.createdAt = date.toISOString()

    // we use KSUID for id => its a sortable id (helps a lot with quires in dynamodb)
    this.id = id ? id : generateId(date)

    this.orderData = orderData
  }

  // if it would be a real application with many products per order 
  // we WOULD HAVE 2 entities => Order and OrderLineItem 
  // OrderLineItems keys would be =>  { 'PK': `Order#${this.id}`, 'SK': `OrderLineItem#${orderLineItemId}`}
  key() {
    return{
      'PK': `Order#${this.id}`,
      'SK': `Order#${this.id}`
    }
  }

  // for put
  toItem() {
    return{
      ...this.key(),
      id: this.id,
      // makes scans easier in dynamoDb
      TYPE: 'Order',
      createdAt: this.createdAt,
      ...this.orderData
    }
  }

  // for update
  // toUpdateItem(){
  //   if(Object.keys(this.orderData).length === 0)
  //     throw new Error('Update object should not be empty')
  
  //   return generateUpdateExpression(this.orderData)
  // }

}

module.exports = {
  Order
}