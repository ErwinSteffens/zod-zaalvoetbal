import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'

export default ({ data }) => {
    const poule = data.locationJson
    return (
        <Layout>
            <div>Location page: {poule.id}</div>
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        locationJson(id: { eq: $id }) {
            id
            venue
            city
        }
    }
`
