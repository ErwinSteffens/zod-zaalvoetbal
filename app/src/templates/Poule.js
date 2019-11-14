import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import Standings from '../components/Standings'
import PouleGames from '../components/PouleGames'

export default ({ data }) => {
    const poule = data.pouleJson

    let games = List(poule.games)
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

    return (
        <Layout>
            <Helmet>
                <title>ZOD Zaalvoetbal - {poule.name}</title>
            </Helmet>
            <h3>{poule.name}</h3>
            <h4>Stand</h4>
            <Standings poule={poule} />
            <h4>Wedstrijden</h4>
            <PouleGames games={games} />
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
`
