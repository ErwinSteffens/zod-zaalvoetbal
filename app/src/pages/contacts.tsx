import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { graphql, PageProps } from 'gatsby';

import Layout from '../components/Layout';
import ClubIcon from '../components/ClubIcon';
import Contact from '../components/Contact';
import { Head as DefaultHead } from '../components/Head';

const ContactsPage = ({ data }: PageProps<Queries.ContactsPageQuery>) => {
  const contacts = data.allContactJson.nodes;

  const nonClubContacts = contacts.filter((c) => c.description);
  const clubContacts = contacts.filter((c) => !!c.club);

  return (
    <>
      <Layout className="contacts-page">
        <h3>Contact</h3>

        <Row>
          {nonClubContacts.map((contact) => {
            return (
              <Col key={contact.name} md={6} lg={4}>
                <Contact
                  header={<>{contact.description}</>}
                  name={contact.name}
                  email={contact.email}
                />
              </Col>
            );
          })}
        </Row>
        <h4 className="mt-5">Club coördinatoren</h4>
        <Row>
          {clubContacts.map((contact) => {
            return (
              <Col key={contact.name} md={6} lg={4}>
                <Contact
                  header={
                    <>
                      <ClubIcon className="mr-2" club={contact.club!} />
                      {contact.name}
                    </>
                  }
                  name={contact.name}
                  email={contact.email}
                />
              </Col>
            );
          })}
        </Row>
      </Layout>
    </>
  );
};

export function Head() {
  return <DefaultHead title="Contact" />;
}

export const query = graphql`
  query ContactsPage {
    allContactJson {
      nodes {
        description
        name
        email
        club {
          jsonId
          name
        }
      }
    }
  }
`;

export default ContactsPage;
