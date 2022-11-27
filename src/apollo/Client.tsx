import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import {createAuthLink, AuthOptions, AUTH_TYPE} from 'aws-appsync-auth-link';
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link';
import config from '../aws-exports';

// const typePolicies: TypePolicies = {
//   Query: {
//     fields: {
//       commentsByPost: {
//         keyArgs: ['postID', 'createdAt', 'sortDirection', 'filter'],
//         merge: mergeLists,
//       },
//       postsByDate: {
//         keyArgs: ['type', 'createdAt', 'sortDirection', 'filter'],
//         merge: mergeLists,
//       },
//     },
//   },
// };

// const Client = ({children}: IClient) => {
//   const {user} = useAuthContext();

//   const client = useMemo(() => {
//     const jwtToken =
//       user?.getSignInUserSession()?.getAccessToken().getJwtToken() || '';

//     const auth: AuthOptions = {
//       type: config.aws_appsync_authenticationType as AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
//       jwtToken,
//     };

//     const link = ApolloLink.from([
//       createAuthLink({url, region, auth}),
//       createSubscriptionHandshakeLink({url, region, auth}, httpLink),
//     ]);

//     return new ApolloClient({
//       link,
//       cache: new InMemoryCache({typePolicies}),
//     });
//   }, [user]);

//   return <ApolloProvider client={client}>{children}</ApolloProvider>;
// };

interface IClient {
  children: React.ReactNode;
}

const url = config.aws_appsync_graphqlEndpoint;
const region = config.aws_appsync_region;

const auth: AuthOptions = {
  type: config.aws_appsync_authenticationType as AUTH_TYPE.API_KEY,
  apiKey: config.aws_appsync_apiKey,
};

const httpLink = createHttpLink({uri: url});

const link = ApolloLink.from([
  createAuthLink({url, region, auth}),
  createSubscriptionHandshakeLink({url, region, auth}, httpLink),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const Client = ({children}: IClient) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Client;
