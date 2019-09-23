import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'

export default ({ data }) => {
    const poule = data.pouleJson
    return (
        <Layout>
            <div>Poule page: {poule.id}</div>
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        pouleJson(id: { eq: $id }) {
            id
            name
        }
    }
`
