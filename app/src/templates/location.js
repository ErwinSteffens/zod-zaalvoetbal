import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'

import Layout from '../components/Layout'
import Games from '../components/Games'

export default ({ data }) => {
    const location = data.locationJson

    const games = List(location.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <Row className="mb-4">
                <Col xs={12} md={6}>
                    <h3>{location.venue}</h3>
                    <b>Adres:</b>
                    <br />
                    De Pienhoek 4<br />
                    7761 CB Schoonebeek
                    <br />
                    <br />
                </Col>
                <Col xs={12} md={6}>
                    <iframe
                        title={location.venue}
                        className="location-map"
                        frameborder="0"
                        style={{ border: 0 }}
                        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9THDigjwt0cRaN5FuzGFjDk&key=AIzaSyCzh-2XRTB_MQdXyBPpEXQkyAxQz_FOibY"
                        allowfullscreen
                    ></iframe>
                </Col>
            </Row>

            <h4>Wedstrijden</h4>
            {games.entrySeq().map(([date, games]) => {
                return <Games date={date} games={games} />
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        locationJson(id: { eq: $id }) {
            id
            venue
            city
            games {
                id
                time
                location {
                    id
                    venue
                    city
                }
                homeTeam {
                    id
                    name
                    fullName
                    club {
                        id
                        name
                    }
                }
                awayTeam {
                    id
                    name
                    fullName
                    club {
                        id
                        name
                    }
                }
            }
        }
    }
`
