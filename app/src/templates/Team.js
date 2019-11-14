import React, { useState } from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'
import Toggle from 'react-toggle'
import { Row, Col } from 'react-bootstrap'

import Layout from '../components/Layout'
import ClubLogo from '../components/ClubLogo'
import Standings from '../components/Standings'
import PouleGames from '../components/PouleGames'
import { Helmet } from 'react-helmet'

export default ({ data }) => {
    const [showAll, setShowAll] = useState(true)

    const team = data.teamJson
    const poule = team.poule

    var games = poule.games
    if (!showAll) {
        games = games.filter(g => g.homeTeam.id === team.id || g.awayTeam.id === team.id)
    }

    games = List(games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .map(games => {
            return games
                .groupBy(game => {
                    return game.location.id
                })
                .map(games =>
                    games.groupBy(game => {
                        return game.field
                    })
                )
        })

    games = games.sortBy((_v, k) => k)

    return (
        <Layout className="team">
            <Helmet>
                <title>ZOD Zaalvoetbal - {team.fullName}</title>
            </Helmet>
            <div className="clearfix">
                <ClubLogo className="page-header" club={team.club} />
                <h3>{team.fullName}</h3>
                <h6 className="subtitle">{poule.name}</h6>
            </div>
            <h4 className="mb-4">Stand</h4>
            <Standings poule={poule} teamId={team.id} />
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
            <PouleGames games={games} teamId={team.id} />
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
                teamScores {
                    team {
                        id
                        name
                        fullName
                        club {
                            id
                            name
                        }
                    }
                    rank
                    points
                    gamesPlayed
                    gamesWon
                    gamesLost
                    gamesDraw
                    goalsFor
                    goalsAgainst
                    goalsDifference
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
                    field
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
    }
`
