import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { List } from 'immutable';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

import Layout from '../../components/SheetLayout';
import Games from '../../components/Games';
import { Head as DefaultHead } from '../../components/Head';

const GamesTemplate = ({ data }) => {
  const location = data.locationJson;
  if (!location || !location.games) {
    throw new Error('No location or games given');
  }

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

  return (
    <Layout>
      {games.entrySeq().map(([date, gamesOnDate]) => {
        return gamesOnDate.entrySeq().map(([field, gamesOnField]) => {
          return gamesOnField.entrySeq().map(([pouleId, gamesByPoule]) => {
            const poule = gamesByPoule.first().poule;
            return (
              <Row key={date.toString()} className="games page">
                <Col>
                  <Fragment key={pouleId}>
                    <h3>Programma</h3>
                    <h6 className="games-header">{location.venue}</h6>
                    <h6 className="games-header date">
                      {moment(date).format('dddd LL')}
                    </h6>
                    {field && <h6 className="games-header">Veld {field}</h6>}
                    <h6 className="games-header last">{poule.name}</h6>
                    <Games games={gamesByPoule.toArray()} showScores={false} />
                    <div className="info">
                      Kijk voor een volledig programma op{' '}
                      <u>www.zodzaalvoetbal.nl</u>
                    </div>
                  </Fragment>
                </Col>
              </Row>
            );
          });
        });
      })}
    </Layout>
  );
};

export function Head({ data }) {
  const location = data.locationJson;
  return <DefaultHead title={['Games', location.venue]} />;
}

export const query = graphql`
  query GamesSheet($id: String!) {
    locationJson(jsonId: { eq: $id }) {
      jsonId
      venue
      games {
        time
        poule {
          jsonId
          name
        }
        location {
          jsonId
        }
        field
        homeTeam {
          jsonId
          name
          fullName
          club {
            jsonId
            name
          }
          poule {
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

export default GamesTemplate;
