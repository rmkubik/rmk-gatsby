import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import { rhythm, scale } from '../utils/typography';
import styles from './blog-post.module.css';

class PortfolioPageTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props;
    const post = data.markdownRemark;
    const siteTitle = data.site.siteMetadata.title;
    const siteDescription = post.excerpt;
    const { previous, next } = pageContext;

    return (
      <Layout location={location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
          className={styles.date}
        >
          {post.frontmatter.date}
        </p>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(2),
            marginTop: rhythm(-1),
          }}
        />
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

export default PortfolioPageTemplate;

export const pageQuery = graphql`
  query PortfolioPageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        category
        title
        date(formatString: "MMMM DD, YYYY")
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`;
