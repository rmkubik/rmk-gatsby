import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { rhythm, scale } from '../utils/typography';

import styles from './header.module.css';

class MainHeader extends React.Component {
  render() {
    const { title } = this.props;

    return (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link className={styles.header} to="/">
          {title}
        </Link>
      </h1>
    );
  }
}

MainHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MainHeader;
