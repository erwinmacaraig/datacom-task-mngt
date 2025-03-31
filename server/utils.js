const _ = require('lodash');
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    region: process.env['REGION']
});
const dynamo = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://datacom_dynamodb_local:8000') });

const docClient = new AWS.DynamoDB.DocumentClient(
    {
        apiVersion: "2012-08-10",
        endpoint: new AWS.Endpoint('http://datacom_dynamodb_local:8000') 
    }
);

function checkRequestBody(req, res, next) {
    if (_.isEmpty(req.body)){
        return res.status(400).json(
            {
                "message": "Please provide the necessary parameters"
            }
        );
    } else {
        next();
    }    
} 

module.exports = {
    dynamo,
    docClient,
    checkRequestBody
}