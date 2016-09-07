## Install
```bash
npm install hexo-spoiler --save
```

## Syntax
```plain
{% spoiler [text] %}
```

It will add mosiac to your text, and the text will show up when clicked. Click again to hide your text.

But you need to add `<br>` manually if you want line breaks after/before it.

## Effect
When you writes:
```plain
{% spoiler text %} 
{% spoiler ~~text~~ %}
{% spoiler *text* %}
{% spoiler **text** %}
```
![ ](img/before.png)

![ ](img/after.png)
