import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'

import Layout from '../components/Layout'
import Standings from '../components/Standings'
import PouleGames from '../components/PouleGames'
import TemporaryWarning from '../components/TemporaryWarning'
import { Head as DefaultHead } from '../components/Head'

const PouleTemplate = ({ data }) => {
  const poule = data.pouleJson

  const games = useMemo(() => {
    return List(poule.games)
      .groupBy((game) => {
        return moment(game.time).startOf('day').toDate()
      })
      .map((games) => {
        return games
          .groupBy((game) => {
            return game.location.jsonId
          })
          .map((games) =>
            games.groupBy((game) => {
              return game.field
            })
          )
      })
  }, [poule])

  return (
    <Layout>
      <h3>{poule.name}</h3>
      <h4>Stand</h4>
      <Standings poule={poule} />
      <h4>Wedstrijden</h4>
      {poule.temporary && <TemporaryWarning />}
      <PouleGames games={games} />
    </Layout>
  )
}

export function Head({ data }) {
  const poule = data.pouleJson
  return <DefaultHead title={['Poule', poule.name]} />
}

export const query = graphql`
  query ($id: String!) {
    pouleJson(jsonId: { eq: $id }) {
      jsonId
      name
      temporary
      teamScores {
        team {
          jsonId
          name
          fullName
          isChampion
          club {
            jsonId
            name
          }
        }
        rank
        points
        gamesPlayed
        gamesWon
        gamesLost
        gamesDraw
        goalsFor
        goalsAgainst
        goalsDifference
      }
      games {
        time
        status
        location {
          jsonId
          venue
          city
        }
        field
        homeScore
        awayScore
        homeTeam {
          jsonId
          name
          fullName
          club {
            jsonId
            name
          }
        }
        awayTeam {
          jsonId
          name
          fullName
          club {
            jsonId
            name
          }
        }
      }
    }
  }
`

export default PouleTemplate
