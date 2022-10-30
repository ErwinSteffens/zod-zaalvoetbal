import React from 'react';
import cn from 'classnames';

const ChampionIcon = ({ className }: { className?: string }) => {
  const classes = cn('champion-icon', className);
  return <img src="/champion.png" alt="Kampioen" className={classes} />;
};

export default ChampionIcon;
