const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpPartialResponse = require('@middy/http-partial-response')
const validator = require('@middy/validator')

const{ createOrder } = require('../data/createOrder')
const{ Order } = require('../entities/Order')
const{ ErrorWrapper } = require('../../../utils/errorWrapper')

const createOrderHandler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const orderData = event.body
    const newOrder = new Order(orderData)

    const{ order, error } = await createOrder(newOrder)
    
    if(error)
      throw new Error(error)

    const response = {
      statusCode: 200, 
      body: JSON.stringify(order),
    }
    console.log(response)

    return response
   
  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}

// all middy validation are done by AJV library, so we can add validations like "format" that aren't found in
// middy documentation... because they are always passed to AJV
const inputSchema = {
  required: ['body', ],
  properties: {
    body: {
      type: 'object',
      properties: {
        userEmail: { type: 'string', format: 'email' },
        name: { type: 'string' },
        address: { type: 'string' },
        userId: { type: 'string' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              itemId: { type: 'string' },
              amount: {
                type: 'object',
                properties: {
                  currency: { type: 'string', enum: ['ALL', 'EURO'] },
                  value: { type: 'number', minimum: 0 }
                },
                required: ['currency', 'value']
              }
            },
            required: ['amount', 'itemId']
          }
        }
      },
      required: ['userEmail', 'name', 'address', 'userId', 'products'] 
    }
  }
}

const handler = middy(createOrderHandler)
  // parses the request body when it's a JSON and converts it to an object
  .use(jsonBodyParser()) 
  // validates the input
  .use(validator({ inputSchema, ajvOptions: {
  // spend a lot of time with this..., numbers could pass even if schema type was string (ajv feature not a bug)
    coerceTypes: false
  } }
  ))
  // graphql for RestApi... (you can send queryString paramter like this "?fields=id" and it will return only the id)
  .use(httpPartialResponse())

module.exports = { handler }