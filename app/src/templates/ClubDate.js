import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import moment from 'moment';
import { List } from 'immutable';
import { Link } from 'gatsby';

import Games from '../components/Games';
import Layout from '../components/Layout';
import ClubIcon from '../components/ClubIcon';
import { Head as DefaultHead } from '../components/Head';
import { LocationName } from '../components/LocationName';

const ClubTemplate = ({ pageContext: { date }, data: { clubJson: club } }) => {
  const gamesByLocation = List(club.teams)
    .flatMap((t) => t.games.filter((g) => moment(g.time).isSame(date, 'day')))
    .groupBy((game) => {
      return game.location.jsonId;
    })
    .map((games) =>
      games.groupBy((game) => {
        return game.poule.jsonId;
      }),
    )
    .sortBy((_v, k) => k);

  return (
    <Layout className="club-page">
      <div className="clearfix">
        <ClubIcon className="page-header centered" club={club} />
      </div>
      <br />
      <h6 className="text-center">Alle wedstrijden voor {club.name} op:</h6>
      <h3 className="date text-center">{moment(date).format('dddd LL')}</h3>
      <br />
      {gamesByLocation.entrySeq().map(([_, games]) => {
        games = games.sortBy((v) => v.time);
        const location = games.first().first().location;

        return (
          <Fragment key={location.jsonId}>
            <h5 className="games-header">
              <LocationName location={location} />
            </h5>
            {games.entrySeq().map(([pouleId, gamesByPoule]) => {
              const poule = gamesByPoule.first().poule;
              return (
                <Fragment key={pouleId}>
                  <h6 className="games-header last">
                    <Link className="location" to={`/poules/${poule.jsonId}`}>
                      {poule.name}
                    </Link>
                  </h6>
                  <Games games={gamesByPoule} clubId={club.jsonId} />
                </Fragment>
              );
            })}
            <br />
          </Fragment>
        );
      })}
    </Layout>
  );
};

export function Head({ pageContext: { date }, data: { clubJson: club } }) {
  return (
    <DefaultHead title={`${club.name} - ${moment(date).format('dddd LL')}`} />
  );
}

export const query = graphql`
  query ClubPage($id: String!) {
    clubJson(jsonId: { eq: $id }) {
      jsonId
      name
      contact {
        name
        email
      }
      teams {
        jsonId
        name
        fullName
        isChampion
        sortId
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
            venue
            city
          }
          field
          homeScore
          awayScore
          homeTeam {
            jsonId
            name
            fullName
            category
            club {
              jsonId
              name
            }
          }
          awayTeam {
            jsonId
            name
            fullName
            category
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

export default ClubTemplate;
