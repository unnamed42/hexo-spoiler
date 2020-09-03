## Install
```bash
npm install hexo-spoiler --save
```

If hexo can't detect this plugin automatically, you need to modify the `plugins` section of `[path_to_your_site]/_config.yml` manually, like:

```yaml
plugins:
 - hexo-spoiler
```

## Syntax
```plain
{% spoiler option:value text... %}
```

All options must match the `<option>:<value>` format. Texts starting from the first invalid option will be considered normal text.

Available options:

|Option name|Type|Option value|Effect|
|-|-|-|-|
|`style`|`string`|`blur` or `box`|The spoiler text will be blurred or covered by a box. The default style is `blur`.|
|`color`|`string`|All valid css colors</br>**NO** spaces allowed for inline option!|Only works in `style:box`, changes the color of the box. The default color is `black`|
|`p`|`boolean`(in `_config.yml` or front-matter)<br/>`string`(in inline options)|empty or any string|The spoiler text will be wrapped by `<p>` rather than `<span>`. Add this if you want newline before & after spoiler text. </br>For inline options, assign any value (except `"false"`) or even omit it turns this on; `"false"` means off. The default state is off.|

[Examples and preview](http://htmlpreview.github.io/?https://github.com/unnamed42/hexo-spoiler/blob/master/example/index.html)

You can set these options globally or for a single post or for a single usage: 

Global config (in blog's `_config.yml`):

```yaml
# ... other configs
# be top-level
spoiler:
  style: blur
  p: true
```

Config for single post (in post's front-matter):

```yaml
---
title: blah blah
spoiler:
  style: box
  color: yellow
  p: false
---
```

Config priority: inline option > front-matter > _config.yml > default

**NOTE**: Run `hexo clean` if you changed the global `_config.yml`.

## Limitations

* Due to the limitations of hexo tags, context-related features like markdown footnote will not be rendered correctly. The renderer instance is different from what is used in post rendering, so it has no knowledge about context.
* Block elements like `<blockquote>`, `<figure>` is not supported.
