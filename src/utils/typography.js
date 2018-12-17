import Typography from 'typography';
import sutro from 'typography-theme-sutro';

const typography = new Typography(sutro);

// TODO: FORK AND/OR Sutro style to make anchorColor a style option

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
export const { rhythm } = typography;
export const { scale } = typography;
