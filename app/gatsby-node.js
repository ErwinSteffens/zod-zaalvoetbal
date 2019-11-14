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
            poule: PouleJson @link(from: "pouleId")
            homeTeam: TeamJson @link(from: "homeTeamId")
            homeScore: Int
            awayTeam: TeamJson @link(from: "awayTeamId")
            awayScore: Int
            location: LocationJson @link(from: "locationId")
         }`,
        `type TeamScore {
            team: TeamJson @link(from: "teamId")
            rank: Int
            points: Int
            gamesPlayed: Int
            gamesWon: Int
            gamesLost: Int
            gamesDraw: Int
            goalsFor: Int
            goalsAgainst: Int
            goalsDifference: Int
         }`,
        `type PouleJson implements Node {
            teamScores: [TeamScore]
         }`,
        schema.buildObjectType({
            name: 'PouleJson',
            fields: {
                sortId: {
                    type: 'Int',
                    resolve(source, args, context, info) {
                        if (source.name === "Mini's") {
                            return 0
                        }
                        let regex = /O(\d+) Poule ([A-Z]{1})/
                        let result = source.name.match(regex)
                        return parseInt(result[1]) * 100 + result[2].charCodeAt(0)
                    }
                },
                games: {
                    type: '[GameJson]',
                    resolve(source, args, context, info) {
                        const teamIds = source.teamScores.map(teamScore => teamScore.teamId)
                        return context.nodeModel
                            .getAllNodes({ type: 'GameJson' })
                            .filter(game => teamIds.includes(game.homeTeamId))
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
                sortId: {
                    type: 'Int',
                    resolve(source, args, context, info) {
                        let regex = /(JO|MO|M)(\d+)(?:-(\d+))?/
                        let result = source.name.match(regex)
                        return parseInt(result[2]) * 10 + parseInt(result[3])
                    }
                },
                games: {
                    type: '[GameJson]',
                    resolve(source, args, context, info) {
                        return context.nodeModel
                            .getAllNodes({ type: 'GameJson' })
                            .filter(
                                game =>
                                    game.homeTeamId === source.id || game.awayTeamId === source.id
                            )
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

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `sheets/scores/${node.id}`,
            component: path.resolve(`./src/templates/sheets/Scores.js`),
            context: {
                id: node.id
            }
        })
    })

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `sheets/games/${node.id}`,
            component: path.resolve(`./src/templates/sheets/Games.js`),
            context: {
                id: node.id
            }
        })
    })

    const result = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        frontmatter {
                            path
                        }
                    }
                }
            }
        }
    `)

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.frontmatter.path,
            component: path.resolve(`src/templates/Page.js`),
            context: {}
        })
    })
}
