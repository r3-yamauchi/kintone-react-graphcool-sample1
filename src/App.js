import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
// import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import ArticleList from './ArticleList';

const serviceId = "xxxxxxxx99x9x99999xx99xxx";
const httpLink = createHttpLink({ uri: `https://api.graph.cool/simple/v1/${serviceId}` });

const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.graph.cool/v1/${serviceId}`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>Graphcool からデータを取得する</h1>
      <ArticleList />
    </div>
  </ApolloProvider>
);

export default App;
