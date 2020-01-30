import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import cn from 'classnames'
import moment from 'moment'

import ClubIcon from './ClubIcon'

import 'react-toggle/style.css'

const Games = ({ games, teamId, clubId, showScores }) => {
    return (
        <div className="games-table">
            {games.map(game => {
                const { status, homeTeam, homeScore, awayTeam, awayScore } = game

                const isPlayed = showScores && status !== 'planned'
                const middleClasses = cn('game-content', {
                    'game-content-score': isPlayed,
                    'game-content-time': !isPlayed
                })

                const middleContent = isPlayed
                    ? `${homeScore} - ${awayScore}`
                    : moment(game.time).format('LT')

                let footerTxt = null
                if (status === 'both-team-no-show') {
                    footerTxt = `Beide niet op komen dagen.`
                } else if (status === 'home-team-no-show') {
                    footerTxt = `${homeTeam.fullName} niet op komen dagen.`
                } else if (status === 'away-team-no-show') {
                    footerTxt = `${awayTeam.fullName} niet op komen dagen.`
                }

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
                                <ClubIcon club={homeTeam.club} />
                            </Link>
                            <div className={middleClasses}>{middleContent}</div>
                            <Link
                                className={cn('game-team', 'game-team-away', {
                                    highlight: teamId === awayTeam.id || clubId === awayTeam.club.id
                                })}
                                to={`/${awayTeam.club.id}/${awayTeam.name}`}
                            >
                                <ClubIcon club={awayTeam.club} />
                                <div className="game-team-name">{awayTeam.fullName}</div>
                            </Link>
                            {footerTxt && (
                                <div className="game-footer text-danger">{footerTxt}</div>
                            )}
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
