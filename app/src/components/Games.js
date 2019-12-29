import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import cn from 'classnames'
import moment from 'moment'

import ClubLogo from './ClubLogo'

import 'react-toggle/style.css'

const Games = ({ games, teamId, clubId, showScores }) => {
    return (
        <div className="games-table">
            {games.map(game => {
                const { homeTeam, homeScore, awayTeam, awayScore } = game

                const isPlayed = showScores && homeScore != null && awayScore != null
                const middleClasses = cn('game-content', {
                    'game-content-score': isPlayed,
                    'game-content-time': !isPlayed
                })

                const middleContent = isPlayed
                    ? `${homeScore} - ${awayScore}`
                    : moment(game.time).format('LT')

                return (
                    <Fragment key={game.id}>
                        <div className="game">
                            <Link
                                className={cn('game-team', 'game-team-home', {
                                    highlight: teamId === homeTeam.id || clubId === homeTeam.club.id
                                })}
                                to={`/${homeTeam.club.id}/${homeTeam.name}`}
                            >
                                <div className="game-team-name">{homeTeam.fullName}</div>
                                <ClubLogo club={homeTeam.club} />
                            </Link>
                            <div className={middleClasses}>{middleContent}</div>
                            <Link
                                className={cn('game-team', 'game-team-away', {
                                    highlight: teamId === awayTeam.id || clubId === awayTeam.club.id
                                })}
                                to={`/${awayTeam.club.id}/${awayTeam.name}`}
                            >
                                <ClubLogo club={awayTeam.club} />
                                <div className="game-team-name">{awayTeam.fullName}</div>
                            </Link>
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
