---
title: How to Resize Pixel Art Easily
date: 2018-12-20T04:57:02.568Z
tags: pixel, art, resize, imagemagick, convert
category: til
---

I've been doing a bit of pixel art lately in my gamedev projects, like Wildfire. This generally ends up with me creating art that is something on the scale of 32x32 pixels. But its viewed at resolutions much higher than that in game or when sharing on Twitter. I've been searching for an easy way to automate scaling of pixel art. This brings ImageMagick onto the scene.

I use MacOS right now, so I can use Homebrew to manage the different software installed on my computer. I installed ImageMagick via Homebrew using the following command.

```
brew install imagemagick
```

ImageMagick is very powerful and has a whole suite of commands and options worth investigating further. For this task, we'll only need to make use of the `convert` command. The first input to the command is your input file and the last input is your new output file.

```
convert input.png output.png
```

`convert` has a large number of options to allow you to use it for any number of scenarios. We're going to need to use two options to achieve our desired result.

The default filtering setting in Image Magick is not good for resizing pixel art. It applies anti-aliasing and attempts to smooth the image. For pixel art we generally want the image to stay crisp and intentional. To change this we must use the `-filter` flag with the `point` filter.

```
convert input.png -filter point output.png
```

The final option we need to use is `-resize`. This works by taking in a percentage value indicating the size change you want in the output image. We will double the size of our image.

```
convert input.png -filter point -resize 200% output.png
```

ImageMagick allows you to create fairly simple commands like the one above to automate your image asset authoring pipeline. You can draw your art in a 16x16 pixel grid and automatically size it up to the resolution you need in your game assets. If you take the time to explore the API, you'll find even more powerful features to speed up your workflow.
