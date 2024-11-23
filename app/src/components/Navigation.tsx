import React, { useMemo } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Set } from 'immutable';
import moment from 'moment';

import ClubIcon from './ClubIcon';

const Navigation = () => {
  const { allClubJson, allPouleJson, allLocationJson, allGameJson } =
    useStaticQuery<{
      allClubJson: Queries.ClubJsonConnection;
      allPouleJson: Queries.PouleJsonConnection;
      allLocationJson: Queries.LocationJsonConnection;
      allGameJson: Queries.GameJsonConnection;
    }>(graphql`
      query Navigation {
        allClubJson(sort: { fields: name }) {
          nodes {
            jsonId
            name
          }
        }
        allPouleJson(sort: { fields: sortId }) {
          nodes {
            jsonId
            name
          }
        }
        allLocationJson(sort: { fields: city }) {
          nodes {
            jsonId
            venue
            city
          }
        }
        allGameJson {
          edges {
            node {
              time
            }
          }
        }
      }
    `);

  let dates = useMemo(() => {
    let datesSet = Set<string>();
    allGameJson.edges.forEach(({ node }: { node: any }) => {
      datesSet = datesSet.add(moment(node.time).format('YYYY-MM-DD'));
    });
    return datesSet.toArray().sort();
  }, [allGameJson]);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="nav-link" as={Link} to="/">
            Home
          </Nav.Link>
          <NavDropdown id="nav-poules" title="Poules">
            {allPouleJson.nodes.map((node: Queries.PouleJson) => {
              return (
                <NavDropdown.Item
                  key={node.jsonId}
                  as={Link}
                  to={`/poules/${node.jsonId}`}
                >
                  {node.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
          <NavDropdown id="nav-clubs" title="Clubs">
            {allClubJson.nodes.map((club: Queries.ClubJson) => {
              return (
                <NavDropdown.Item
                  key={club.jsonId}
                  as={Link}
                  to={`/${club.jsonId}`}
                >
                  <ClubIcon club={club} className="mr-2" small />
                  {club.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
          <NavDropdown id="nav-locations" title="Locaties">
            {allLocationJson.nodes.map((node: Queries.LocationJson) => {
              return (
                <NavDropdown.Item
                  key={node.jsonId}
                  as={Link}
                  to={`/locaties/${node.jsonId}`}
                >
                  {node.city} - {node.venue}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
          <NavDropdown id="nav-dates" title="Speeldagen">
            {dates.map((date: string) => {
              return (
                <NavDropdown.Item
                  key={date}
                  as={Link}
                  to={`/${moment(date).format('D-MMMM-YYYY')}`}
                  className="date"
                >
                  {moment(date).format('dddd D MMMM YYYY')}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
          <NavDropdown id="nav-spelregels" title="Spelregels">
            <NavDropdown.Item as={Link} to={`/spelregels`}>
              Spelregels JO8-JO13
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to={`/spelregels-jo7`}>
              Spelregels JO7
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/downloads">
            Downloads
          </Nav.Link>
          <Nav.Link as={Link} to="/contacts">
            Contact
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
