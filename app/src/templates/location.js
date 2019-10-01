import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
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
            <div className="clearfix">
                <iframe
                    title={location.venue}
                    className="location-map"
                    frameborder="0"
                    style={{ border: 0 }}
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ9THDigjwt0cRaN5FuzGFjDk&key=AIzaSyCzh-2XRTB_MQdXyBPpEXQkyAxQz_FOibY"
                    allowfullscreen
                ></iframe>
                <h3>{location.venue}</h3>

                <span>
                    <b>Adres:</b>
                    <br />
                    De Pienhoek 4<br />
                    7761 CB Schoonebeek
                </span>
            </div>

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
