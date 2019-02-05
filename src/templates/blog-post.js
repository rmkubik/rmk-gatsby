import React from 'react';
import Helmet from 'react-helmet';
import { Link, graphql } from 'gatsby';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import { rhythm, scale } from '../utils/typography';
import styles from './blog-post.module.css';

class BlogPostTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props;
    const post = data.markdownRemark;
    const siteTitle = data.site.siteMetadata.title;
    const { siteUrl } = data.site.siteMetadata;
    const siteDescription = post.excerpt;
    const { slug, socialCard } = post.fields;
    const { previous, next } = pageContext;
    const getSubTitle = (category) => {
      switch (category) {
        case 'til':
          return "TIL - Today I learned. A collection of random things I've recorded so I can find them again later.";
        case 'tldr':
          return "TLDR - Too long, didn't read. Summaries, Notes, and Takeaways of Videos, Articles, and Books I've read or watched.";
        default:
          return '';
      }
    };

    return (
      <Layout location={location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[
            { name: 'description', content: siteDescription },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: siteUrl },
            { name: 'twitter:title', content: siteTitle },
            { name: 'twitter:description', content: siteDescription },
            { name: 'twitter:image', content: `${siteUrl}${slug}twitter-card.jpg` },
          ]}
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
        >
          {getSubTitle(post.frontmatter.category)}
        </p>
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

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        category
        title
        socialCard
        date(formatString: "MMMM DD, YYYY")
      }
      fields {
        readingTime {
          text
        }
        slug
      }
    }
  }
`;
