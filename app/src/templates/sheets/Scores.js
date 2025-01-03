import React, { Fragment } from 'react';
import { graphql } from 'gatsby';
import { List } from 'immutable';
import cn from 'classnames';
import moment from 'moment';

import Layout from '../../components/SheetLayout';
import { Head as DefaultHead } from '../../components/Head';

const ScoresTemplate = ({ data }) => {
  const location = data.locationJson;
  if (!location || !location.games) {
    throw new Error('No location or games given');
  }

  const games = List(location.games)
    .groupBy((game) => {
      return moment(game.time).startOf('day').toDate();
    })
    .sortBy((_v, k) => k);

  return (
    <Layout className="scores">
      {games.entrySeq().map(([date, games]) => {
        let lastPouleId = null;

        // Sort games by time and field
        const sortedGames = games.sort((a, b) => {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
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

        const hasField = sortedGames.some((game) => game.field);

        return (
          <div key={date.toISOString()} className="page">
            <h3>{moment(date).format('dddd LL')}</h3>
            <h5>{location.venue}</h5>

            <div className="table">
              {sortedGames.map((game) => {
                const { time, field, homeTeam, awayTeam } = game;
                const poule = homeTeam.poule;

                const showHeader = lastPouleId !== poule.jsonId;
                lastPouleId = poule.jsonId;

                return (
                  <>
                    {showHeader && (
                      <Fragment>
                        <h5 className="field-header mb-4">{poule.name}</h5>
                        <div className="game header">
                          <div className="item time">Tijd</div>
                          {hasField && <div className="item field">Veld</div>}
                          <div className={cn('item', 'team', 'home')}>
                            Thuis team
                          </div>
                          <div className={cn('item', 'team', 'away')}>
                            Uit team
                          </div>
                          <div className="item score">Uitslag</div>
                          <div className="item signature">Handtekeningen</div>
                        </div>
                      </Fragment>
                    )}
                    <div
                      key={`${homeTeam.jsonId}|${awayTeam.jsonId}|${time}`}
                      className="game"
                    >
                      <div className="item time">
                        {moment(time).format('LT')}
                      </div>
                      {field && <div className="item field">{field}</div>}

                      <div className="item team home">{homeTeam.fullName}</div>
                      <div className="item team away">{awayTeam.fullName}</div>
                      <div className="item score"></div>
                      <div className="item score"></div>
                      <div className="item signature first"></div>
                      <div className="item signature"></div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="info">
              Uitslagen kunnen worden doorgegeven door een foto van dit
              formulier te maken en te versturen via e-mail
              (erwinsteffens@gmail.com) of WhatsApp (06-48482334).
            </div>
          </div>
        );
      })}
    </Layout>
  );
};

export function Head({ data }) {
  const location = data.locationJson;
  return <DefaultHead title={['Scores', location.venue]} />;
}

export const query = graphql`
  query ScoresSheet($id: String!) {
    locationJson(jsonId: { eq: $id }) {
      jsonId
      venue
      games {
        time
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

export default ScoresTemplate;
