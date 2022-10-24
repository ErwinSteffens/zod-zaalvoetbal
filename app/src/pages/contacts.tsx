import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { graphql, PageProps } from 'gatsby'

import Layout from '../components/Layout'
import ClubIcon from '../components/ClubIcon'
import Contact from '../components/Contact'
import { Head as DefaultHead } from '../components/Head'

const ContactsPage = ({ data }: PageProps<Queries.ContactsPageQuery>) => {
  const clubContacts = data.allClubJson.nodes

  return (
    <>
      <Layout className="contacts-page">
        <h3>Contact</h3>

        <Row>
          <Col md={6} lg={4}>
            <Contact
              header="Organisatie"
              name="Hellen Kloeze"
              email="hek@ows.no"
              phone="06-12942369"
            />
          </Col>
          <Col md={6} lg={4}>
            <Contact
              header="Organisatie"
              name="Edwin Guit"
              email="eguit@ziggo.nl"
              phone="06-41869325"
            />
          </Col>
          <Col md={6} lg={4}>
            <Contact
              header="Website + Uitslagen"
              name="Erwin Steffens"
              email="erwinsteffens@gmail.com"
              phone="06-48482334"
            />
          </Col>
        </Row>
        <h4 className="mt-5">Club coördinatoren</h4>
        <Row>
          {clubContacts.map((club) => {
            return (
              <Col key={club.jsonId} md={6} lg={4}>
                <Contact
                  header={
                    <>
                      <ClubIcon className="mr-2" club={club} />
                      {club.name}
                    </>
                  }
                  name={club.contact}
                  email={club.contactEmail}
                  phone={club.contactPhone}
                />
              </Col>
            )
          })}
        </Row>
      </Layout>
    </>
  )
}

export function Head() {
  return <DefaultHead title="Contact" />
}

export const query = graphql`
  query ContactsPage {
    allClubJson(sort: { fields: name }) {
      nodes {
        jsonId
        name
        contact
        contactPhone
        contactEmail
      }
    }
  }
`

export default ContactsPage