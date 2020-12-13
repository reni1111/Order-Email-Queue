const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const sqs = new AWS.SQS()

const{ errors } = require('../../../utils/errors')
// To consume this method use const {order, error} = await createOrder(...)
// this function doesn't throw the error, it RETURNS it so you will have the power to
// handle the error by yourself at the place you are using it

// order is a class instance of entity : Order
const createOrder= async (order) => {
  try{
    const orderItem = order.toItem()

    await dynamodb.put({
      TableName: process.env['orderTable'],
      Item: orderItem,
      ConditionExpression: 'attribute_not_exists(PK)'
    }).promise()
    
    await sqs.sendMessage({
      MessageBody: orderItem.id,
      QueueUrl: process.env['queueUrl']
    }).promise()
   
    // don't return dynamo keys on client (this wouldn't be a problem if we would use GraphQl)
    // eslint-disable-next-line no-unused-vars
    const{ PK, SK, ...response } = orderItem
    return{
      order: response
    }
    
  } catch(error) {
    console.log('Error creating order')
    console.log(error)
    let errorMessage = errors.OrderGeneralError.errorKey
    // based on the business logic => on here add more conditions for errors
    return{
      error: errorMessage
    }
  }
}

module.exports = {
  createOrder
}