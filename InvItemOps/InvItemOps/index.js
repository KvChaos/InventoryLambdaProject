const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

if (typeof Promise === 'undefined') {
    console.log("Using Bluebird for Promises");
    AWS.config.setPromisesDependency(require('bluebird'));
}

// var awsClient = AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();



module.exports = {
    handler
}


async function handler(event) {

    console.log(`event:  ${JSON.stringify(event,null,4)}`);

    if (event.httpMethod == 'GET') {
        return await getMethodHandler(event);
    }
    else if (event.httpMethod == 'PUT') {
        return await putMethodHandler(event);
    }


};



async function getMethodHandler(event) {


    let itemId = event.pathParameters.itemid;
    console.log(`itemId:  ${itemId}`);

    const params = {
        TableName: 'inventory',
        Key: { 'product_id': itemId }
    };

    let queryData = await docClient.get(params).promise();

    console.log(`itemData returned from docClient:  ${JSON.stringify(queryData,null,4)}`);
    let item = queryData.Item ? queryData.Item : null;


    if (item) {
        return buildResponse(200, JSON.stringify(item));
    }
    return buildResponse(400, `Hey -- Inventory item with id ${itemId} not found`);
}


async function putMethodHandler(event) {

    // console.log("Show me the event.body:  " + JSON.stringify(event.body));

    let itemId = event.pathParameters.itemid;
    console.log(`itemId:  ${itemId}`);

    const putBody = JSON.parse(event.body);
    const newQuantity = Number(putBody.newQuantity);
    console.log(`newQuantity: ${newQuantity}`);


    const params = {
        TableName: 'inventory',
        Key: { 'product_id': itemId },
        ExpressionAttributeValues: { ':q': newQuantity },
        UpdateExpression: "set quantity=:q",
        ReturnValues: "ALL_NEW"
    };

    let updateData = await docClient.update(params).promise();

    console.log(`updateData returned from docClient:  ${JSON.stringify(updateData,null,4)}`);

    let item = updateData.Attributes;

    if (item) {
        return buildResponse(200, JSON.stringify(item));
    }
    return buildResponse(400, `Hey -- Put Inventory item with id ${itemId} just went south.`);
}


function buildResponse(status, bodyContent) {

    let response = {
        statusCode: status,
        body: bodyContent,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return response;
}
