import React from "react"
import { graphql } from "gatsby"

const ComponentName = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>

export const query = graphql`
  {
    allGameJson(filter: {homeTeam: {club: {id: {eq: "svv-04"}}}}) {
      edges {
        node {
          id
          homeTeam {
            fullName
          }
          awayTeam {
            fullName
          }
        }
      }
    }
  }
`

export default ComponentName
