import Typography from 'typography';
import sutro from 'typography-theme-sutro';

sutro.overrideThemeStyles = ({ adjustFontSizeTo, rhythm }, options, styles) => ({
  a: {
    color: 'rgb(44, 102, 202)',
  },
});

const typography = new Typography(sutro);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

console.log(typography.toString());

export default typography;
export const { rhythm } = typography;
export const { scale } = typography;
