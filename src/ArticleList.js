import React, { Component } from 'react';
import { withApollo, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const ArticleItem = ({ article }) => (
  <li style={{ width: 600 }}>
    <h3>{article.title}</h3>
  </li>
);

const query = gql`
{
  allArticles(orderBy:updatedAt_DESC) {
    id
    title
  }
}
`;

class ArticleList extends Component {

  state = {
    allArticles: []
  }

  async componentDidMount() {
    this.Subscription = this.props.allQuery.subscribeToMore({
      document: gql`
        subscription {
          Article(filter: {
            mutation_in: [CREATED, UPDATED]
          }) {
            mutation
            node {
              id
              title
            }
          }
        }
      `,
      variables: null,
      updateQuery: (previousState, { subscriptionData }) => {
        console.dir(subscriptionData);
        const data = subscriptionData.data.Article;
        if (data.mutation === 'CREATED') {
          const newArticle = data.node;
          const articles = previousState.allArticles.concat([newArticle]);
          return {
            allArticles: articles
          };
        } else if (data.mutation === 'UPDATED') {
          const articles = previousState.allArticles.slice();
          const updatedArticle = data.node;
          const oldArticleIndex = articles.findIndex(x => {
            return updatedArticle.id === x.id;
          });
          articles[oldArticleIndex] = updatedArticle;
          return {
            allArticles: articles
          };
        }
        return previousState;
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allQuery.allArticles) {
      this.setState({
        allArticles: nextProps.allQuery.allArticles
      });
    }
  }

  render() {
    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {Boolean(this.state.allArticles) && this.state.allArticles.map(article => <ArticleItem key={article.id} article={article} />)}
      </ul>
    );
  }

}

export default compose(
  graphql(query, { name: 'allQuery' })
)(withApollo(ArticleList));
