import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { rhythm } from '../utils/typography';

import styles from './header.module.css';

class PostHeader extends React.Component {
  render() {
    const { title } = this.props;

    return (
      <h3
        style={{
          fontFamily: 'Montserrat, sans-serif',
          marginTop: 0,
          marginBottom: rhythm(-1),
        }}
      >
        <Link className={styles.header} to="/">
          {title}
        </Link>
      </h3>
    );
  }
}

PostHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PostHeader;
