import React from 'react'
import { graphql, PageProps } from 'gatsby'

import Layout from '../components/Layout'
import { Head as DefaultHead } from '../components/Head'

const DownloadsPage = ({ data }: PageProps<Queries.DownloadsPageQuery>) => {
  const locations = data.allLocationJson.nodes

  return (
    <Layout className="downloads">
      <h3>Downloads</h3>
      <h4 className="mt-5">Uitslag formulieren</h4>
      <p>
        Download hier de uitslag formulieren. Deze kunnen gebruikt worden voor het doorgeven van de
        uitslagen van de wedstrijden.
      </p>
      <ul className="list">
        {locations.map((location) => {
          return (
            <li key={location.jsonId}>
              <a key={location.jsonId} href={`/downloads/scores/Uitslagen - ${location.venue}.pdf`}>
                {location.venue}
              </a>
            </li>
          )
        })}
      </ul>
      <h4 className="mt-5">Programma's</h4>
      <p>
        Download hier de wedstrijd programma's per sporthal. Elk bestand bevat the programma's voor
        alle speeldagen.
      </p>
      <ul className="list">
        {locations.map((location) => {
          return (
            <li key={location.jsonId}>
              <a key={location.jsonId} href={`/downloads/games/Programma - ${location.venue}.pdf`}>
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

export function Head() {
  return <DefaultHead title="Downloads" />
}

export const query = graphql`
  query DownloadsPage {
    allLocationJson(sort: { fields: city }) {
      nodes {
        jsonId
        venue
      }
    }
  }
`

export default DownloadsPage
