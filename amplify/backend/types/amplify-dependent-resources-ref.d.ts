export type AmplifyDependentResourcesAttributes = {
  auth: {
    BotherMe2: {
      IdentityPoolId: 'string';
      IdentityPoolName: 'string';
      HostedUIDomain: 'string';
      OAuthMetadata: 'string';
      UserPoolId: 'string';
      UserPoolArn: 'string';
      UserPoolName: 'string';
      AppClientIDWeb: 'string';
      AppClientID: 'string';
    };
  };
  function: {
    BotherMe2PostConfirmation: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
  };
  api: {
    BotherMe2: {
      GraphQLAPIKeyOutput: 'string';
      GraphQLAPIIdOutput: 'string';
      GraphQLAPIEndpointOutput: 'string';
    };
  };
};
