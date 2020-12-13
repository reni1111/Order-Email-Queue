
const assert = require('assert')
const axios = require('axios')
const{ v4: uuid } = require('uuid')
const MailosaurClient = require('mailosaur')

const EMAIL_SECRET = 'TpHr8MKwjWhX3Ft'
const EMAIL_SERVER = 'x5g2spie'
const emailClient = new MailosaurClient(EMAIL_SECRET)

describe('Order Message Queue', function () {
  const userEmail = `testUser${uuid()}.${EMAIL_SERVER}@mailosaur.io`

  const orderBody = {
    'name': 'TEST_renaldo',
    'userEmail': userEmail,
    'userId': uuid(),
    'address': 'Rruga Migjeni',
    'products': [
      {
        'itemId': uuid(),
        'amount': {
          'currency': 'ALL',
          'value': 24.24
        }
      }
    ]
  }
  // stored order in dynamoDb
  let orderInDb

  it('Create Order', async function () {
    // assert.equal(typeof (user), 'object')
    
    orderInDb = await createOrder(orderBody)
    console.log(orderInDb)

    // eslint-disable-next-line no-unused-vars
    const{ id, TYPE, createdAt, ...createdOrder } = orderInDb

    assert.deepStrictEqual(orderBody, createdOrder)
  })
  

  it('Order Email', async function () {
    const emailText = await getEmailText(userEmail)
    assert.deepStrictEqual(orderInDb, JSON.parse(emailText))
  })

  // more tests could be added for JSON schema input validation

})


async function getEmailText(email) {
  // waits up to 20seconds for email (amazon ses takes about 0-3seconds)
  const message = await emailClient.messages.get(EMAIL_SERVER, {
    sentTo: email
  })

  console.log(message.text.body)
  return message.text.body
}

async function createOrder( body) {
  try{
    const orderData = await axios.post('https://p50ywlls4e.execute-api.eu-central-1.amazonaws.com/prod/order', body )
    return orderData.data
  } catch(err) {
    console.log('create order error', err)
  }
}
