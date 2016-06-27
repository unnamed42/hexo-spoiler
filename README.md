## Install
```bash
npm install hexo-spoiler --save
```
## Usage
```fundamental
{% spoiler text %}
```

**Important**: You must ensure jquery is injected before your main article!

It will add mosiac to your text, and the text will show up when clicked. Click again to hide your text.

But you need to add `<br>` manually if you want line breaks after/before it.

## Effect
When you writes:
```fundamental
{% spoiler text %} 
{% spoiler ~~text~~ %}
{% spoiler *text* %}
{% spoiler **text** %}
```
![ ](img/before.png)

![ ](img/after.png)
