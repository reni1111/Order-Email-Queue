const{ createOrderMail } = require('../data/createOrderMail')
const{ OrderMail } = require('../entities/OrderMail')
const{ ErrorWrapper } = require('../../../utils/errorWrapper')

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const orderId = event.Records[0].body

    const newOrderMailInstance = new OrderMail(orderId, {
      emailSent: true
    } )

    const{ orderMail, error } = await createOrderMail(newOrderMailInstance)
    
    if(error)
      throw new Error(error)
    console.log(orderMail)
    return orderMail
  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}