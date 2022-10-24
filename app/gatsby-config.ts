require('dotenv').config()

module.exports = {
  graphqlTypegen: true,
  siteMetadata: {
    title: `ZOD Zaal Voetbal`,
    siteUrl: `https://zodzaalvoetbal.nl`,
    description: `Onderlinge zaalvoetbal competitie voor de jeugd in Zuidoost-Drenthe`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-transformer-json`,
    `gatsby-transformer-yaml`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/markdown/`,
        name: `markdown`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Zuid-Oost Drenthe Zaalvoetbal',
        short_name: 'ZOD',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
          },
          {
            src: '/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: `G-QDV8JQK26G`,
      },
    },
  ],
}
