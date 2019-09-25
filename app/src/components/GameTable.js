import React from 'react'
import PropTypes from 'prop-types'

const GameTable = ({ date, games }) => {
    return (
        <div>
            <h3>{date.toString()}</h3>
            {games.map(game => {
                return (
                    <p key={game.id}>
                        {game.homeTeam.fullName} - {game.awayTeam.fullName}
                        <br />
                        {game.time.toString()} - {game.location.venue}
                    </p>
                )
            })}
        </div>
    )
}

GameTable.propTypes = {
    date: PropTypes.instanceOf(Date),
    games: PropTypes.array
}

export default GameTable
