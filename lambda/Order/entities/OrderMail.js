const{ generateId } = require('../../../utils/generateId')
const{ generateUpdateExpression } = require('../../../utils/generateUpdateExpression')

// we will use ONE TABLE, keys will be different (dynamoDb is known to manage complex data in only 1 table) 
class OrderMail {
  constructor(orderId, { id, ...orderMailData }={}) {
    const date = new Date()
    this.createdAt = date.toISOString()

    // we use KSUID for id => its a sortable id (helps a lot with quires in dynamodb)
    this.id = id ? id : generateId(date)
    this.orderId=orderId

    this.orderMailData = orderMailData
  }

  key() {
    return{
      'PK': `Order#${this.orderId}`,
      'SK': `OrderMail#${this.id}`
    }
  }

  // in case you may want to get list of all emails sent
  gsi1key() {
    return{
      'GSI1PK': 'OrderMail',
      'GSI1SK': `OrderMail#${this.id}`
    }
  }

  // for put
  toItem() {
    return{
      ...this.key(),
      ...this.gsi1key(),
      id: this.id,
      // makes scans easier in dynamoDb
      TYPE: 'OrderMail',
      orderId: this.orderId,
      createdAt: this.createdAt,
      ...this.orderMailData
    }
  }

  // for update
  // toUpdateItem(){
  //   if(Object.keys(this.orderMailData).length === 0)
  //     throw new Error('Update object should not be empty')
  
  //   return generateUpdateExpression(this.orderMailData)
  // }

}

module.exports = {
  OrderMail
}