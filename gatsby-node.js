const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const portfolioPage = path.resolve('./src/templates/portfolio-page.js');

    resolve(
      // graphql(
      //   `
      //     {
      //       allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
      //         edges {
      //           node {
      //             fields {
      //               slug
      //             }
      //             frontmatter {
      //               title
      //             }
      //           }
      //         }
      //       }
      //     }
      //   `,
      graphql(
        `
          {
            portfolio: allFile(
              filter: { sourceInstanceName: { eq: "portfolio" }, extension: { eq: "md" } }
            ) {
              edges {
                node {
                  name
                  childMarkdownRemark {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
            posts: allFile(
              filter: { sourceInstanceName: { eq: "posts" }, extension: { eq: "md" } }
            ) {
              edges {
                node {
                  name
                  childMarkdownRemark {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
          }
        `,
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.posts.edges;
        posts.forEach((post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node.childMarkdownRemark;
          const next = index === 0 ? null : posts[index - 1].node.childMarkdownRemark;
          const { slug } = post.node.childMarkdownRemark.fields;

          createPage({
            path: slug,
            component: blogPost,
            context: {
              slug,
              previous,
              next,
            },
          });
        });

        const portfolio = result.data.portfolio.edges;
        portfolio.forEach((portfolioItem, index) => {
          const previous =
            index === portfolio.length - 1 ? null : portfolio[index + 1].node.childMarkdownRemark;
          const next = index === 0 ? null : portfolio[index - 1].node.childMarkdownRemark;
          const { slug } = portfolioItem.node.childMarkdownRemark.fields;

          createPage({
            path: slug,
            component: portfolioPage,
            context: {
              slug,
              previous,
              next,
            },
          });
        });
      }),
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};
