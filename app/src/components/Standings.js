import React from 'react'
import { Link } from 'gatsby'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import cn from 'classnames'

import ClubIcon from './ClubIcon'
import ChampionIcon from './ChampionIcon'

const Standings = ({ poule, teamId }) => {
    return (
        <div className="standings">
            <div className="standings-row header">
                <div className="value position">#</div>
                <div className="value logo"> </div>
                <div className="value team">Team</div>
                <div className="value points">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Punten</Tooltip>}>
                        <span>P</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Gespeeld</Tooltip>}>
                        <span>GS</span>
                    </OverlayTrigger>
                </div>
                <div className="value hide-sm">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Winst</Tooltip>}>
                        <span>W</span>
                    </OverlayTrigger>
                </div>
                <div className="value hide-sm">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Gelijk</Tooltip>}>
                        <span>G</span>
                    </OverlayTrigger>
                </div>
                <div className="value hide-sm">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Verloren</Tooltip>}>
                        <span>V</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Doelpunten voor</Tooltip>}>
                        <span>+</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Doelpunten tegen</Tooltip>}>
                        <span>-</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Doelsaldo</Tooltip>}>
                        <span>DS</span>
                    </OverlayTrigger>
                </div>
            </div>
            {poule.teamScores
                .sort((a, b) => {
                    if (a.rank < b.rank) {
                        return -1
                    }
                    if (a.rank > b.rank) {
                        return 1
                    }
                    return 0
                })
                .map((teamScore, index) => {
                    let team = teamScore.team
                    let classes = cn('standings-row', {
                        highlight: team.jsonId === teamId,
                    })
                    return (
                        <Link
                            key={team.jsonId}
                            className={classes}
                            to={`/${team.club.jsonId}/${team.name}`}
                        >
                            <div className="value position">{index + 1}</div>
                            <div className="value logo">
                                <ClubIcon club={team.club} small />
                            </div>
                            <div xs={6} className="value team">
                                {team.fullName}
                                {team.isChampion && <ChampionIcon className="ml-2" />}
                            </div>
                            <div className="value points">{teamScore.points}</div>
                            <div className="value">{teamScore.gamesPlayed}</div>
                            <div className="value hide-sm">{teamScore.gamesWon}</div>
                            <div className="value hide-sm">{teamScore.gamesDraw}</div>
                            <div className="value hide-sm">{teamScore.gamesLost}</div>
                            <div className="value goals">{teamScore.goalsFor}</div>
                            <div className="value goals">{teamScore.goalsAgainst}</div>
                            <div className="value goals">{teamScore.goalsDifference}</div>
                        </Link>
                    )
                })}
        </div>
    )
}

export default Standings
