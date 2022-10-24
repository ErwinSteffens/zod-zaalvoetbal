import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import cn from 'classnames'
import moment from 'moment'

import ClubIcon from './ClubIcon'

import 'react-toggle/style.css'

const Games = ({
  games,
  teamId,
  clubId,
  showScores = false,
}: {
  games: Queries.GameJson[]
  teamId?: string
  clubId: string
  showScores?: boolean
}) => {
  return (
    <div className="games-table">
      {games.map((game) => {
        const { time, status, homeTeam, homeScore, awayTeam, awayScore } = game

        const isPlayed = showScores && status !== 'planned'
        const middleClasses = cn('game-content', {
          'game-content-score': isPlayed,
          'game-content-time': !isPlayed,
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

        const homeClub = homeTeam.club
        const awayClub = awayTeam.club

        return (
          <Fragment key={`${homeTeam.jsonId}|${awayTeam.jsonId}|${time}`}>
            <div className="game">
              <Link
                className={cn('game-team', 'game-team-home', {
                  highlight: teamId === homeTeam.jsonId || clubId === homeClub.jsonId,
                })}
                to={`/${homeClub.jsonId}/${homeTeam.name}`}
              >
                <div className="game-team-name">{homeTeam.fullName}</div>
                <ClubIcon club={homeClub} />
              </Link>
              <div className={middleClasses}>{middleContent}</div>
              <Link
                className={cn('game-team', 'game-team-away', {
                  highlight: teamId === awayTeam.jsonId || clubId === awayClub.jsonId,
                })}
                to={`/${awayClub.jsonId}/${awayTeam.name}`}
              >
                <ClubIcon club={awayClub} />
                <div className="game-team-name">{awayTeam.fullName}</div>
              </Link>
              {footerTxt && <div className="game-footer text-danger">{footerTxt}</div>}
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

Games.defaultProps = {
  showScores: true,
}

export default Games
