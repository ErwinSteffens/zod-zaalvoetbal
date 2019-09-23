import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'

export default ({data}) => {
    const team = data.clubJson
    return (
        <Layout>
            <div>Club page test: {team.id}</div>
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        clubJson(id: { eq: $id }) {
            id
            name
        }
    }
`
