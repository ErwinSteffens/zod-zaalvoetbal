import { Actions, CreatePagesArgs, CreateSchemaCustomizationArgs } from 'gatsby'

const path = require(`path`)

exports.createSchemaCustomization = ({ actions, schema }: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions

  const typeDefs = [
    `type ClubJson implements Node {
      jsonId: String!
      name: String!
      contact: ContactJson @link(from: "clubId")
      teams: [TeamJson!]! @link(by: "clubId", from: "jsonId")
    }`,
    `type ContactJson implements Node {
      name: String!
      club: ClubJson @link(by: "jsonId", from: "clubId")
    }`,
    `type LocationJson implements Node {
      jsonId: String!
      venue: String!
      city: String!
      postalCode: String!
      address: String!
      placeId: String!
      games: [GameJson!] @link(by: "locationId", from: "jsonId")
    }`,
    `type GameJson implements Node {
      poule: PouleJson! @link(by: "jsonId", from: "pouleId")
      homeTeam: TeamJson! @link(by: "jsonId", from: "homeTeamId")
      homeScore: Int
      awayTeam: TeamJson! @link(by: "jsonId", from: "awayTeamId")
      awayScore: Int
      location: LocationJson! @link(by: "jsonId", from: "locationId")
      field: Int
    }`,
    `type TeamScore {
      jsonId: String!
      team: TeamJson! @link(by: "jsonId", from: "teamId")
      rank: Int!
      points: Int!
      gamesPlayed: Int!
      gamesWon: Int!
      gamesLost: Int!
      gamesDraw: Int!
      goalsFor: Int!
      goalsAgainst: Int!
      goalsDifference: Int!
    }`,
    `type PouleJson implements Node {
      jsonId: String!
      teamScores: [TeamScore!]!
    }`,
    schema.buildObjectType({
      name: 'PouleJson',
      fields: {
        sortId: {
          type: 'Int!',
          resolve(source, args, context, info) {
            if (source.name === 'Minis') {
              return 0
            }
            let regex = /O(\d+) Poule ([A-Z]{1})/
            let result = source.name.match(regex)
            return parseInt(result[1]) * 100 + result[2].charCodeAt(0)
          },
        },
        games: {
          type: '[GameJson]!',
          resolve: async (source, args, context, info) => {
            const teamIds = source.teamScores.map((teamScore: any) => teamScore.teamId)
            let games: any = await context.nodeModel.findAll({ type: 'GameJson' })

            return games.entries.filter((game: any) => teamIds.includes(game.homeTeamId))
          },
        },
      },
    }),
    `type TeamJson implements Node {
      jsonId: String!
      club: ClubJson! @link(by: "jsonId", from: "clubId")
      poule: PouleJson! @link(by: "jsonId", from: "pouleId")
    }`,
    schema.buildObjectType({
      name: 'TeamJson',
      fields: {
        fullName: {
          type: 'String!',
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
          type: 'Boolean!',
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
              let teamScore = poule.teamScores.find((ts: any) => ts.teamId === source.jsonId)
              return teamScore.rank === 0
            }
            return false
          },
        },
        sortId: {
          type: 'Int!',
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
          type: '[GameJson!]!',
          resolve: async (source, args, context, info) => {
            var games = await context.nodeModel.findAll({ type: 'GameJson' })

            return games.entries.filter(
              (game: any) => game.homeTeamId === source.jsonId || game.awayTeamId === source.jsonId
            )
          },
        },
      },
    }),
  ]
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }: CreatePagesArgs) => {
  const { createPage } = actions

  const clubs = await graphql<any>(`
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

  clubs.data.allClubJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `/${node.jsonId}`,
      component: path.resolve(`./src/templates/Club.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  const teams = await graphql<any>(`
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

  teams.data.allTeamJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `${node.club.jsonId}/${node.name}`,
      component: path.resolve(`./src/templates/Team.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  const poules = await graphql<any>(`
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

  poules.data.allPouleJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `poules/${node.jsonId}`,
      component: path.resolve(`./src/templates/Poule.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  const locations = await graphql<any>(`
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

  locations.data.allLocationJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `locaties/${node.jsonId}`,
      component: path.resolve(`./src/templates/Location.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  locations.data.allLocationJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `sheets/scores/${node.jsonId}`,
      component: path.resolve(`./src/templates/sheets/Scores.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  locations.data.allLocationJson.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: `sheets/games/${node.jsonId}`,
      component: path.resolve(`./src/templates/sheets/Games.js`),
      context: {
        id: node.jsonId,
      },
    })
  })

  const result = await graphql<any>(`
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

  result.data.allMarkdownRemark.edges.forEach(({ node }: { node: any }) => {
    createPage({
      path: node.frontmatter.path,
      component: path.resolve(`src/templates/Page.js`),
      context: {},
    })
  })
}
