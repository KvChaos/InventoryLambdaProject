const AWS = require('aws-sdk');
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
AWS.config.update({ region: 'us-east-1' });



module.exports = {
    handler
}

// Read environment variables configured on the Lambda page.
const { SNS_ARN, MIN_ITEM_QUANTITY } = process.env;

async function handler(event, context, callback) {

    // let eventStr = JSON.stringify(event, null, 4);
    // console.log(`event:  ${eventStr}`);

    console.log(`SNS_ARN:  ${SNS_ARN}`);
    console.log(`MIN_ITEM_QUANTITY:  ${MIN_ITEM_QUANTITY}`);


    let results = [];

    for (const record of event.Records) {

        if (record.eventName !== 'MODIFY') {
            continue;
        }

        // "NewImage" simply refers to the post-modified version of the DynamoDB record
        let newImg = record.dynamodb.NewImage;

        if (!newImg.quantity) {
            continue; // Perhaps the quantity was not changed.
        }

        let productId = record.dynamodb.Keys.product_id.S;
        let productName = newImg.product_name.S;
        let newQuantity = Number(newImg.quantity.N);

        let r = `Product ${productId} quantity was changed to ${newQuantity}.`;
        console.log(r);
        results.push(r);


        if (newQuantity < MIN_ITEM_QUANTITY) {

            console.log("Sending message to SNS ARN:", SNS_ARN);

            let snsResponse = await SNS.publish({
                TargetArn: SNS_ARN,
                Message: `${r}  Item ${productId} ${productName} is at low quantity.`
            }).promise();
        }
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify(results)
    };

    // When the handler function is not marked as "async" -- then the way you 
    // synchronously respond is by using callback().
    // 
    // But if the function is marked as async (as this one is), you can simply 
    // return the response with is effectively a resolve(response) of a promise.
    // 
    // callback(null, response);

    return response;

};
