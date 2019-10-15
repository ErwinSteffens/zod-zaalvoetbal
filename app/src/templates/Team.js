import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'
import Toggle from 'react-toggle'
import { Row, Col } from 'react-bootstrap'

import Layout from '../components/Layout'
import ClubLogo from '../components/ClubLogo'
import Standings from '../components/Standings'
import Games from '../components/Games'
import { Helmet } from 'react-helmet'

export default ({ data }) => {
    const [showAll, setShowAll] = useState(true)

    const team = data.teamJson
    const poule = team.poule

    var games = poule.games
    if (!showAll) {
        games = games.filter(g => g.homeTeam.id === team.id || g.awayTeam.id === team.id)
    }

    games = List(games).groupBy(game => {
        const date = moment(game.time)
            .startOf('day')
            .toDate()

        return `${date}__${game.location.id}`
    })

    games = games.sortBy((_v, k) => k)

    return (
        <Layout>
            <Helmet>
                <title>ZOD Zaalvoetbal - {team.fullName}</title>
            </Helmet>
            <div className="clearfix">
                <ClubLogo className="page-header" club={team.club} />
                <h3>{team.fullName}</h3>
            </div>
            <h4 className="mb-4">Stand</h4>
            <Standings poule={poule} highlightTeamId={team.id} />

            <Row className="mb-4">
                <Col xs={12} md={6}>
                    <h4>Wedstrijden</h4>
                </Col>
                <Col xs={12} md={6} className="text-md-right">
                    <label className="game-toggle">
                        <Toggle checked={showAll} onChange={e => setShowAll(e.target.checked)} />
                        <span className="label-text">Toon alle poule wedstrijden</span>
                    </label>
                </Col>
            </Row>

            {games.entrySeq().map(([key, games]) => {
                // Get date and location from first item as they are grouped by location and date
                const first = games.first()
                const date = first.time
                const location = first.location

                return (
                    <>
                        <div key={`${key}_header`} className="games-header">
                            <h6>{moment(date).format('dddd LL')}</h6>
                            <Link className="location" to={`/locaties/${location.id}`}>
                                {location.venue}
                            </Link>
                        </div>
                        <Games key={key} games={games} highlightTeamId={team.id} />
                    </>
                )
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        teamJson(id: { eq: $id }) {
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
                teams {
                    id
                    name
                    fullName
                    club {
                        id
                        name
                    }
                }
                games {
                    id
                    time
                    round
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
    }
`
