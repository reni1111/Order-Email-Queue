const cdk = require('@aws-cdk/core')
const lambda = require('@aws-cdk/aws-lambda')
const{ WebpackFunction } = require('aws-cdk-webpack-lambda-function')
const{ Effect, PolicyStatement } = require('@aws-cdk/aws-iam')
const apiGateway = require('@aws-cdk/aws-apigateway')
const sqs = require('@aws-cdk/aws-sqs')
const{ SqsEventSource } = require('@aws-cdk/aws-lambda-event-sources')

class OrdersStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    // creates queue in aws
    const orderQueue = new sqs.Queue(this, 'OrderQueue', {
      queueName: 'OrderQueue'
    })

    // webpackFunction => compiles my code with webpack and uploads it in a lambda
    const createOrder = new WebpackFunction(this, 'createOrder', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/Order/handler/createOrderHandler.js',
      config: 'webpack.config.js',
      functionName: 'createOrder'
    })
    createOrder.addEnvironment('queueUrl', orderQueue.queueUrl)
    // give IAM permission to send message to queue
    orderQueue.grantSendMessages(createOrder)


    const createOrderMail = new WebpackFunction(this, 'createOrderMail', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/Order/handler/createOrderMailHandler.js',
      config: 'webpack.config.js',
      functionName: 'createOrderMail'
    })
    // makes this lambda a consumer of the queue
    createOrderMail.addEventSource(new SqsEventSource(orderQueue))
    // iam permissions to send email
    createOrderMail.addToRolePolicy(new PolicyStatement({
      actions: ['ses:SendEmail', 'SES:SendRawEmail'],
      resources: ['*'],
      effect: Effect.ALLOW,
    }))

    // grant permissions
    const lambdas = [createOrder, createOrderMail]
    for(const lambda of lambdas) {
      lambda.addEnvironment('orderTable', props.ordersTable.tableName)
      // iam permissions to get/write to dynamoDb
      props.ordersTable.grantReadWriteData(lambda)

    }

    // API GATEWAY section
    const api = new apiGateway.RestApi(this, 'orders-api', {
      // allow cors
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS
      }
    })

    // creates the route /order
    const orderApi = api.root.addResource('order')

    // method createOrder
    const CreateOrderIntegration = new apiGateway.LambdaIntegration(createOrder)
    orderApi.addMethod('POST', CreateOrderIntegration)
    
  }
}

module.exports = {
  OrdersStack
}