import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import Layout from '../../components/SheetLayout'
import Games from '../../components/Games'

export default ({ data }) => {
    const location = data.locationJson

    const games = List(location.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .map(games =>
            games
                .groupBy(game => {
                    return game.field
                })
                .map(games =>
                    games.groupBy(game => {
                        return game.poule.id
                    })
                )
        )
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <Helmet>
                <title>Programma - {location.venue}</title>
            </Helmet>
            {games.entrySeq().map(([date, gamesOnDate]) => {
                return (
                    <Row key={date.toString()} className="games page">
                        <Col>
                            <h3>Programma</h3>
                            <h6 className="games-header">{location.venue}</h6>
                            <h6 className="games-header date">{moment(date).format('dddd LL')}</h6>
                            {gamesOnDate.entrySeq().map(([field, gamesOnField]) => {
                                return (
                                    <Fragment key={field || 'field'}>
                                        {field && <h6 className="games-header">Veld {field}</h6>}
                                        {gamesOnField.entrySeq().map(([pouleId, gamesByPoule]) => {
                                            const poule = gamesByPoule.first().poule
                                            return (
                                                <Fragment key={pouleId}>
                                                    <h6 className="games-header last">
                                                        {poule.name}
                                                    </h6>
                                                    <Games
                                                        games={gamesByPoule}
                                                        showScores={false}
                                                    />
                                                </Fragment>
                                            )
                                        })}
                                    </Fragment>
                                )
                            })}
                            <div className="info">
                                Kijk voor een volledig programma op <u>www.zodzaalvoetbal.nl</u>.
                            </div>
                        </Col>
                    </Row>
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
                field
                homeTeam {
                    id
                    name
                    fullName
                    club {
                        id
                        name
                    }
                    poule {
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
