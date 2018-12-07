import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { rhythm, scale } from '../utils/typography';

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
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
          }}
          to="/"
        >
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
