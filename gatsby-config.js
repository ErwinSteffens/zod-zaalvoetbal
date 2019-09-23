module.exports = {
    siteMetadata: {
        title: `ZOD Zaal Voetbal`,
        siteUrl: `https://zodzaalvoetbal.nl`,
        description: `Onderlinge zaalvoetbal competitie voor de jeugd in Zuidoost-Drenthe`
    },
    plugins: [
        `gatsby-plugin-sass`,
        `gatsby-transformer-json`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `./../data/`
            }
        }
    ]
}
