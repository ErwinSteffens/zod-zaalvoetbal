import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

export default () => {
    const data = useStaticQuery(graphql`
        query {
            allClubJson(sort: { fields: name }) {
                nodes {
                    id
                    name
                }
            }
            allPouleJson(sort: { fields: name }) {
                nodes {
                    id
                    name
                }
            }
            allLocationJson(sort: { fields: venue }) {
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
                    <NavDropdown title="Clubs">
                        {data.allClubJson.nodes.map(node => {
                            return (
                                <NavDropdown.Item key={node.id} as={Link} to={`/${node.id}`}>
                                    {node.name}
                                </NavDropdown.Item>
                            )
                        })}
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
                                    {node.venue} - {node.city}
                                </NavDropdown.Item>
                            )
                        })}
                    </NavDropdown>
                    <Nav.Link href="#home">Spelregels</Nav.Link>
                    <Nav.Link href="#home">Contact</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
