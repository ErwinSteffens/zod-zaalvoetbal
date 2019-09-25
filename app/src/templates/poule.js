import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'

import Layout from '../components/layout'
import PouleStandings from '../components/PouleStandings'
import GameTable from '../components/GameTable'

export default ({ data }) => {
    const poule = data.pouleJson

    var games = List(poule.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <div>Poule page: {poule.id}</div>

            <PouleStandings poule={poule} />

            {games.entrySeq().map(([date, games]) => {
                return <GameTable date={date} games={games}></GameTable>
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        pouleJson(id: { eq: $id }) {
            id
            name
            teams {
                id
                name
                fullName
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
`
