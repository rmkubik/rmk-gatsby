const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const portfolioPage = path.resolve('./src/templates/portfolio-page.js');

    resolve(
      graphql(
        `
          {
            portfolio: allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              filter: { fields: { collection: { eq: "portfolio" } } }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
            posts: allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              filter: { fields: { collection: { eq: "posts" } } }
              limit: 1000
            ) {
              edges {
                node {
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
        `,
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.posts.edges;

        posts.forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;
          const { slug } = post.node.fields;

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

        // Create portfolio posts pages.
        const portfolio = result.data.portfolio.edges;

        portfolio.forEach((portfolioItem, index) => {
          const previous = index === portfolio.length - 1 ? null : portfolio[index + 1].node;
          const next = index === 0 ? null : portfolio[index - 1].node;
          const { slug } = portfolioItem.node.fields;

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

    // Create a field on this node for the "collection" of the parent
    // NOTE: This is necessary so we can filter `allMarkdownRemark` by
    // `collection` otherwise there is no way to filter for only markdown
    // documents of type `post`.
    createNodeField({
      node,
      name: 'collection',
      value: getNode(node.parent).sourceInstanceName,
    });
  }
};
