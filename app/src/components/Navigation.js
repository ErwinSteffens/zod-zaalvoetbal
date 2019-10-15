import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

import ClubLogo from './ClubLogo'

export default () => {
    const data = useStaticQuery(graphql`
        query {
            allClubJson(sort: { fields: name }) {
                nodes {
                    id
                    name
                }
            }
            allPouleJson(sort: { fields: sortId }) {
                nodes {
                    id
                    name
                }
            }
            allLocationJson(sort: { fields: city }) {
                nodes {
                    id
                    venue
                    city
                }
            }
        }
    `)

    return (
        <Navbar bg="dark" expand="sm" variant="dark">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className="nav-link" as={Link} to="/">
                        Home
                    </Nav.Link>
                    <NavDropdown title="Poules">
                        {data.allPouleJson.nodes.map(node => {
                            return (
                                <NavDropdown.Item key={node.id} as={Link} to={`/poules/${node.id}`}>
                                    {node.name}
                                </NavDropdown.Item>
                            )
                        })}
                    </NavDropdown>
                    <NavDropdown title="Clubs">
                        {data.allClubJson.nodes.map(club => {
                            return (
                                <NavDropdown.Item key={club.id} as={Link} to={`/${club.id}`}>
                                    <ClubLogo club={club} className="small mr-2" />
                                    {club.name}
                                </NavDropdown.Item>
                            )
                        })}
                    </NavDropdown>
                    <NavDropdown title="Locaties">
                        {data.allLocationJson.nodes.map(node => {
                            return (
                                <NavDropdown.Item
                                    key={node.id}
                                    as={Link}
                                    to={`/locaties/${node.id}`}
                                >
                                    {node.city} - {node.venue}
                                </NavDropdown.Item>
                            )
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
    )
}
