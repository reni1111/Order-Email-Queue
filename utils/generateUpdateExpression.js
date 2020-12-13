// takes updatePayload like {
//   name: "test"
// } and converts it to dynamo expression
// on db.update({  pass ...generateUpdateExpression

// remove payload contains keys you want to delete like ["gsi1pk", "gsi1sk"]
const generateUpdateExpression = (updatePayload, removePayload = []) => {
  let UpdateExpression = 'SET '
  let ExpressionAttributeValues = {}
  let ExpressionAttributeNames = {}

  const keys = Object.keys(updatePayload)
  for(const key of keys) {
    UpdateExpression += `#${key}=:${key},`
    ExpressionAttributeValues[`:${key}`] = updatePayload[key]
    ExpressionAttributeNames[`#${key}`] = key
  }
  
  UpdateExpression=UpdateExpression.slice(0, -1)

  if(removePayload.length!==0){
    UpdateExpression += ' REMOVE '
    removePayload.map(removeKey=> UpdateExpression += `${removeKey},`)
    UpdateExpression=UpdateExpression.slice(0, -1)
  }

  console.log(UpdateExpression)
  return{
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}

module.exports = {
  generateUpdateExpression
}