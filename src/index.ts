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
  return text.includes("\n\n") ? result.replace(/<\/?p>/gi, "").trim() : result;
};

// get the first `length` characters of md5 checksum of `colorName`
const hashedName = (colorName: string, length = 5): string =>
  createHash("md5").update(colorName).digest("hex").slice(0, length);

interface Options {
  style: string;
  color?: string;
  p?: boolean;
}

const parseOption = (args: string[] | undefined): [Options, string[]] => {
  const options: Options = { style: "blur" };
  if(args === undefined)
    return [options, []];

  const processors: Record<string, (arg: string) => boolean> = {
    style: arg =>
      ["blur", "box"].includes(arg) ? (options.style = arg, true) : false,
    color: arg =>
      (options.color = arg, true),
    p: arg =>
      (options.p = true)
  };

  let i = 0;
  for(; i < args.length; ++i) {
    const regex = /^(?<option>\w+):(?<value>\w+)?$/;
    const matches = regex.exec(args[i]);
    if(matches?.groups == undefined)
      break;
    const { option, value } = matches.groups;
    if(processors[option]?.(value) == undefined)
      break;
  }

  return [options, args.slice(i)];
};

hexo.extend.tag.register("spoiler", args => {
  const [options, contents] = parseOption(args);
  const content = render(contents.join(" "));

  const color = options.color ? `spoiler-${hashedName(options.color)}` : "";
  const colorDef = options.color ? `<!-- spoiler-${hashedName(options.color)}:${options.color} -->` : "";
  const tag = options.p ? "p" : "span";

  return `${colorDef}
  <${tag} class="spoiler" onclick="this.classList.toggle('spoiler')">
    <span class="spoiler-${options.style} ${color}">${content}</span>
  </${tag}>`;
});

hexo.extend.filter.register("after_render:html", document => {
  const regex = /<!-- spoiler-([^:]+):([^\s]+) -->/g;
  const colors: Record<string, string> = {};
  document = document.replace(regex, (_, hash: string, color: string) => {
    // language=css
    colors[hash] = `
    .spoiler .spoiler-box .spoiler-${hash}, .spoiler .spoiler-box .spoiler-${hash} > * {
      color: ${color};
      background-color: ${color};
    }`;
    return "";
  });
  return appendToHead(document, `<style type="text/css">${baseCSS}${Object.values(colors).join("\n")}</style>`);
}, 1);
