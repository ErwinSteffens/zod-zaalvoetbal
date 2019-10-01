import React from 'react'
import cn from 'classnames'
import moment from 'moment'
import { Link } from 'gatsby'

import ClubLogo from './ClubLogo'

import 'react-toggle/style.css'

const Games = ({ date, location, games, highlightTeamId }) => {
    return (
        <div className="games">
            <div className="header">
                <h6>{moment(date).format('dddd LL')}</h6>
                {location && (
                    <Link className="location" to={`/locaties/${location.id}`}>
                        {location.venue}
                    </Link>
                )}
            </div>
            {games.map(game => {
                const { homeTeam, homeGoals, awayTeam, awayGoals } = game

                const isPlayed = homeGoals !== undefined && awayGoals !== undefined
                const middleClasses = cn('item', 'middle', {
                    score: isPlayed,
                    time: !isPlayed
                })

                const middleContent = isPlayed
                    ? `${homeGoals} - ${awayGoals}`
                    : moment(game.time).format('LT')

                return (
                    <div key={game.id} className="game">
                        <div
                            className={cn('item', 'team', 'home', {
                                highlight: highlightTeamId === homeTeam.id
                            })}
                        >
                            {homeTeam.fullName}
                        </div>
                        <div className="item logo">
                            <ClubLogo club={homeTeam.club} />
                        </div>
                        <div className={middleClasses}>{middleContent}</div>
                        <div className="item logo">
                            <ClubLogo club={awayTeam.club} />
                        </div>
                        <div
                            className={cn('item', 'team', 'away', {
                                highlight: highlightTeamId === awayTeam.id
                            })}
                        >
                            {awayTeam.fullName}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Games
