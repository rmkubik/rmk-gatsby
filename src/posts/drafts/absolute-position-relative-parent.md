---
title: Absolutely Positioning a Child Relative to Parent
date: 2018-12-20T04:57:02.568Z
tags: javascript, relative, absolute, position, parent, child
category: til
---

Parent is position: relative, child is position: absolute. Use top: 0 or bottom: 0.
https://stackoverflow.com/questions/10487292/position-absolute-but-relative-to-parent

The parent div needs to be display: inline-block to set width of parent equal to width of child
https://www.delaim.com/css-to-make-a-parent-div-auto-size-to-the-width-of-its-children-divs/

You need to set image, canvas, or svg to display: block because they have extra inline caluclation height otherwise
https://stackoverflow.com/questions/11126685/why-does-container-div-insist-on-being-slightly-larger-than-img-or-svg-content

My codepen exmaple with a button and a canvas
https://codepen.io/rmkubik/pen/PVPXvw
