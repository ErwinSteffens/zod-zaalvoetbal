import React from 'react'

const PouleStandings = ({ poule, highlightTeamId }) => {
    return (
        <div>
            Poule standing here. Poule: {poule.id}. Highlighting:{' '}
            {highlightTeamId}
        </div>
    )
}

export default PouleStandings
