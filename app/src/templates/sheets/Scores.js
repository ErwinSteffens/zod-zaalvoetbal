import React from 'react'
import { graphql } from 'gatsby'
import { List } from 'immutable'
import cn from 'classnames'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import Layout from '../../components/SheetLayout'

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
        <Layout className="scores">
            <Helmet>
                <title>Uitslagen formulier - {location.venue}</title>
            </Helmet>
            {games.entrySeq().map(([date, games]) => {
                let lastPoule = null
                let lastField = null
                return (
                    <div className="page">
                        <h3>{moment(date).format('dddd LL')}</h3>
                        <h5>{location.venue}</h5>

                        <div className="table">
                            <div className="game header">
                                <div className="item time">Tijd</div>
                                <div className="item poule">Poule</div>
                                <div className={cn('item', 'team', 'home')}>Thuis team</div>
                                <div className={cn('item', 'team', 'away')}>Uit team</div>
                                <div className="item score">Uitslag</div>
                            </div>

                            {games.map(game => {
                                const { homeTeam, awayTeam } = game
                                const poule = homeTeam.poule

                                let classes = cn('game', {
                                    'mt-4': lastPoule !== null && lastPoule !== poule.id
                                })
                                lastPoule = poule.id

                                let fieldHeader =
                                    game.field && game.field !== lastField ? (
                                        <h6 className="field-header">Veld {game.field}</h6>
                                    ) : null
                                lastField = game.field

                                return (
                                    <>
                                        {fieldHeader}
                                        <div key={game.id} className={classes}>
                                            <div className="item time">
                                                {moment(game.time).format('LT')}
                                            </div>
                                            <div className="item poule">{poule.name}</div>
                                            <div className="item team home">
                                                {homeTeam.fullName}
                                            </div>
                                            <div className="item team away">
                                                {awayTeam.fullName}
                                            </div>
                                            <div className="item score"></div>
                                            <div className="item score"></div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <div className="info">
                            Uitslagen kunnen worden doorgegeven door een foto van dit formulier te
                            maken en te versturen via e-mail (erwinsteffens@gmail.com) of WhatsApp
                            (06-48482334).
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
                field
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
