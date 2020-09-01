import { createHash } from "crypto";

// language=css
const baseCSS = `
.spoiler {
  display: inline-flex;
}
p.spoiler {
  display: flex;
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

// add `content` to the end of <head> section
const appendToHead = (document: string, content: string): string =>
  document.replace(/<\/head>/i, `${content}</head>`);

const render = (text: string): string => {
  const result = hexo.render.renderSync({ text, engine: "markdown" });
  // if `text` contains multiple newline, then it's not a inline content, <p> should be preserved.
  return text.includes("\n\n") ? result : result.replace(/<\/?p>/gi, "").trim();
};

const isColor = (color: string): boolean => {
  // regex for matching css colors, credit: https://gist.github.com/olmokramer/82ccce673f86db7cda5e#gistcomment-3227016
  const regex = /(#(?:[0-9a-f]{2}){2,4}$|(#[0-9a-f]{3}$)|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\)$|black$|silver$|gray$|whitesmoke$|maroon$|red$|purple$|fuchsia$|green$|lime$|olivedrab$|yellow$|navy$|blue$|teal$|aquamarine$|orange$|aliceblue$|antiquewhite$|aqua$|azure$|beige$|bisque$|blanchedalmond$|blueviolet$|brown$|burlywood$|cadetblue$|chartreuse$|chocolate$|coral$|cornflowerblue$|cornsilk$|crimson$|currentcolor$|darkblue$|darkcyan$|darkgoldenrod$|darkgray$|darkgreen$|darkgrey$|darkkhaki$|darkmagenta$|darkolivegreen$|darkorange$|darkorchid$|darkred$|darksalmon$|darkseagreen$|darkslateblue$|darkslategray$|darkslategrey$|darkturquoise$|darkviolet$|deeppink$|deepskyblue$|dimgray$|dimgrey$|dodgerblue$|firebrick$|floralwhite$|forestgreen$|gainsboro$|ghostwhite$|goldenrod$|gold$|greenyellow$|grey$|honeydew$|hotpink$|indianred$|indigo$|ivory$|khaki$|lavenderblush$|lavender$|lawngreen$|lemonchiffon$|lightblue$|lightcoral$|lightcyan$|lightgoldenrodyellow$|lightgray$|lightgreen$|lightgrey$|lightpink$|lightsalmon$|lightseagreen$|lightskyblue$|lightslategray$|lightslategrey$|lightsteelblue$|lightyellow$|limegreen$|linen$|mediumaquamarine$|mediumblue$|mediumorchid$|mediumpurple$|mediumseagreen$|mediumslateblue$|mediumspringgreen$|mediumturquoise$|mediumvioletred$|midnightblue$|mintcream$|mistyrose$|moccasin$|navajowhite$|oldlace$|olive$|orangered$|orchid$|palegoldenrod$|palegreen$|paleturquoise$|palevioletred$|papayawhip$|peachpuff$|peru$|pink$|plum$|powderblue$|rosybrown$|royalblue$|saddlebrown$|salmon$|sandybrown$|seagreen$|seashell$|sienna$|skyblue$|slateblue$|slategray$|slategrey$|snow$|springgreen$|steelblue$|tan$|thistle$|tomato$|transparent$|turquoise$|violet$|wheat$|white$|yellowgreen$|rebeccapurple$)/i;
  return regex.test(color);
};

// get the first `length` characters of md5 checksum of `colorName`
const hashedName = (colorName: string, length = 5): string =>
  createHash("md5").update(colorName).digest("hex").slice(0, length);

interface Options {
  style?: string;
  color?: string;
  p?: boolean;
}

const parseOption = (args: string[] | undefined): [Options, string[]] => {
  const options: Options = {};
  if(args === undefined)
    return [options, []];

  const processors: Record<string, (arg: string) => boolean> = {
    style: arg =>
      ["blur", "box"].includes(arg) ? (options.style = arg, true) : false,
    color: arg =>
      isColor(arg) ? (options.color = arg, true) : false,
    p: arg =>
      // passes check for any input, always returns `true`
      ((options.p = arg !== "false"), true)
  };

  let i = 0;
  for(; i < args.length; ++i) {
    const regex = /^(?<option>\w+):(?<value>.*)$/;
    const matches = regex.exec(args[i]);
    if(matches?.groups == undefined)
      break;
    const { option, value } = matches.groups;
    if(!processors[option]?.(value))
      break;
  }

  return [options, args.slice(i)];
};

hexo.extend.tag.register("spoiler", function(args) {
  // options specified in _config.yml
  const globalOptions = hexo.config.spoiler as Options | undefined;
  // options specified in post front-matter
  const postOptions = this.spoiler as Options | undefined;
  // options specified inline
  const [parsedOptions, contents] = parseOption(args);

  const content = render(contents.join(" "));

  const { style = "blur", color, p = false } = { ...globalOptions, ...postOptions, ...parsedOptions };

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
  const colors: Record<string, string> = {};
  document = document.replace(regex, (_, hash: string, color: string) => {
    // language=css
    colors[hash] = `
    .spoiler .spoiler-box.spoiler-${hash}, .spoiler .spoiler-box.spoiler-${hash} > * {
      color: ${color};
      background-color: ${color};
    }`;
    return "";
  });
  return appendToHead(document, `<style type="text/css">${baseCSS}${Object.values(colors).join("\n")}</style>`);
}, 1);
