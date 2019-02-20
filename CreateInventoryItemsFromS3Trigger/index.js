const AWS = require('aws-sdk');
const csvToJson = require('csvtojson');

// Set the region 
AWS.config.update({ region: 'us-east-1' });

if (typeof Promise === 'undefined') {
    console.log("Using Bluebird for Promises");
    AWS.config.setPromisesDependency(require('bluebird'));
}

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });


module.exports = {
    handler
}



async function handler(event) {

    console.log(`event:  ${JSON.stringify(event,null,4)}`);

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    const fileContents = await getFileContentsFromS3(bucket, key);
    const csvItemsAsJson = await csvToJson().fromString(fileContents);


    const itemsToInsert = csvItemsAsJson.map(csvItem => {
        let item = {
            'product_id': csvItem.Id,
            'product_name': csvItem.Item,
            'product_price': csvItem.Price,
            'quantity': 0
        };
        return item;
    });


    let results = [];

    for (const item of itemsToInsert) {

        let params = {
            TableName: "inventory",
            Item: item
        };

        let dataret = await docClient.put(params).promise();
        results.push(dataret);
    }


    const response = {
        statusCode: 200,
        body: results
    };
    return response;
};


async function getFileContentsFromS3(Bucket, Key) {

    console.log(`bucket/key:  ${Bucket}/${Key}`);

    let params = {
        Bucket,
        Key
    };

    let data = await s3.getObject(params).promise();
    let fileContents_utf8 = data.Body.toString("utf8");
    console.log(`fileContents_utf8: ${fileContents_utf8}`);
    return fileContents_utf8;
}
