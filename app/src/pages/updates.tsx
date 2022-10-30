import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { graphql, PageProps } from 'gatsby';
import moment from 'moment';

import Layout from '../components/Layout';
import { Head as DefaultHead } from '../components/Head';

const UpdatesPage = ({ data }: PageProps<Queries.UpdatesPageQuery>) => {
  const updates = data.allUpdatesYaml.edges;

  return (
    <>
      <Layout>
        <h3>Site updates</h3>
        <Row>
          <Col sm={12}>
            {updates.map((node) => {
              const update = node.node;
              return (
                <p key={update.time}>
                  <h5>{moment(update.time).format('LLL')}</h5>
                  {update.message}
                </p>
              );
            })}
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export function Head() {
  return <DefaultHead title="Updates" />;
}

export const query = graphql`
  query UpdatesPage {
    allUpdatesYaml(sort: { fields: time, order: DESC }) {
      edges {
        node {
          time
          message
        }
      }
    }
  }
`;

export default UpdatesPage;
