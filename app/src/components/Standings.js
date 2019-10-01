import React from 'react'
import { Link } from 'gatsby'
import cn from 'classnames'

import ClubLogo from './ClubLogo'

const Standings = ({ poule, highlightTeamId }) => {
    return (
        <div className="standings">
            <div className="standings-row header">
                <div className="value position">#</div>
                <div className="value logo"> </div>
                <div className="value team">Team</div>
                <div className="value points">P</div>
                <div className="value">G</div>
                <div className="value">W</div>
                <div className="value">GL</div>
                <div className="value">V</div>
                <div className="value">+</div>
                <div className="value">-</div>
                <div className="value">PM</div>
            </div>
            {poule.teams.map((team, index) => {
                let classes = cn('standings-row', {
                    highlight: team.id === highlightTeamId
                })
                return (
                    <Link key={team.id} className={classes} to={`/${team.club.id}/${team.name}`}>
                        <div className="value position">{index + 1}</div>
                        <div className="value logo">
                            <ClubLogo club={team.club} />
                        </div>
                        <div xs={6} className="value team">
                            {team.fullName}
                        </div>
                        <div className="value points">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                        <div className="value">0</div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Standings
