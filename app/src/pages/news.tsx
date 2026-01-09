import React, { Fragment } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { graphql, PageProps } from 'gatsby';
import moment from 'moment';

import Layout from '../components/Layout';
import { Head as DefaultHead } from '../components/Head';
import NewsItem from '../components/NewsItem';

const NewsPage = ({ data }: PageProps<Queries.NewsPageQuery>) => {
  const news = data.allNewsYaml.edges;

  return (
    <>
      <Layout>
        <h3>Nieuws</h3>
        <Row>
          <Col sm={12}>
            {news.map((node) => {
              const item = node.node;
              return (
                <NewsItem key={item.time} time={item.time ?? ''} title={item.title} status={item.status} message={item.message} />
              );
            })}
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export function Head() {
  return <DefaultHead title="Nieuws" />;
}

export const query = graphql`
  query NewsPage {
    allNewsYaml(sort: { fields: time, order: DESC }) {
      edges {
        node {
          title
          time
          status
          message
        }
      }
    }
  }
`;

export default NewsPage;
