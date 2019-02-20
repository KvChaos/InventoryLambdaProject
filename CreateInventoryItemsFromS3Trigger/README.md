# Description

An upload to an S3 bucket is the trigger for a Lambda function.   Files should be named data**.txt.


# Instructions

## NPM 
After you clone the code, run
```
npm install
```


## DynamoDB

- Create a new table, inventory.  
- Make the primary partition key 'product_id'
- Record the ARN of the inventory table -- you'll need it below.

## IAM

In IAM, create a role called Lambda_CreateInventoryItemsFromS3.  It will need two AWS managed policies and one custom policy:

## AWS Managed Policies 
1.  AmazonS3ReadOnlyAccess
2.  AWSLambdaBasicExecutionRole

## Custom Policy

Create a custom policy and paste this policy.   **Substitute the ARN of the inventory DynamoDB table you created earlier.**
Call the policy C_DynamoDB_WriteToInventoryTable

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "dynamodb:PutItem",
            "Resource": "arn:aws:dynamodb:us-east-1:291009414040:table/inventory"
        }
    ]
}
```


## Lambda

- Create a new Function; "Author from Scratch"
- Role:  Choose an existing role
- Select the role we created in IAM:  Lambda_CreateInventoryItemsFromS3


## S3

- Go create an S3 bucket; call it whatever you like.
- In the S3 console, select the bucket and go to Properties > Events
- Click "Add Notification"
- Give the notification a name
- For events, select "All object create events"
- Prefix: data
- Suffix:  txt
- *(This will ensure that only files named data**.txt will trigger the event.)*
- Send to:  Lambda Function
- Lambda:  Lambda_CreateInventoryItemsFromS3


# Test

Now whenever a file named data**.txt is uploaded to this bucket, S3 will generate an event and send it to our lambda function.
Upload a file called data01.txt to your bucket with the following contents:

```
Item,Price,Id
USB Hub,43.99,38282
Asus Chromebook,499.00,50678
```

## Lambda Function

The lambda function reads the event from S3 to get the bucket and key of the file just uploaded.
It then downloads the contents of the file into the function's memory and parses it using a csvtojson package.
It parses each of the items and prepares them as individual items suitable for insertion into the DynamoDB inventory table.
The insertions are performed.

The result is that whenever a file is uploaded to the bucket, the items contained in the files should show up as individual inventory items in the DynamoDB table with quantity set to zero.



