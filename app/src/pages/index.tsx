import React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import { Row, Col, Alert } from 'react-bootstrap';

import Layout from '../components/Layout';
import ClubIcon from '../components/ClubIcon';
import ChampionIcon from '../components/ChampionIcon';
import { Head as DefaultHead } from '../components/Head';
import NewsItem from '../components/NewsItem';

const RootPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const clubs = data.allClubJson;
  const news = data.allNewsYaml.edges
    .filter((n) => n.node.frontPage)
    .map((n) => n.node);

  return (
    <Layout>
      <Row>
        <Col md={12} lg={6}>
          Welkom op de website van de ZOD zaalvoetbalcompetitie!
          <br />
          <br />
          De ZOD zaalvoetbalcompetitie is ontstaan uit een onderlinge
          samenwerking van voetbalverenigingen uit Zuid-Oost Drenthe. Het doel
          van deze competitie is om de JO-7 t/m JO-13 in de winterperiode te
          kunnen laten voetballen!
          <br />
          <br />
          Op deze site zijn de programma&apos;s, uitslagen en standen voor alle
          teams te vinden. Klik op een van de onderstaande teams om deze te
          bekijken.
        </Col>
        <Col md={12} lg={6} className="text-center lead mt-sm-4 mt-md-0 mb-3 ">
          <p>Heb je leuke foto's van het toernooi of van je team?</p>
          <p>Deel ze met ons op Instagram!</p>
          <p>
            <a href="https://instagram.com/zaalvoetbal_zod" target="_blank">
              <img className="img-fluid instagram" src="/instagram_icon.png" />
            </a>
          </p>
        </Col>
      </Row>
      {news.map(n => {
        return (
          <NewsItem
            time={n.time ?? ''}
            title={n.title}
            status={n.status}
            message={n.message}
          />
        );
      })}
      <h4 className="mt-5">Teams</h4>
      <Row>
        {clubs.nodes.map((club) => {
          const teams = club.teams.sort((a, b) => {
            if (a.sortId < b.sortId) {
              return -1;
            }
            if (a.sortId > b.sortId) {
              return 1;
            }
            return 0;
          });

          return (
            <Col key={club.jsonId} xs={12} md={6} lg={4} className="mb-2 mt-2">
              <ul className="team-list">
                {teams.map((team: any) => {
                  return (
                    <li key={team.jsonId}>
                      <Link
                        key={team.jsonId}
                        as={Link}
                        to={`/${club.jsonId}/${team.name}`}
                      >
                        <ClubIcon club={club} className="mr-2" small />
                        {team.fullName}
                        {team.isChampion && <ChampionIcon className="ml-2" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export const query = graphql`
  query IndexPage {
    allClubJson(sort: { fields: teams___children, order: DESC }) {
      nodes {
        jsonId
        name
        teams {
          jsonId
          name
          fullName
          sortId
          isChampion
        }
      }
    }
    allNewsYaml(sort: { fields: time, order: DESC }, limit: 1) {
      edges {
        node {
          title
          time
          status
          message
          frontPage
        }
      }
    }
  }
`;

export function Head() {
  return <DefaultHead />;
}

export default RootPage;
