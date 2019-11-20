import React, { Fragment } from 'react'
import cn from 'classnames'
import moment from 'moment'

import ClubLogo from './ClubLogo'

import 'react-toggle/style.css'

const Games = ({ games, teamId, showScores }) => {
    return (
        <div className="games-table">
            {games
                .sortBy(g => g.time)
                .map(game => {
                    const { homeTeam, homeScore, awayTeam, awayScore } = game

                    const isPlayed = showScores && homeScore != null && awayScore != null
                    const middleClasses = cn('item', 'middle', {
                        score: isPlayed,
                        time: !isPlayed
                    })

                    const middleContent = isPlayed
                        ? `${homeScore} - ${awayScore}`
                        : moment(game.time).format('LT')

                    return (
                        <Fragment key={game.id}>
                            <div className="game">
                                <div
                                    className={cn('item', 'team', 'home', {
                                        highlight: teamId === homeTeam.id
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
                                        highlight: teamId === awayTeam.id
                                    })}
                                >
                                    {awayTeam.fullName}
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
        </div>
    )
}

Games.defaultProps = {
    showScores: true
}

export default Games
