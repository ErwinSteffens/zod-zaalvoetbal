import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';
import moment from 'moment';
import { List } from 'immutable';
import { Row, Col } from 'react-bootstrap';

import TemporaryWarning from '../components/TemporaryWarning';
import Games from '../components/Games';
import Layout from '../components/Layout';

const DateTemplate = ({ pageContext: { date }, data: { allLocationJson } }) => {
  return (
    <Layout className="club-page date">
      <h6 className="text-center">Alles wedstrijden op:</h6>
      <h3 className="date text-center">
        {moment(date).format('dddd D MMMM YYYY')}
      </h3>
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
        const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?q=place_id:${location.placeId}&key=${process.env.GATSBY_GOOGLE_MAPS_KEY}`;

        if (games.isEmpty()) {
          return null;
        }

        return (
          <Fragment key={location.jsonId}>
            <br />
            <br />
            <hr />
            <Row className="location-info mb-4">
              <Col xs={12} md={6}>
                <h4>{location.venue}</h4>
                <b>Adres:</b>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <br />
                  {location.address}
                  <br />
                  {location.postalCode} {location.city}
                  <br />
                </a>
                <br />
              </Col>
              <Col xs={12} md={6}>
                <iframe
                  title={location.venue}
                  className="location-map"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={mapsEmbedUrl}
                  allowFullScreen
                ></iframe>
              </Col>
            </Row>
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
