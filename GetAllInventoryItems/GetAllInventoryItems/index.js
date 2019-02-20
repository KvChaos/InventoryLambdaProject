const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

if (typeof Promise === 'undefined') {
    console.log("Using Bluebird for Promises");
    AWS.config.setPromisesDependency(require('bluebird'));
}

const docClient = new AWS.DynamoDB.DocumentClient();


module.exports = {
    handler
}


async function handler(event) {

    const params = { TableName: 'inventory' };

    let itemsArr = await docClient.scan(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(itemsArr),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return response;
};
