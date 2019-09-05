module.exports = {
  siteMetadata: {
    title: 'Games & Code',
    author: 'Ryan Kubik',
    description: 'Games and Other Projects',
    siteUrl: 'https://www.ryankubik.com',
  },
  pathPrefix: '/blog',
  plugins: [
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     path: `${__dirname}/src/pages`,
    //     name: 'pages',
    //   },
    // },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/posts/published`,
        name: 'posts',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/portfolio/published`,
        name: 'portfolio',
      },
    },
    // {
    //   resolve: '@mosch/gatsby-source-github',
    //   options: {
    //     repository: 'til',
    //     tree: true,
    //     releases: true,
    //     user: 'rmkubik',
    //     secrets: {
    //       token: process.env.GITHUB_API_KEY,
    //     },
    //   },
    // },
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-social-cards',
            options: {
              title: {
                field: 'title',
              },
              meta: {
                parts: [
                  { field: 'date', format: 'mmmm dS' },
                ],
              },
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-autolink-headers',
          /*
           * 'gatsby-remark-prismjs' should be placed after 'gatsby-remark-autolink-headers'
           * https://www.gatsbyjs.org/packages/gatsby-remark-autolink-headers/
           */
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-125634529-2',
      },
    },
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Gatsby Starter Blog',
        short_name: 'GatsbyJS',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#32508C',
        display: 'minimal-ui',
        icon: 'src/assets/rmk-icon.png',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    'gatsby-remark-reading-time',
  ],
};
