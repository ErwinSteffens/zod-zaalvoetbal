import React from 'react'
import { graphql, Link } from 'gatsby'
import { Helmet } from 'react-helmet'

import Layout from '../components/Layout'
import ClubLogo from '../components/ClubLogo'

export default ({ data }) => {
    const club = data.clubJson

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
        <Layout className="club-page">
            <Helmet>
                <title>ZOD Zaalvoetbal - {club.name}</title>
            </Helmet>
            <div className="clearfix">
                <ClubLogo className="page-header" club={club} />
                <h3>{club.name}</h3>
                <b>Contactpersoon:</b>
                <br />
                {club.contact}
                <br />
                {club.contactEmail}
                <br />
                Tel: {club.contactPhone}
                <br />
                <br />
            </div>
            <h4>Teams</h4>

            <ul className="team-list">
                {teams.map(team => {
                    return (
                        <li>
                            <Link key={team.id} as={Link} to={`/${club.id}/${team.name}`}>
                                <ClubLogo club={club} className="mr-2" small />
                                {team.fullName}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </Layout>
    )
}

export const query = graphql`
    query($id: String!) {
        clubJson(id: { eq: $id }) {
            id
            name
            contact
            contactEmail
            contactPhone
            teams {
                id
                name
                fullName
                sortId
            }
        }
    }
`
