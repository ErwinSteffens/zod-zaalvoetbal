import React from 'react'
import cn from 'classnames'

const ClubIcon = ({ club, className, small }) => {
    const classes = cn('club-icon', className, {
        small: small
    })
    const path = small ? `/logo/small/${club.id}.png` : `/logo/${club.id}.png`
    return <img src={path} alt={club.name} className={classes} />
}

export default ClubIcon
