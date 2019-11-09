import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import Layout from '../../components/SheetLayout'
import ClubLogo from '../../components/ClubLogo'

export default ({ data }) => {
    const location = data.locationJson

    const games = List(location.games)
        .groupBy(game => {
            return moment(game.time)
                .startOf('day')
                .toDate()
        })
        .sortBy((_v, k) => k)

    return (
        <Layout className="games">
            <Helmet>
                <title>Programma - {location.venue}</title>
            </Helmet>
            {games.entrySeq().map(([date, games]) => {
                let lastPoule = null
                return (
                    <div className="page">
                        <h3>Programma</h3>
                        <h5>
                            {moment(date).format('dddd LL')} - {location.venue}
                        </h5>

                        <div className="games-table">
                            {games.map(game => {
                                const { homeTeam, awayTeam } = game
                                const poule = homeTeam.poule

                                let pouleHeader = null
                                if (lastPoule === null || lastPoule !== poule.id) {
                                    pouleHeader = <h4 className="poule">{poule.name}</h4>
                                }
                                lastPoule = poule.id

                                return (
                                    <>
                                        {pouleHeader}
                                        <div key={game.id} className="game">
                                            <div className="item team home">
                                                {homeTeam.fullName}
                                            </div>
                                            <div className="item logo">
                                                <ClubLogo club={homeTeam.club} small />
                                            </div>
                                            <div className="item time">
                                                {moment(game.time).format('LT')}
                                            </div>
                                            <div className="item logo">
                                                <ClubLogo club={awayTeam.club} small />
                                            </div>
                                            <div className="item team away">
                                                {awayTeam.fullName}
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <div className="info">
                            Kijk voor een volledig programma op <u>www.zodzaalvoetbal.nl</u>.
                        </div>
                    </div>
                )
            })}
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        locationJson(id: { eq: $id }) {
            id
            venue
            games {
                id
                time
                location {
                    id
                }
                homeTeam {
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
                awayTeam {
                    id
                    name
                    fullName
                    club {
                        id
                        name
                    }
                }
            }
        }
    }
`
