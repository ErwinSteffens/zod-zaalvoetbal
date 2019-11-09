import React from 'react'
import { Link } from 'gatsby'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import cn from 'classnames'

import ClubLogo from './ClubLogo'

const Standings = ({ poule, highlightTeamId }) => {
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
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Winst</Tooltip>}>
                        <span>W</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Gelijk</Tooltip>}>
                        <span>G</span>
                    </OverlayTrigger>
                </div>
                <div className="value">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Verloren</Tooltip>}>
                        <span>V</span>
                    </OverlayTrigger>
                </div>
                <div className="value goals">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Doelpunten voor</Tooltip>}>
                        <span>DV</span>
                    </OverlayTrigger>
                </div>
                <div className="value goals">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Doelpunten tegen</Tooltip>}>
                        <span>DT</span>
                    </OverlayTrigger>
                </div>
                <div className="value goals">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Doelpunten verschil</Tooltip>}
                    >
                        <span>DV</span>
                    </OverlayTrigger>
                </div>
            </div>
            {poule.teams
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
                        highlight: team.id === highlightTeamId
                    })
                    return (
                        <Link
                            key={team.id}
                            className={classes}
                            to={`/${team.club.id}/${team.name}`}
                        >
                            <div className="value position">{index + 1}</div>
                            <div className="value logo">
                                <ClubLogo club={team.club} small />
                            </div>
                            <div xs={6} className="value team">
                                {team.fullName}
                            </div>
                            <div className="value points">{teamScore.points}</div>
                            <div className="value">{teamScore.gamesPlayed}</div>
                            <div className="value">{teamScore.gamesWon}</div>
                            <div className="value">{teamScore.gamesDraw}</div>
                            <div className="value">{teamScore.gamesLost}</div>
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
