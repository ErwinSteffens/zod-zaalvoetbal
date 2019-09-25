import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'

export default ({ data }) => {
    const club = data.clubJson

    return (
        <Layout>
            <div>Club page test: {club.id}</div>
            <ul>
                {club.teams.map(team => (
                    <li>
                        <Link to={`${club.id}/${team.name}`}>
                            {team.fullName}
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        clubJson(id: { eq: $id }) {
            id
            name
            teams {
                id
                name
                fullName
            }
        }
    }
`
