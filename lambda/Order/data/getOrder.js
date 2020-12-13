const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const{ errors } = require('./../../../utils/errors')
// To consume this method use const {order, error} = await getOrder(...)
// this function doesn't throw the error, it RETURNS it so you will have the power to 
// handle the error by yourself at the place you are using it

// paramter order is a class instance of entity: Order
const getOrder = async (order) => {
  try{
    const orderObj = await dynamodb.get({
      TableName: process.env['orderTable'],
      Key: order.key(),
    }).promise()

    if(!orderObj) {
      return{
        error: errors.OrderNotFoundError.errorKey
      }
    }
   
    // don't return dynamo keys on client (this wouldn't be a problem if we would use GraphQl)
    // eslint-disable-next-line no-unused-vars
    const{ PK, SK, ...response } = orderObj.Item
    return{
      order: response
    }
  } catch(error){
    console.log(error)
    return{
      error: errors.OrderGeneralError.errorKey
    }
  }
}

module.exports = {
  getOrder
}