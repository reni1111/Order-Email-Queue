const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const{ getOrder } = require('./getOrder')
const{ Order } = require('./../entities/Order')
const{ sendEmail } = require('./../../../utils/sendEmail')
const{ errors } = require('../../../utils/errors')
// To consume this method use const {orderMail, error} = await createOrderMail(...)
// this function doesn't throw the error, it RETURNS it so you will have the power to 
// handle the error by yourself at the place you are using it

// orderMail is a class instance of entity : OrderMail
const createOrderMail= async (orderMail) => {
  try{
    const orderMailItem = orderMail.toItem()

    const orderInstance = new Order({ id: orderMail.orderId })
    const{ order, error: orderError } = await getOrder(orderInstance)

    if(orderError)
      throw new Error(orderError)

    await sendEmail(
      order.userEmail, 
      'Order Creation Email (sorry for json... no time for fancy html)', 
      `${JSON.stringify(order, null, 4)}`
    )

    // this part could go to another queue too (in case email is successfully and dynamoDb fails)
    // anyway=> my dynamodb is in AutoScale mode and the partition key for storing email isn't 
    // being used for other things so almost no chance for fail
    await dynamodb.put({
      TableName: process.env['orderTable'],
      Item: orderMailItem,
      ConditionExpression: 'attribute_not_exists(PK)'
    }).promise()
   
    return{
      orderMail: orderMailItem
    }
    
  } catch(error) {
    console.log('Error creating orderMail')
    console.log(error)
    let errorMessage = errors.OrderMailGeneralError.errorKey
    // based on the business logic => on here add more conditions for errors
    return{
      error: errorMessage
    }
  }
}

module.exports = {
  createOrderMail
}