// errorKey => can be used as keys on i18n (on client side)
// message => for information only

const errors = {
  GeneralError: {
    message: 'Something went wrong! (contact backend)',
    errorKey: 'GeneralError',
    statusCode: 500
  },
  // order
  OrderGeneralError: {
    message: 'Order: Something went wrong!',
    errorKey: 'OrderGeneralError',
    statusCode: 500
  },
  OrderNotFoundError: {
    message: 'Order: Does not exist!',
    errorKey: 'OrderNotFoundError',
    statusCode: 404
  },
  OrderMailGeneralError: {
    message: 'OrderMail: Something went wrong!',
    errorKey: 'OrderMailGeneralError',
    statusCode: 500
  }
}

module.exports = { errors }
