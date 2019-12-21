import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import moment from 'moment'

import Games from './Games'

const PouleGames = ({ games, teamId }) => {
    return games.entrySeq().map(([date, gamesByDate]) => {
        return (
            <Fragment key={date}>
                <h6 key={date} className="games-header date">
                    {moment(date).format('dddd LL')}
                </h6>
                {gamesByDate.entrySeq().map(([locationId, gamesByLocation]) => {
                    const location = gamesByLocation.first().first().location

                    var locationName = location.venue
                    if (!locationName.includes(location.city)) {
                        locationName += ` - ${location.city}`
                    }

                    return (
                        <Fragment key={locationId}>
                            <h6 className="games-header sub">
                                <Link className="location" to={`/locaties/${location.id}`}>
                                    {locationName}
                                </Link>
                            </h6>
                            {gamesByLocation.entrySeq().map(([field, gamesByField]) => {
                                return (
                                    <Fragment key={field || 'field'}>
                                        {field && (
                                            <h6 className="games-header last">Veld {field}</h6>
                                        )}
                                        <Games games={gamesByField} teamId={teamId} />
                                    </Fragment>
                                )
                            })}
                        </Fragment>
                    )
                })}
            </Fragment>
        )
    })
}

export default PouleGames
