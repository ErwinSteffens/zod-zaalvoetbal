import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'

import Layout from '../components/layout'
import PouleStandings from '../components/PouleStandings'
import GameTable from '../components/GameTable'

export default ({ data }) => {
    const team = data.teamJson
    const poule = team.poule

    var games = List(poule.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <div>Team page: {team.id}</div>

            <PouleStandings poule={poule} highlightTeamId={team.id} />

            {games.entrySeq().map(([date, games]) => {
                return (
                    <GameTable
                        date={date}
                        games={games}
                        highlightTeamId={team.id}
                    />
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
                    fullName
                    club {
                        id
                        name
                    }
                }
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
                    }
                    awayTeam {
                        id
                        name
                        fullName
                    }
                }
            }
        }
    }
`
