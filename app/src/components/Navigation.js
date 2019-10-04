import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Navbar, Nav, NavDropdown, Row, Col } from 'react-bootstrap'

import ClubLogo from './ClubLogo'

export default () => {
    const data = useStaticQuery(graphql`
        query {
            allClubJson(sort: { fields: teams___children, order: DESC }) {
                nodes {
                    id
                    name
                    teams {
                        id
                        name
                        fullName
                        sortId
                    }
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
                    <NavDropdown title="Teams">
                        <Row className="clubs-menu">
                            {data.allClubJson.nodes.map(club => {
                                const teams = club.teams.sort((a, b) => {
                                    if (a.sortId < b.sortId) {
                                        return -1
                                    }
                                    if (a.sortId > b.sortId) {
                                        return 1
                                    }
                                    return 0
                                })
                                return (
                                    <Col key={club.id} xs={12} md={4} className="mb-2 mt-2">
                                        {teams.map(team => {
                                            return (
                                                <NavDropdown.Item
                                                    key={team.id}
                                                    as={Link}
                                                    to={`/${club.id}/${team.name}`}
                                                >
                                                    <ClubLogo club={club} className="mr-2" />
                                                    {team.fullName}
                                                </NavDropdown.Item>
                                            )
                                        })}
                                    </Col>
                                )
                            })}
                        </Row>
                    </NavDropdown>
                    <NavDropdown title="Poules">
                        {data.allPouleJson.nodes.map(node => {
                            return (
                                <NavDropdown.Item key={node.id} as={Link} to={`/poules/${node.id}`}>
                                    {node.name}
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
                    <Nav.Link as={Link} to="/contact">
                        Contact
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
