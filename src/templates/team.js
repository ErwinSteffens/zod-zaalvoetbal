import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

export default ({ data }) => {
    const team = data.teamJson
    return (
        <Layout>
            <div>Team page: {team.id}</div>
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
            }
        }
    }
`
