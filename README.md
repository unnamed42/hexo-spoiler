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

|Option name|Option value|Effect|
|-|-|-|
|`style`|`blur` or `box`|The spoiler text will be blurred or covered by a box. The default style is `blur`.|
|`color`|All valid css colors, but **NO** space allowed!|Only works in `style:box`, changes the color of the box. The default color is `black`|
|`p`|Empty or anything|The spoiler text will be wrapped by `<p>` rather than `<span>`. Add this if you want newline before&after spoiler text|

[Preview](./example/index.html)

## Limitations

Due to the limitations of hexo tags, context-related features like markdown footnote will not be rendered correctly. The renderer instance is different from what is used in post rendering, so it has no knowledge about context.
