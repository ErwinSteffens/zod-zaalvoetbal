import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';
import moment from 'moment';
import { List } from 'immutable';

import TemporaryWarning from '../components/TemporaryWarning';
import Games from '../components/Games';
import Layout from '../components/Layout';

const DateTemplate = ({ pageContext: { date }, data: { allLocationJson } }) => {
  return (
    <Layout className="club-page date">
      <h6 className="text-center">Alle wedstrijden op:</h6>
      <h3 className="date text-center">
        {moment(date).format('dddd D MMMM YYYY')}
      </h3>
      <br />
      {allLocationJson.nodes.map((location) => {
        const games = List(location.games)
          .filter((game) => {
            return moment(game.time).isSame(date, 'day');
          })
          .groupBy((game) => {
            return game.poule.jsonId;
          })
          .sortBy((_v, k) => k);

        const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${location.placeId}`;

        if (games.isEmpty()) {
          return null;
        }

        return (
          <Fragment key={location.jsonId}>
            <br />
            <br />
            <div className="text-center">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <h4 className="mb-0 text-center">
                  {location.venue} - {location.city}
                </h4>
              </a>
            </div>
            <br />
            <br />
            {games.entrySeq().map(([pouleId, gamesByPoule]) => {
              const poule = gamesByPoule.first().poule;
              return (
                <Fragment key={pouleId}>
                  <h6 className="games-header last">
                    <Link className="location" to={`/poules/${poule.jsonId}`}>
                      {poule.name}
                    </Link>
                  </h6>
                  {poule.temporary && <TemporaryWarning />}
                  <Games games={gamesByPoule} />
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </Layout>
  );
};

export const query = graphql`
  query {
    allLocationJson(sort: { fields: city }) {
      nodes {
        jsonId
        venue
        address
        postalCode
        city
        placeId
        games {
          time
          status
          poule {
            jsonId
            name
            temporary
          }
          location {
            jsonId
          }
          field
          homeScore
          awayScore
          homeTeam {
            jsonId
            name
            fullName
            club {
              jsonId
              name
            }
          }
          awayTeam {
            jsonId
            name
            fullName
            club {
              jsonId
              name
            }
          }
        }
      }
    }
  }
`;

export default DateTemplate;
