import React from 'react';
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
        let lastFieldId = null;
        return (
          <div key={date.toISOString()} className="page">
            <h3>{moment(date).format('dddd LL')}</h3>
            <h5>{location.venue}</h5>

            <div className="table">
              <>
                <div className="game header">
                  <div className="item time">Tijd</div>
                  <div className="item poule">Poule</div>
                  <div className={cn('item', 'team', 'home')}>Thuis team</div>
                  <div className={cn('item', 'team', 'away')}>Uit team</div>
                  <div className="item score">Uitslag</div>
                  <div className="item signature">Handtekeningen</div>
                </div>

                {games.map((game) => {
                  const { time, field, homeTeam, awayTeam } = game;
                  const poule = homeTeam.poule;

                  const classes = cn('game', {
                    'mt-4':
                      lastPouleId !== null && lastPouleId !== poule.jsonId,
                  });
                  lastPouleId = poule.jsonId;

                  const fieldHeader =
                    field && field !== lastFieldId ? (
                      <h6 className="field-header">Veld {field}</h6>
                    ) : null;
                  lastFieldId = field;

                  return (
                    <>
                      {fieldHeader}
                      <div
                        key={`${homeTeam.jsonId}|${awayTeam.jsonId}|${time}`}
                        className={classes}
                      >
                        <div className="item time">
                          {moment(time).format('LT')}
                        </div>
                        <div className="item poule">{poule.name}</div>
                        <div className="item team home">
                          {homeTeam.fullName}
                        </div>
                        <div className="item team away">
                          {awayTeam.fullName}
                        </div>
                        <div className="item score"></div>
                        <div className="item score"></div>
                        <div className="item signature first"></div>
                        <div className="item signature"></div>
                      </div>
                    </>
                  );
                })}
              </>
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
