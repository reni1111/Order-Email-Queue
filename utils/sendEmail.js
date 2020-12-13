let AWS = require('aws-sdk')
const ses = new AWS.SES({
  region: 'us-east-1'
})
const sendEmail = async (emailAddress, subject, data) => {
  const params = {
    Destination: { ToAddresses: emailAddress.split(',') },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: data
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: 'renaldobalaj11@gmail.com'
  }
  await ses.sendEmail(params).promise()
}

module.exports = {
  sendEmail
}