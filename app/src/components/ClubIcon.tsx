import React from 'react';
import cn from 'classnames';

const ClubIcon = ({
  club,
  className,
  small = false,
}: {
  club: { jsonId: string | null; name: string };
  className?: string;
  small?: boolean;
}) => {
  const classes = cn('club-icon', className, {
    small,
  });
  const path = small
    ? `/logo/small/${club.jsonId}.png`
    : `/logo/${club.jsonId}.png`;
  return <img src={path} alt={club.name ?? ''} className={classes} />;
};

export default ClubIcon;
