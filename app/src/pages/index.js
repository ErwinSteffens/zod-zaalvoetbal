import React from 'react'
import { Link, graphql } from 'gatsby'
import { Row, Col } from 'react-bootstrap'

import Layout from '../components/Layout'
import ClubLogo from '../components/ClubLogo'

export default ({ data }) => {
    const clubs = data.allClubJson

    return (
        <Layout>
            <h3>Welkom</h3>
            <p>
                Welkom op de website van de ZOD zaalvoetbalcompetitie!
                <br />
                <br />
                De ZOD zaalvoetbalcompetitie is ontstaan uit een onderlinge samenwerking van
                voetbalverenigingen uit Zuid-Oost Drenthe. Het doel van deze competitie is om de
                JO-6 t/m JO-13 in de winterperiode te kunnen laten voetballen!
                <br />
                <br />
                Op deze site zijn de programma's, uitslagen en standen voor alle teams te vinden.
                Klik op een van de onderstaande teams om deze te bekijken.
            </p>
            <h4 className="mt-5">Teams</h4>
            <Row>
                {clubs.nodes.map(club => {
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
                        <Col key={club.id} xs={12} md={6} lg={4} xl={3} className="mb-2 mt-2">
                            <ul className="team-list">
                                {teams.map(team => {
                                    return (
                                        <li key={team.id}>
                                            <Link
                                                key={team.id}
                                                as={Link}
                                                to={`/${club.id}/${team.name}`}
                                            >
                                                <ClubLogo club={club} className="mr-2" small />
                                                {team.fullName}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </Col>
                    )
                })}
            </Row>
        </Layout>
    )
}

export const query = graphql`
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
    }
`
