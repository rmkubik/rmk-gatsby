---
title: Scale and Center Pixel Art on the Command Line
date: 2020-03-27
tags: pixel, art, pixelart, scale, center, command, line, cli
category: til
---

I've been working on art more often for my game projects. I find a lot of the times, it's inconvenient or impossible to export my art assests in quite the right format. This leads to either a lot of manual fiddling in art programs' export settings or fiddling in image editing tools after the fact. Every time I need to update the asset, the whole process starts again.

Instead of all that, I've started using a tool called [ImageMagick](https://imagemagick.org/) to automate these tasks. It's a very powerful command line interface for image manipulation. When I find a use case for the tool I like to write up a short TIL post about the command arguments used.

Recently, I needed to scale an exported pixel art logo and pad it with transparent background so that I could have Twitter's preview algorithm display it how I wanted.

ImageMagick has several command line utities. The one needed for this task is the `convert` program.

## Input and output files

Imagemagick's `convert` first argument is the the original input file name and it's final argument is the resulting output file's name you want to create. This command will only create an identical copy of `original.png` as a new file called `output.png`.

```bash
convert original.png output.png
```

![original image](./title-card.png)

## Extend the image canvas

In order for Twitter to center my image in its preview window, I needed to add padding around my image. The `-extent` flag will let us do that. It takes an argument that represents the new desired size of the image canvas. Imagemagick supports various different types of size specifiation. We're going to use percentages to make our new image 260% wider and 220% taller than our original.

```bash
convert original.png -extent 260%x220% output.png
```

![extended canvas](./title-card-2.png)

## Center our new image

For Twitter, we want the image centered so its algorithm picks up our logo image in it's preview. Imagemagick extends the canvas behind our image, but doesn't center it by default. To ask `convert` to center our image we'll use the `-gravity` flag. By specifying `center` we'll put the image to the middle of our extended canvas.

Generally, Imagemagick flags take effect from left to right. Because of this, we need to be sure to set out gravity flag before we use the extent flag.

```bash
convert original.png -gravity center -extent 260%x220% output.png
```

![extended canvas](./title-card-3.png)

## Set a transparent background

Blinding white backgrounds rarely look good to me, especially not with the Grim Repair palette! We're going to set the background to transparent instead of white. We do this with the aptly named `-background` flag and set it's value to `none`.

Again, this flag needs to be set before we perform our `-extent` operations.

```bash
convert original.png -gravity center -background none -extent 260%x220% output.png
```

![extended canvas](./title-card-4.png)

## Size it up

We have the correct image format for sharing our game logo now! However, because our source image is pixel art it's pretty small. This image will either end up too small to read when we share it or get scaled in ways we don't want. To prevent this, we'll scale it up ourselves to a readable size.

![extended canvas](./title-card-5.png)

```bash
convert original.png -extent 260%x220% -gravity center -background none -resize 800% output.png
```

## Make it crisp

One common issue with resizing pixel art is that most computer programs aren't optimized to do it correctly be default. When resizing a non-pixel art image computers use an antialiasing algorithm to keep those images from getting jagged edges. However, with pixel art we _want_ those jagged edges!

Fortunately, `convert` has yet another command to allow us to change the algorithm it uses while resizing. The `-filter` flag will let us specify we want to use a `point` filter rather than the default antialiasing filter.

Like our other modifier flags, we need to be sure to apply this before we perform our resize!

```bash
convert original.png -extent 260%x220% -gravity center -background none -filter point -resize 800% output.png
```

![final product](./title-card-6.png)

## Share away

Now we've got a large, crisp, centered pixel art logo ready to share on social media!

Personally, I find this type of task much easier to accomplish on the command line instead of inside an external image editor. As someone who is primarily a programmer with bad memory, I like to be able to automatically redo the same operation without memorizing steps in an image editor. Additionally, I find it much easier to test slight size variations quickly this way.

If you're also interested in useful command line tools, give it a try!
