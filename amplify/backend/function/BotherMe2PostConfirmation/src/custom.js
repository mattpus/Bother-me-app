/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
const AppSyncID = process.env.API_BOTHERME2_GRAPHQLAPIIDOUTPUT;
const TableName = `User-${AppSyncID}-${env}`; //Tablename , appsync ID, name of the environment

const userExists = async id => {
  const params = {
    TableName,
    Key: id,
  };

  try {
    const response = await docClient.get(params).promise();
    return !!response?.Item;
  } catch (e) {
    return false;
  }
};

const saveUser = async user => {
  const date = new Date();
  const dateStr = date.toISOString();
  const timestamp = date.getTime();
  const Item = {
    ...user,
    __typename: 'User',
    createdAt: dateStr,
    updatedAt: dateStr,
    _lastChangedAt: timestamp,
    _version: 1,
  };
  const params = {
    TableName,
    Item,
  };
  try {
    await docClient.put(params).promise();
  } catch (e) {
    console.log(e);
  }
};

exports.handler = async (event, context) => {
  console.log('LAMBDA FUNC IS WORKING, hey 28 November');
  console.log(event);

  if (!event?.request?.userAttributes) {
    console.log('No user data available');
    return;
  }
  const {sub, email, name} = event.request.userAttributes;
  const newUser = {
    id: sub,
    name,
    email,
    nofPosts: 0,
    nofFollowers: 0,
    nofFollowings: 0,
  };

  //check if user exists
  if (!(await userExists(newUser.id))) {
    await saveUser(newUser);
    console.log(`User ${newUser.id} has been saved to the database`);
  } else {
    console.log(`User ${newUser.id} already exists`);
  }
  return event;
};
