import React from 'react';

// Import typefaces
import 'typeface-montserrat';
import 'typeface-merriweather';

import profilePic from '../assets/ryan_casual_tea.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt="Ryan Kubik"
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Ryan Kubik</strong>. If you{"'"}d like to get notified when I release
          something new, <a href="https://twitter.com/ryrykubes">follow me on twitter</a>
          {' and '}
          <a href="https://r-k.io/mail.html">sign up for my mailing list!</a>
        </p>
      </div>
    );
  }
}

export default Bio;
