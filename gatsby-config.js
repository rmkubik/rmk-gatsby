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
                parts: [{ field: 'date', format: 'mmmm dS' }],
              },
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 560,
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
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
              pathPrefix
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + site.pathPrefix + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + site.pathPrefix + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { fields: { collection: { eq: "posts" } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: 'Games & Code by Ryan Kubik',
          },
        ],
      },
    },
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
