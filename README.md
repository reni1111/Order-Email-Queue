

# Order Message Queue

We will be building this infrastructure.

![infrastructure](https://order-message-queue.s3.eu-central-1.amazonaws.com/Order+message+Queue.png)

Tools used: 
1. AWS Cloud Development Kit - Cloud infrastructure using javascript
2. API Gateway - Managed by AWS
3. Lambda - Cloud functions
4. Amazon Simple Queue - Managed Queue
5. DynamoDb - Fast NoSQL for any scale

The whole application is implemented by the principle "Infrastructure as Code", so you just need an Amazon account run these commands and the whole application would be hosted in your cloud:

1. Add to env your amazon access keys
2. run `npm install`  
3. `npm run deploy`

You are done :)

## Cloud Formation Stacks
To implement the solution as Infrastructure as Code I used 2 stacks:
1. `dbStack` 
2. `ordersStack` 
 
**Stack: `dbStack`**
- Deploys DynamoDb table `Orders`, I have set the billing mode `OnDemand` so there will be no weird problems even if many people hit it.

**Stack: `ordersStack`**
- Deploys ApiGateway with route `/order` and method `POST`
- Deploys SQS
- Deploys 2 lambda: 
  - `createOrder` => ApiGateway will redirect the request here (once it gets the request it will run the JSON schema to check if the request is valid), it has access to send messages to the Queue (producer)
  - `createOrderMail` => SQS consumer, once it gets the event will send an email to the `userEmail` using SES and will put a record on DynamoDb
- Lambdas are complied using Webpack because of the tree-shaking (small size=> small cold start)

## Postman Collection
I already hosted the app in my AWS account, you can find postman collection in [here](https://github.com/reni1111/Order-Email-Queue/blob/master/Postman-%20Order-Email-Queue.postman_collection.json).


## Automation tests:
We want to make sure that we don't break the system when we edit code, so it's time for automation testing.
I have used [mocha](https://www.npmjs.com/package/mocha) framework, tests can be found [here](https://github.com/reni1111/Order-Email-Queue/blob/master/test/Test.js).

To run the tests:
1. run `npm install`
2. run `npm run test`
Enjoy

Problems:
To test the flow end to end I needed to make sure the email is correct too, automating the opening of the email and getting the content can be tricky...

Solution:
I have used [mailosaur](https://mailosaur.com/) which makes automating email tests easier.

