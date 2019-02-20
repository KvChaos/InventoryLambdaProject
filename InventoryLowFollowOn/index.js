const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });




module.exports = {
    handler
}



function handler(event, context, callback) {


    const msg = 'Hello from Lambda in the InventoryLowFollowOn.';
    console.log(msg);
    console.log(`event:  ${JSON.stringify(event,null,4)}`);

    const response = {
        statusCode: 200,
        body: JSON.stringify(msg)
    };
    return response;

}
