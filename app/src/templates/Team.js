import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { List } from 'immutable';
import moment from 'moment';
import Toggle from 'react-toggle';
import { Row, Col } from 'react-bootstrap';

import Layout from '../components/Layout';
import ClubIcon from '../components/ClubIcon';
import Standings from '../components/Standings';
import PouleGames from '../components/PouleGames';
import TemporaryWarning from '../components/TemporaryWarning';
import { Head as DefaultHead } from '../components/Head';

const TeamTemplate = ({ data }) => {
  const [showAll, setShowAll] = useState(true);

  const team = data.teamJson;
  const poule = team.poule;

  let games = poule.games;
  if (!showAll) {
    games = games.filter(
      (g) =>
        g.homeTeam.jsonId === team.jsonId || g.awayTeam.jsonId === team.jsonId,
    );
  }

  games = List(games)
    .groupBy((game) => {
      return moment(game.time).startOf('day').toDate();
    })
    .map((games) => {
      return games.groupBy((game) => {
        return game.location.jsonId;
      });
    })
    .sortBy((_v, k) => k);

  return (
    <Layout className="team">
      <div className="clearfix">
        <ClubIcon className="page-header" club={team.club} />
        <h3>{team.fullName}</h3>
        <h6 className="subtitle">{poule.name}</h6>
      </div>
      <h4 className="mb-4">Stand</h4>
      <Standings poule={poule} teamId={team.jsonId} />
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <h4>Wedstrijden</h4>
        </Col>
        <Col xs={12} md={6} className="text-md-right">
          <label htmlFor="game-toggle" className="game-toggle">
            <Toggle
              name="game-toggle"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
            />
            <span className="label-text">Toon alle poule wedstrijden</span>
          </label>
        </Col>
      </Row>
      {poule.temporary && <TemporaryWarning />}
      <PouleGames games={games} teamId={team.jsonId} />
    </Layout>
  );
};

export function Head({ data }) {
  const team = data.teamJson;
  return <DefaultHead title={team.fullName} />;
}

export const query = graphql`
  query ($id: String!) {
    teamJson(jsonId: { eq: $id }) {
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
        temporary
        teamScores {
          team {
            jsonId
            name
            fullName
            isChampion
            club {
              jsonId
              name
            }
          }
          rank
          points
          gamesPlayed
          gamesWon
          gamesLost
          gamesDraw
          goalsFor
          goalsAgainst
          goalsDifference
        }
        games {
          time
          status
          round
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

export default TeamTemplate;
