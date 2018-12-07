import React from 'react';
import PropTypes from 'prop-types';
import { rhythm } from '../utils/typography';

import MainHeader from './MainHeader';
import PostHeader from './PostHeader';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = <MainHeader title={title} />;
    } else {
      header = <PostHeader title={title} />;
    }
    return (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </div>
    );
  }
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: undefined,
};

export default Layout;
