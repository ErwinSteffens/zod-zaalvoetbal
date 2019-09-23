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
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">ZOD Zaalcompetitie</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <NavDropdown title="Clubs">
                        {data.allClubJson.nodes.map(node => {
                            return (
                                <Link
                                    className="dropdown-item"
                                    role="button"
                                    to={`/${node.id}`}
                                >
                                    {node.name}
                                </Link>
                            )
                        })}
                    </NavDropdown>
                    <NavDropdown title="Poules">
                        {data.allPouleJson.nodes.map(node => {
                            return (
                                <Link
                                    className="dropdown-item"
                                    role="button"
                                    to={`/poules/${node.id}`}
                                >
                                    {node.name}
                                </Link>
                            )
                        })}
                    </NavDropdown>
                    <NavDropdown title="Locaties">
                        {data.allLocationJson.nodes.map(node => {
                            return (
                                <Link
                                    className="dropdown-item"
                                    role="button"
                                    to={`/locaties/${node.id}`}
                                >
                                    {node.venue} - {node.city}
                                </Link>
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
