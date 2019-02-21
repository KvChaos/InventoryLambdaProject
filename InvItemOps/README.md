# InvItemOps

Short for Inventory Item Operations.

This lamba function is the handler for both GET and PUT operations of a specific item from within API Gateway.  It reads the HTTP method out of the event from API Gateway to determine which handler action to invoke.

When creating the METHOD in API Gateway, select "Integration Type" as Lambda function and check the box to **Use Lambda Proxy Integration** then select this Lambda function.






