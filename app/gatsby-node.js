const path = require(`path`)

exports.createSchemaCustomization = ({ actions, schema }) => {
    const { createTypes } = actions
    const typeDefs = [
        `type ClubJson implements Node {
            teams: [TeamJson] @link(by: "clubId", from: "id")
         }`,
        `type LocationJson implements Node {
            games: [GameJson] @link(by: "locationId", from: "id")
         }`,
        `type GameJson implements Node {
            homeTeam: TeamJson @link(from: "homeTeamId")
            awayTeam: TeamJson @link(from: "awayTeamId")
            location: LocationJson @link(from: "locationId")
         }`,
        `type PouleJson implements Node {
            teams: [TeamJson] @link
         }`,
        schema.buildObjectType({
            name: 'PouleJson',
            fields: {
                games: {
                    type: '[GameJson]',
                    resolve(source, args, context, info) {
                        return context.nodeModel
                            .getAllNodes({ type: 'GameJson' })
                            .filter(game => source.teams.includes(game.homeTeamId))
                    }
                }
            }
        }),
        `type TeamJson implements Node {
            club: ClubJson @link(from: "clubId")
            poule: PouleJson @link(from: "pouleId")
         }`,
        schema.buildObjectType({
            name: 'TeamJson',
            fields: {
                fullName: {
                    type: 'String',
                    resolve(source, args, context, info) {
                        let club = context.nodeModel.getNodeById({
                            id: source.clubId,
                            type: 'ClubJson'
                        })
                        return `${club.name} ${source.name}`
                    }
                },
                games: {
                    type: '[GameJson]',
                    resolve(source, args, context, info) {
                        return context.nodeModel
                            .getAllNodes({ type: 'GameJson' })
                            .filter(game => game.homeTeamId === source.id || game.awayTeamId === source.id)
                    }
                }
            }
        })
    ]
    createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const clubs = await graphql(`
        query {
            allClubJson {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    `)

    clubs.data.allClubJson.edges.forEach(({ node }) => {
        createPage({
            path: `/${node.id}`,
            component: path.resolve(`./src/templates/Club.js`),
            context: {
                id: node.id
            }
        })
    })

    const teams = await graphql(`
        query {
            allTeamJson {
                edges {
                    node {
                        id
                        name
                        club {
                            id
                        }
                    }
                }
            }
        }
    `)

    teams.data.allTeamJson.edges.forEach(({ node }) => {
        createPage({
            path: `${node.club.id}/${node.name}`,
            component: path.resolve(`./src/templates/Team.js`),
            context: {
                id: node.id
            }
        })
    })

    const poules = await graphql(`
        query {
            allPouleJson {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    `)

    poules.data.allPouleJson.edges.forEach(({ node }) => {
        createPage({
            path: `poules/${node.id}`,
            component: path.resolve(`./src/templates/Poule.js`),
            context: {
                id: node.id
            }
        })
    })

    const locations = await graphql(`
        query {
            allLocationJson {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    `)

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `locaties/${node.id}`,
            component: path.resolve(`./src/templates/Location.js`),
            context: {
                id: node.id
            }
        })
    })
}
