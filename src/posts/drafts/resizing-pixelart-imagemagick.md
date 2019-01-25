---
title: How to Resize Pixel Art Easily
date: 2018-12-20T04:57:02.568Z
tags: pixel, art, resize, imagemagick, convert
category: til
---

```
brew install imagemagick
```

Use point filter to preserve pixels

Resize 200%.

```
convert in.png -filter point -resize 200% out.png
```
