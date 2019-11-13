import React from 'react'
import { graphql, Link } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import Standings from '../components/Standings'
import Games from '../components/Games'

export default ({ data }) => {
    const poule = data.pouleJson

    var games = List(poule.games)
        .groupBy(game => {
            const date = moment(game.time)
                .startOf('day')
                .toDate()

            return `${date}__${game.location.id}`
        })
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <Helmet>
                <title>ZOD Zaalvoetbal - {poule.name}</title>
            </Helmet>
            <h3>{poule.name}</h3>
            <h4>Stand</h4>
            <Standings poule={poule} />

            <h4>Wedstrijden</h4>
            {games.entrySeq().map(([key, games]) => {
                // Get date and location from first item as they are grouped by location and date
                const first = games.first()
                const date = first.time
                const location = first.location

                return (
                    <>
                        <div key={`${key}_header`} className="games-header">
                            <h6>{moment(date).format('dddd LL')}</h6>
                            {location && (
                                <Link className="location" to={`/locaties/${location.id}`}>
                                    {location.venue}
                                </Link>
                            )}
                        </div>
                        <Games key={key} games={games}></Games>
                    </>
                )
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        pouleJson(id: { eq: $id }) {
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
                location {
                    id
                    venue
                    city
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
