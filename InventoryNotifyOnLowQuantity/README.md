# InventoryNotifyOnLowQuantity

By enabling Streams on the DynamoDB inventory table, this Lambda function will receive events whenever items on the Inventory table are modified.
We read those events (up too 100) in the Records array on the event object.

The lambda function has two environment variables configured on it (see Lambda Function page in AWS console), SNS_ARN and MIN_ITEM_QUANTITY.  
You can see these values being read in within the handler function.

If the item has been modified and its new quantity is less than MIN_ITEM_QUANTITY, then an SNS topic is notified.   That SNS topic can be configured with email addresses; or even another lambda function.  In this project, see the very simple InventoryLowFollowOn lambda function which properly handles the event generated by SNS when that function is a subscriber to the SNS topic.


