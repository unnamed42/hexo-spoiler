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
{% spoiler [text] %}
```

It will pixelate your text, and click to reveal. Click again to hide your text again.

But you need to add `<br>` manually if you want line breaks after/before it.

## Preview
When you writes:
```plain
{% spoiler text %} 
{% spoiler ~~text~~ %}
{% spoiler *text* %}
{% spoiler **text** %}
```
![ ](img/before.png)

![ ](img/after.png)
