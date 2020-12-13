const crypto = require('crypto')
const KSUID = require('ksuid')

const generateId = (date = new Date()) => {
  const payload = crypto.randomBytes(16)
  return KSUID.fromParts(date.getTime(), payload).string
}

module.exports = {
  generateId
}