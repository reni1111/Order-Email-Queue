const{ errors } = require('./errors')

const ErrorWrapper = (errorKey) => {
  try{
    let error = errors[errorKey.message]

    if(!error){
      // in case errorKey isn't correct
      throw new Error('Bad Key')
    }
    return errorResponseMapper(error)

  } catch(e){
    console.log('BAD Key', errorKey, 'error', e)
    // default error
    return errorResponseMapper(errors['GeneralError'])
  }
}

const errorResponseMapper = (error) =>{
  return{
    statusCode: error.statusCode, 
    body: JSON.stringify(error)
  }
}

module.exports = {
  ErrorWrapper,
}
