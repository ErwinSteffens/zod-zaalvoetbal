import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import ClubIcon from './ClubIcon';

const Navigation = () => {
  const data = useStaticQuery<{
    allClubJson: Queries.ClubJsonConnection;
    allPouleJson: Queries.PouleJsonConnection;
    allLocationJson: Queries.LocationJsonConnection;
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
    }
  `);

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="nav-link" as={Link} to="/2022">
            Home
          </Nav.Link>
          <NavDropdown id="nav-poules" title="Poules">
            {data.allPouleJson.nodes.map((node: Queries.PouleJson) => {
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
            {data.allClubJson.nodes.map((club: Queries.ClubJson) => {
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
            {data.allLocationJson.nodes.map((node: Queries.LocationJson) => {
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
          <Nav.Link as={Link} to="/spelregels">
            Spelregels
          </Nav.Link>
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
