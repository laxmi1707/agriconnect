/**
 * API for account creation
 * Author Lakshmi Barthwal
 */
var AWS = require('aws-sdk');
var constants = require('./constants');

AWS.config.update({ region: constants.params.AWS_REGION });
function removeEmptyStringElements(obj) {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {// dive deeper in
      removeEmptyStringElements(obj[prop]);
    } else if (obj[prop] === '') {// delete elements that are empty strings
      delete obj[prop];
    }
  }
  return obj;
}

exports.handler = (event, context, callback) => {
  console.log('account creation API v1.0.0');
  var bodyJson = {};
  try {
    bodyJson = JSON.parse(event.body);
  } catch (e) {
    bodyJson = event.body;
  }
  var objectJson = removeEmptyStringElements(bodyJson);
  event.body = objectJson;

  if (event.queryStringParameters == null || event.queryStringParameters.action == null 
    || event.queryStringParameters.action == '') {
    console.log('action parameter is missing');
    callback(null, {
      statusCode: 500,
      headers: constants.params.CORS_HEADER,
      body: JSON.stringify({ 'errcode': 'ERR.00002', 'errdescription': 'action parameter is missing' })
    });
  } else {
    console.log("action: " + event.queryStringParameters.action);
    var fn = "require("+"'./"+event.queryStringParameters.action+".js"+"')";
    fn.handler(event, context, function (error, data) {
      if (error) {
        callback(null, {
          statusCode: 500,
          headers: constants.params.CORS_HEADER,
          body: JSON.stringify(error)
        });
      } else {
        callback(null, {
          statusCode: 200,
          headers: constants.params.CORS_HEADER,
          body: JSON.stringify(data)
        });
      }
    });
  }
};
