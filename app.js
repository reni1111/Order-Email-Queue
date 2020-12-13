const cdk = require('@aws-cdk/core')
const{ DatabaseStack } =  require('./stacks/databaseStack')
const{ OrdersStack } =  require('./stacks/ordersStack')

const app = new cdk.App()

const databaseStack = new DatabaseStack(app, 'dbStack')

const ordersStack = new OrdersStack(app, 'ordersStack', {
  ordersTable: databaseStack.ordersTable
})