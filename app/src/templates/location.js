import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'

import Layout from '../components/layout'
import GameTable from '../components/GameTable'

export default ({ data }) => {
    const location = data.locationJson

    var games = List(location.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .sortBy((_v, k) => k)

    return (
        <Layout>
            <div>Location page: {location.id}</div>

            {games.entrySeq().map(([date, games]) => {
                return <GameTable date={date} games={games} />
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
