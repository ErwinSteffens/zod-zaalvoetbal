import React, { Fragment, useMemo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';
import moment from 'moment';

import ClubIcon from './ClubIcon';

import 'react-toggle/style.css';

const Games = ({
  games,
  teamId,
  clubId,
  showScores = false,
}: {
  games: Queries.GameJson[];
  teamId?: string;
  clubId?: string;
  showScores?: boolean;
}) => {
  const sortedGames = useMemo(() => {
    return games.sort((a, b) => {
      if (a.time! < b.time!) {
        return -1;
      }
      if (a.time! > b.time!) {
        return 1;
      }
      if (a.field && b.field) {
        if (a.field < b.field) {
          return -1;
        }
        if (a.field > b.field) {
          return 1;
        }
      }
      return 0;
    });
  }, [games]);

  return (
    <div className="games-table">
      {sortedGames.map((game) => {
        const {
          time,
          field,
          status,
          homeTeam,
          homeScore,
          awayTeam,
          awayScore,
        } = game;

        const isPlayed = showScores && status !== 'planned';
        const isCancelled = status === 'cancelled';
        const middleClasses = cn('game-content', {
          'game-content-score': isPlayed,
          'game-content-time': !isPlayed && !field,
          'game-content-time-field': !isPlayed && field,
          'game-content-warning': isCancelled,
        });

        let middleContent = moment(time).format('LT');
        if (isCancelled) {
          middleContent = 'Afgelast';
        } else if (isPlayed) {
          middleContent = `${homeScore} - ${awayScore}`;
        }

        let footerTxt = null;
        if (status === 'both-team-no-show') {
          footerTxt = 'Beide teams afgemeld.';
        } else if (status === 'home-team-no-show') {
          footerTxt = `${homeTeam.fullName} afgemeld.`;
        } else if (status === 'away-team-no-show') {
          footerTxt = `${awayTeam.fullName} afgemeld.`;
        }

        const homeClub = homeTeam.club;
        const awayClub = awayTeam.club;

        return (
          <Fragment key={`${homeTeam.jsonId}|${awayTeam.jsonId}|${time}`}>
            <div className="game">
              <Link
                className={cn('game-team', 'game-team-home', {
                  highlight:
                    teamId === homeTeam.jsonId || clubId === homeClub.jsonId,
                })}
                to={`/${homeClub.jsonId}/${homeTeam.name}`}
              >
                <div className="game-team-name">{homeTeam.fullName}</div>
                <ClubIcon club={homeClub} />
              </Link>
              <div className={middleClasses}>
                {middleContent}
                {!isPlayed && field && (
                  <Fragment>
                    <br />
                    <span>Veld {field}</span>
                  </Fragment>
                )}
              </div>
              <Link
                className={cn('game-team', 'game-team-away', {
                  highlight:
                    teamId === awayTeam.jsonId || clubId === awayClub.jsonId,
                })}
                to={`/${awayClub.jsonId}/${awayTeam.name}`}
              >
                <ClubIcon club={awayClub} />
                <div className="game-team-name">{awayTeam.fullName}</div>
              </Link>
              {footerTxt && (
                <div className="game-footer text-danger">{footerTxt}</div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

Games.defaultProps = {
  showScores: true,
};

export default Games;
