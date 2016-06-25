## Install
```bash
npm install hexo-spoiler --save
```
## Usage
```fundamental
{% spoiler text %}
```

It will add mosiac to your text, and the text will show up when mouse on it.

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
