import React from 'react'
import cn from 'classnames'

const ClubLogo = ({ club, className }) => {
    const classes = cn('club-logo', className)
    return <img src={`/logo/${club.id}.png`} alt={club.name} className={classes} />
}

export default ClubLogo
