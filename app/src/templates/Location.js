import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';
import { List } from 'immutable';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

import Layout from '../components/Layout';
import Games from '../components/Games';
import TemporaryWarning from '../components/TemporaryWarning';
import { Head as DefaultHead } from '../components/Head';

const LocationTemplate = ({ data }) => {
  const location = data.locationJson;

  const games = List(location.games)
    .groupBy((game) => {
      return moment(game.time).startOf('day').toDate();
    })
    .map((games) =>
      games
        .groupBy((game) => {
          return game.field;
        })
        .map((games) =>
          games.groupBy((game) => {
            return game.poule.jsonId;
          }),
        ),
    )
    .sortBy((_v, k) => k);

  const mapsUrl = `https://www.google.com/maps/embed/v1/place?q=place_id:${location.placeId}&key=${process.env.GATSBY_GOOGLE_MAPS_KEY}`;

  return (
    <Layout className="location">
      <Row className="location-info mb-4">
        <Col xs={12} md={6}>
          <h3>{location.venue}</h3>
          <b>Adres:</b>
          <br />
          {location.address}
          <br />
          {location.postalCode} {location.city}
          <br />
          <br />
        </Col>
        <Col xs={12} md={6}>
          <iframe
            title={location.venue}
            className="location-map"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapsUrl}
            allowFullScreen
          ></iframe>
        </Col>
      </Row>

      <h4 className="mb-4">Wedstrijden</h4>
      {games.entrySeq().map(([date, gamesOnDate]) => {
        return (
          <Row key={date.toString()} className="games">
            <Col>
              <h6 className="games-header date">
                {moment(date).format('dddd LL')}
              </h6>
              {gamesOnDate.entrySeq().map(([field, gamesOnField]) => {
                return (
                  <Fragment key={field || 'field'}>
                    {field && <h6 className="games-header">Veld {field}</h6>}
                    {gamesOnField.entrySeq().map(([pouleId, gamesByPoule]) => {
                      const poule = gamesByPoule.first().poule;
                      return (
                        <Fragment key={pouleId}>
                          <h6 className="games-header last">
                            <Link
                              className="location"
                              to={`/poules/${poule.jsonId}`}
                            >
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
            </Col>
          </Row>
        );
      })}
    </Layout>
  );
};

export const Head = ({ data }) => {
  const location = data.locationJson;
  return <DefaultHead title={location.venue} />;
};

export const query = graphql`
  query ($id: String!) {
    locationJson(jsonId: { eq: $id }) {
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
`;

export default LocationTemplate;
