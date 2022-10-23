const path = require(`path`)

exports.createSchemaCustomization = ({ actions, schema }) => {
    const { createTypes } = actions

    const typeDefs = [
        `type ClubJson implements Node {
            teams: [TeamJson] @link(by: "clubId", from: "jsonId")
         }`,
        `type LocationJson implements Node {
            games: [GameJson] @link(by: "locationId", from: "jsonId")
         }`,
        `type GameJson implements Node {
            poule: PouleJson @link(by: "jsonId", from: "pouleId")
            homeTeam: TeamJson @link(by: "jsonId", from: "homeTeamId")
            homeScore: Int
            awayTeam: TeamJson @link(by: "jsonId", from: "awayTeamId")
            awayScore: Int
            location: LocationJson @link(by: "jsonId", from: "locationId")
            field: Int
         }`,
        `type TeamScore {
            team: TeamJson @link(by: "jsonId", from: "teamId")
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
                    },
                },
                games: {
                    type: '[GameJson]',
                    resolve: async (source, args, context, info) => {
                        const teamIds = source.teamScores.map((teamScore) => teamScore.teamId)
                        let games = await context.nodeModel.findAll({ type: 'GameJson' })

                        return games.entries.filter((game) => teamIds.includes(game.homeTeamId))
                    },
                },
            },
        }),
        `type TeamJson implements Node {
            club: ClubJson @link(by: "jsonId", from: "clubId")
            poule: PouleJson @link(by: "jsonId", from: "pouleId")
         }`,
        schema.buildObjectType({
            name: 'TeamJson',
            fields: {
                fullName: {
                    type: 'String',
                    resolve: async (source, args, context, info) => {
                        let club = await context.nodeModel.findOne({
                            query: {
                                filter: {
                                    jsonId: { eq: source.clubId },
                                },
                            },
                            type: 'ClubJson',
                        })
                        return `${club.name} ${source.name}`
                    },
                },
                isChampion: {
                    type: 'Boolean',
                    resolve: async (source, args, context, info) => {
                        let poule = await context.nodeModel.findOne({
                            query: {
                                filter: {
                                    jsonId: { eq: source.pouleId },
                                },
                            },
                            type: 'PouleJson',
                        })

                        if (poule.isFinished) {
                            let teamScore = poule.teamScores.find(
                                (ts) => ts.teamId === source.jsonId
                            )
                            return teamScore.rank === 0
                        }
                        return false
                    },
                },
                sortId: {
                    type: 'Int',
                    resolve: (source, args, context, info) => {
                        let regex = /(JO|MO|M)(\d+)(?:-(\d+))?/
                        let result = source.name.match(regex)

                        let teamType = result[1]
                        if (teamType === 'M') {
                            return parseInt(result[2])
                        }

                        return parseInt(result[2]) * 10 + parseInt(result[3])
                    },
                },
                games: {
                    type: '[GameJson]',
                    resolve: async (source, args, context, info) => {
                        var games = await context.nodeModel.findAll({ type: 'GameJson' })

                        return games.entries.filter(
                            (game) =>
                                game.homeTeamId === source.jsonId ||
                                game.awayTeamId === source.jsonId
                        )
                    },
                },
            },
        }),
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
                        jsonId
                    }
                }
            }
        }
    `)

    clubs.data.allClubJson.edges.forEach(({ node }) => {
        createPage({
            path: `/${node.jsonId}`,
            component: path.resolve(`./src/templates/club.js`),
            context: {
                id: node.jsonId,
            },
        })
    })

    const teams = await graphql(`
        query {
            allTeamJson {
                edges {
                    node {
                        jsonId
                        name
                        club {
                            jsonId
                        }
                    }
                }
            }
        }
    `)

    teams.data.allTeamJson.edges.forEach(({ node }) => {
        createPage({
            path: `${node.club.jsonId}/${node.name}`,
            component: path.resolve(`./src/templates/team.js`),
            context: {
                id: node.jsonId,
            },
        })
    })

    const poules = await graphql(`
        query {
            allPouleJson {
                edges {
                    node {
                        jsonId
                        name
                    }
                }
            }
        }
    `)

    poules.data.allPouleJson.edges.forEach(({ node }) => {
        createPage({
            path: `poules/${node.jsonId}`,
            component: path.resolve(`./src/templates/poule.js`),
            context: {
                id: node.jsonId,
            },
        })
    })

    const locations = await graphql(`
        query {
            allLocationJson {
                edges {
                    node {
                        jsonId
                    }
                }
            }
        }
    `)

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `locaties/${node.jsonId}`,
            component: path.resolve(`./src/templates/location.js`),
            context: {
                id: node.jsonId,
            },
        })
    })

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `sheets/scores/${node.jsonId}`,
            component: path.resolve(`./src/templates/sheets/scores.js`),
            context: {
                id: node.jsonId,
            },
        })
    })

    locations.data.allLocationJson.edges.forEach(({ node }) => {
        createPage({
            path: `sheets/games/${node.jsonId}`,
            component: path.resolve(`./src/templates/sheets/games.js`),
            context: {
                id: node.jsonId,
            },
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
            component: path.resolve(`src/templates/page.js`),
            context: {},
        })
    })
}
