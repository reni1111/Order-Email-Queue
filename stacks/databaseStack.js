const cdk = require('@aws-cdk/core')
const dynamodb = require('@aws-cdk/aws-dynamodb')
const{ RemovalPolicy, } = require('@aws-cdk/core')
const{ BillingMode } = require('@aws-cdk/aws-dynamodb')

class DatabaseStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props)

    // creating table
    const ordersTable = new dynamodb.Table(this, 'ordersTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      tableName: 'Orders',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    })

    this.ordersTable= ordersTable
  }
}

module.exports = { DatabaseStack }
