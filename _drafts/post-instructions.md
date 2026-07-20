---
title: Example Draft                # post title
description:                        # short summary (optional)
categories: [Blogging]               # up to 2 levels, e.g. [Blogging, Tutorial]
tags: []                             # flat list, any casing, e.g. [ruby, jekyll]
pin: false                           # true pins this post to the top of Home/category/tag listings
hidden: false                        # true excludes this post from Home's listing (still built + reachable by direct URL)
toc: true                            # false hides the right-panel table of contents for this post
math: false                          # true enables MathJax rendering on this post
mermaid: false                       # true enables Mermaid diagram rendering on this post
image:                               # optional cover image block
  path:                              # image URL/path
  alt:                               # alt text
  lqip:                              # low-quality placeholder (blurred preview while loading)
  no_bg: false                       # true skips the background/card treatment for the image
media_subpath:                       # optional base path prefix, so images/audio/video in this post can use shorter relative paths
render_with_liquid: true             # false tells Jekyll not to process Liquid tags in this post's body (useful if the content has literal {% %} / {{ }} text)
---

This is an example draft post.

A few things worth knowing about drafts:

- This file has no date in its filename — that's what makes it a draft instead of a real post.
- It won't show up when you run `bundle exec jekyll serve` normally, or on the live site.
- To preview it locally (with drafts included), run:

  ```console
  $ bundle exec jekyll serve --drafts
  ```

- When it's ready to publish, just move it into `_posts/` — no need to add a date to the filename. A build hook (`_plugins/auto-date-posts.rb`) automatically prepends today's date the first time it builds, since Jekyll requires that prefix internally even though the date itself is never displayed anywhere on the site.

Feel free to edit or delete this file — it's just here to show the pattern.
