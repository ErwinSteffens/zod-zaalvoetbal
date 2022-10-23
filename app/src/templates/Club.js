import React, { Fragment } from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { List } from 'immutable'
import moment from 'moment'

import Games from '../components/Games'
import Layout from '../components/Layout'
import ClubIcon from '../components/ClubIcon'
import ChampionIcon from '../components/ChampionIcon'

const ClubTemplate = ({ data }) => {
    const club = data.clubJson

    const teams = club.teams.sort((a, b) => {
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
            <Helmet>
                <title>ZOD Zaalvoetbal - {club.name}</title>
            </Helmet>
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
                            <Link key={team.jsonId} as={Link} to={`/${club.jsonId}/${team.name}`}>
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
                    games = <Games games={gamesByDate} clubId={club.jsonId} />
                } else {
                    let gamesByLocation = gamesByDate.groupBy((game) => {
                        return game.location.jsonId
                    })

                    games = gamesByLocation.entrySeq().map(([locationId, gamesTest]) => {
                        const location = gamesTest.first().location

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
                                <Games games={gamesTest} clubId={club.jsonId} />
                            </Fragment>
                        )
                    })
                }

                return (
                    <Fragment key={date}>
                        <h6 key={date} className="games-header date">
                            {moment(date).format('dddd LL')}
                        </h6>
                        {games}
                        <br />
                    </Fragment>
                )
            })}
        </Layout>
    )
}

export const query = graphql`
    query ($id: String!) {
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
