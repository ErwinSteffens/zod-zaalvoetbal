module.exports = {
    siteMetadata: {
        title: `ZOD Zaal Voetbal`,
        siteUrl: `https://zodzaalvoetbal.nl`,
        description: `Onderlinge zaalvoetbal competitie voor de jeugd in Zuidoost-Drenthe`
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-transformer-json`,
        `gatsby-transformer-yaml`,
        `gatsby-transformer-remark`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/data/`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/markdown/`,
                name: `markdown`
            }
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
                        density: '0.75'
                    },
                    {
                        src: '/android-icon-48x48.png',
                        sizes: '48x48',
                        type: 'image/png',
                        density: '1.0'
                    },
                    {
                        src: '/android-icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                        density: '1.5'
                    },
                    {
                        src: '/android-icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                        density: '2.0'
                    },
                    {
                        src: '/android-icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                        density: '3.0'
                    },
                    {
                        src: '/android-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        density: '4.0'
                    }
                ]
            }
        },
        {
            resolve: `gatsby-plugin-gtag`,
            options: {
                trackingId: `G-QDV8JQK26G`
            }
        }
    ]
}
