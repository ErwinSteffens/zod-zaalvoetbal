import React, { Fragment } from 'react'
import { graphql, Link, PageProps } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'

import Games from '../components/Games'
import Layout from '../components/Layout'
import ClubIcon from '../components/ClubIcon'
import ChampionIcon from '../components/ChampionIcon'
import { Head as DefaultHead } from '../components/Head'

const ClubTemplate = ({ data }) => {
  const club = data.clubJson

  const teams = [...club.teams].sort((a, b) => {
    if (a.sortId < b.sortId) {
      return -1
    }
    if (a.sortId > b.sortId) {
      return 1
    }
    return 0
  })

  let games = List(teams)
    .flatMap((team) => team.games)
    .groupBy((game) => {
      return moment(game.time).startOf('day').toDate()
    })
    .sortBy((v, k) => k)

  return (
    <Layout className="club-page">
      <div className="clearfix">
        <ClubIcon className="page-header" club={club} />
        <h3>{club.name}</h3>
        <b>Contactpersoon:</b>
        <br />
        {club.contact}
        <br />
        {club.contactEmail}
        <br />
        Tel: {club.contactPhone}
        <br />
        <br />
      </div>
      <h4>Teams</h4>

      <ul className="team-list">
        {teams.map((team) => {
          return (
            <li>
              <Link key={team.jsonId} to={`/${club.jsonId}/${team.name}`}>
                <ClubIcon club={club} className="mr-2" small />
                {team.fullName}
                {team.isChampion && <ChampionIcon className="ml-2" />}
              </Link>
            </li>
          )
        })}
      </ul>
      <br />
      <h4>Wedstrijden</h4>
      {games.entrySeq().map(([date, gamesByDate]) => {
        let allPlayed = gamesByDate.every((game) => game.status !== 'planned')

        gamesByDate = gamesByDate.sortBy((v) => v.time)

        let games
        if (allPlayed) {
          games = <Games games={gamesByDate.toArray()} clubId={club.jsonId} />
        } else {
          let gamesByLocation = gamesByDate.groupBy((game) => {
            return game.location.jsonId
          })

          games = gamesByLocation.entrySeq().map(([locationId, gamesForLocation]) => {
            const location = gamesForLocation.first().location

            var locationName = location.venue
            if (!locationName.includes(location.city)) {
              locationName += ` - ${location.city}`
            }

            return (
              <Fragment key={locationId}>
                <h6 className="games-header sub">
                  <Link className="location" to={`/locaties/${location.jsonId}`}>
                    {locationName}
                  </Link>
                </h6>
                <Games games={gamesForLocation.toArray()} clubId={club.jsonId} />
              </Fragment>
            )
          })
        }

        return (
          <Fragment key={date.toISOString()}>
            <h6 className="games-header date">{moment(date).format('dddd LL')}</h6>
            {games}
            <br />
          </Fragment>
        )
      })}
    </Layout>
  )
}

export function Head({ data }) {
  const club = data.clubJson
  return <DefaultHead title={club.name} />
}

export const query = graphql`
  query ClubPage($id: String!) {
    clubJson(jsonId: { eq: $id }) {
      jsonId
      name
      contact
      contactEmail
      contactPhone
      teams {
        jsonId
        name
        fullName
        isChampion
        sortId
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
            category
            club {
              jsonId
              name
            }
          }
          awayTeam {
            jsonId
            name
            fullName
            category
            club {
              jsonId
              name
            }
          }
        }
      }
    }
  }
`

export default ClubTemplate
