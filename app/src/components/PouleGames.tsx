import React, { Fragment, useMemo } from 'react';
import moment from 'moment';

import Games from './Games';
import { LocationName } from './LocationName';
import { graphql, useStaticQuery } from 'gatsby';

type GamesByDayMap = Map<Date, GamesByLocationMap>;
type GamesByLocationMap = Map<string, GamesByFieldMap>;
type GamesByFieldMap = Map<string, Queries.GameJson[]>;

const PouleGames = ({
  games,
  teamId,
}: {
  games: GamesByDayMap;
  teamId: string;
}) => {
  const data = useStaticQuery<{
    allLocationJson: Queries.LocationJsonConnection;
  }>(graphql`
    query {
      allLocationJson(sort: { fields: city }) {
        nodes {
          jsonId
          venue
          city
        }
      }
    }
  `);

  const locationsMap = useMemo(() => {
    return new Map(data.allLocationJson.nodes.map((l) => [l.jsonId, l]));
  }, [data]);

  return Array.from(games).map(([date, gamesByDate]) => {
    return (
      <Fragment key={date.toString()}>
        <h6 key={date.toString()} className="games-header date">
          {moment(date).format('dddd LL')}
        </h6>
        {Array.from(gamesByDate).map(([locationId, gamesByLocation]) => {
          const location = locationsMap.get(locationId);
          if (!location) {
            throw new Error(`Location ${locationId} not found`);
          }

          return (
            <Fragment key={locationId}>
              <h6 className="games-header sub">
                <LocationName location={location} />
              </h6>
              {Array.from(gamesByLocation).map(([field, gamesByField]) => {
                return (
                  <Fragment key={field || 'field'}>
                    {field && (
                      <h6 className="games-header last">Veld {field}</h6>
                    )}
                    <Games games={gamesByField} teamId={teamId} />
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </Fragment>
    );
  });
};

export default PouleGames;
