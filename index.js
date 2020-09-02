"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const baseCSS = `
.spoiler {
  display: inline-flex;
}
p.spoiler {
  display: flex;
}
.spoiler a {
  pointer-events: none;
}
.spoiler-blur, .spoiler-blur > * {
  transition: text-shadow .5s ease;
}
.spoiler .spoiler-blur, .spoiler .spoiler-blur > * {
  color: rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0);
  text-shadow: 0 0 10px grey;
  cursor: pointer;
}
.spoiler .spoiler-blur:hover, .spoiler .spoiler-blur:hover > * {
  text-shadow: 0 0 5px grey;
}
.spoiler-box, .spoiler-box > * {
  transition: color .5s ease,
  background-color .5s ease;
}
.spoiler .spoiler-box, .spoiler .spoiler-box > * {
  color: black;
  background-color: black;
  text-shadow: none;
}`;
const appendToHead = (document, content) => document.replace(/<\/head>/i, `${content}</head>`);
const render = (text) => {
    const result = hexo.render.renderSync({ text, engine: "markdown" });
    return text.includes("\n\n") ? result : result.replace(/<\/?p>/gi, "").trim();
};
const isColor = (color) => {
    const regex = /(#(?:[0-9a-f]{2}){2,4}$|(#[0-9a-f]{3}$)|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\)$|black$|silver$|gray$|whitesmoke$|maroon$|red$|purple$|fuchsia$|green$|lime$|olivedrab$|yellow$|navy$|blue$|teal$|aquamarine$|orange$|aliceblue$|antiquewhite$|aqua$|azure$|beige$|bisque$|blanchedalmond$|blueviolet$|brown$|burlywood$|cadetblue$|chartreuse$|chocolate$|coral$|cornflowerblue$|cornsilk$|crimson$|currentcolor$|darkblue$|darkcyan$|darkgoldenrod$|darkgray$|darkgreen$|darkgrey$|darkkhaki$|darkmagenta$|darkolivegreen$|darkorange$|darkorchid$|darkred$|darksalmon$|darkseagreen$|darkslateblue$|darkslategray$|darkslategrey$|darkturquoise$|darkviolet$|deeppink$|deepskyblue$|dimgray$|dimgrey$|dodgerblue$|firebrick$|floralwhite$|forestgreen$|gainsboro$|ghostwhite$|goldenrod$|gold$|greenyellow$|grey$|honeydew$|hotpink$|indianred$|indigo$|ivory$|khaki$|lavenderblush$|lavender$|lawngreen$|lemonchiffon$|lightblue$|lightcoral$|lightcyan$|lightgoldenrodyellow$|lightgray$|lightgreen$|lightgrey$|lightpink$|lightsalmon$|lightseagreen$|lightskyblue$|lightslategray$|lightslategrey$|lightsteelblue$|lightyellow$|limegreen$|linen$|mediumaquamarine$|mediumblue$|mediumorchid$|mediumpurple$|mediumseagreen$|mediumslateblue$|mediumspringgreen$|mediumturquoise$|mediumvioletred$|midnightblue$|mintcream$|mistyrose$|moccasin$|navajowhite$|oldlace$|olive$|orangered$|orchid$|palegoldenrod$|palegreen$|paleturquoise$|palevioletred$|papayawhip$|peachpuff$|peru$|pink$|plum$|powderblue$|rosybrown$|royalblue$|saddlebrown$|salmon$|sandybrown$|seagreen$|seashell$|sienna$|skyblue$|slateblue$|slategray$|slategrey$|snow$|springgreen$|steelblue$|tan$|thistle$|tomato$|transparent$|turquoise$|violet$|wheat$|white$|yellowgreen$|rebeccapurple$)/i;
    return regex.test(color);
};
const hashedName = (colorName, length = 5) => crypto_1.createHash("md5").update(colorName).digest("hex").slice(0, length);
const parseOption = (args) => {
    var _a;
    const options = {};
    if (args === undefined)
        return [options, []];
    const processors = {
        style: arg => ["blur", "box"].includes(arg) ? (options.style = arg, true) : false,
        color: arg => isColor(arg) ? (options.color = arg, true) : false,
        p: arg => ((options.p = arg !== "false"), true)
    };
    let i = 0;
    for (; i < args.length; ++i) {
        const regex = /^(?<option>\w+):(?<value>.*)$/;
        const matches = regex.exec(args[i]);
        if ((matches === null || matches === void 0 ? void 0 : matches.groups) == undefined)
            break;
        const { option, value } = matches.groups;
        if (!((_a = processors[option]) === null || _a === void 0 ? void 0 : _a.call(processors, value)))
            break;
    }
    return [options, args.slice(i)];
};
hexo.extend.tag.register("spoiler", function (args) {
    const globalOptions = hexo.config.spoiler;
    const postOptions = this.spoiler;
    const [parsedOptions, contents] = parseOption(args);
    const content = render(contents.join(" "));
    const { style = "blur", color, p = false } = Object.assign(Object.assign(Object.assign({}, globalOptions), postOptions), parsedOptions);
    const colorClass = color ? `spoiler-${hashedName(color)}` : "";
    const colorDef = color ? `<!-- spoiler-${hashedName(color)}:${color} -->` : "";
    const tag = p ? "p" : "span";
    return `${colorDef}
  <${tag} class="spoiler" onclick="this.classList.toggle('spoiler')">
    <span class="spoiler-${style} ${colorClass}">${content}</span>
  </${tag}>`;
});
hexo.extend.filter.register("after_render:html", document => {
    const regex = /<!-- spoiler-([^:]+):([^\s]+) -->/g;
    const colors = {};
    document = document.replace(regex, (_, hash, color) => {
        colors[hash] = `
    .spoiler .spoiler-box.spoiler-${hash}, .spoiler .spoiler-box.spoiler-${hash} > * {
      color: ${color};
      background-color: ${color};
    }`;
        return "";
    });
    return appendToHead(document, `<style type="text/css">${baseCSS}${Object.values(colors).join("\n")}</style>`);
}, 1);
