import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'

export default ({ data }) => {
    const locations = data.allLocationJson.nodes

    return (
        <Layout className="downloads">
            <h3>Downloads</h3>
            <h4 className="mt-5">Uitslag formulieren</h4>
            <p>
                Download hier de uitslag formulieren. Deze kunnen gebruikt worden voor het doorgeven
                van de uitslagen van de wedstrijden.
            </p>
            <ul className="list">
                {locations.map(location => {
                    return (
                        <li key={location.id}>
                            <a
                                key={location.id}
                                href={`/downloads/scores/Uitslagen - ${location.venue}.pdf`}
                            >
                                {location.venue}
                            </a>
                        </li>
                    )
                })}
            </ul>
            <h4 className="mt-5">Programma's</h4>
            <p>
                Download hier de wedstrijd programma's per sporthal. Elk bestand bevat the
                programma's voor alle speeldagen.
            </p>
            <ul className="list">
                {locations.map(location => {
                    return (
                        <li key={location.id}>
                            <a
                                key={location.id}
                                href={`/downloads/games/Programma - ${location.venue}.pdf`}
                            >
                                {location.venue}
                            </a>
                        </li>
                    )
                })}
            </ul>
            <h4 className="mt-5">Spelregels</h4>
            <ul>
                <li>
                    <a href={`/downloads/Spelregels.pdf`}>Spelregels 2019/2020</a>
                </li>
            </ul>
        </Layout>
    )
}

export const query = graphql`
    query {
        allLocationJson(sort: { fields: city }) {
            nodes {
                id
                venue
            }
        }
    }
`
