import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import { Row, Col, Alert } from 'react-bootstrap'
import moment from 'moment'
import { Helmet } from 'react-helmet'

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

    const mapsUrl = `https://www.google.com/maps/embed/v1/place?q=place_id:${location.placeId}&key=AIzaSyCzh-2XRTB_MQdXyBPpEXQkyAxQz_FOibY`

    return (
        <Layout className="location">
            <Helmet>
                <title>ZOD Zaalvoetbal - {location.venue}</title>
            </Helmet>
            <Row className="location-info mb-4">
                <Col xs={12} md={6}>
                    <h3>{location.venue}</h3>
                    <b>Adres:</b>
                    <br />
                    {location.address}
                    <br />
                    {location.postalCode} {location.city}
                    <br />
                    <br />
                </Col>
                <Col xs={12} md={6}>
                    <iframe
                        title={location.venue}
                        className="location-map"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={mapsUrl}
                        allowFullScreen
                    ></iframe>
                </Col>
            </Row>

            <h4 className="mb-4">Wedstrijden</h4>
            <Row>
                <Col>
                    <Alert variant="warning">
                        Let op! De speelschemas zijn nog niet definitief.
                    </Alert>
                </Col>
            </Row>

            {games.entrySeq().map(([date, games]) => {
                return (
                    <>
                        <div key={`${date}_header`} className="games-header">
                            <h6>{moment(date).format('dddd LL')}</h6>
                        </div>
                        <Games key={date} date={date} games={games} showPoules />
                    </>
                )
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        locationJson(id: { eq: $id }) {
            id
            venue
            address
            postalCode
            city
            placeId
            games {
                id
                time
                poule {
                    id
                    name
                }
                location {
                    id
                }
                homeScore
                awayScore
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
