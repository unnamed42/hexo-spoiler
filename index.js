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
const hashedName = (colorName, length = 5) => crypto_1.createHash("md5").update(colorName).digest("hex").slice(0, length);
const parseOption = (args) => {
    var _a;
    const options = { style: "blur" };
    if (args === undefined)
        return [options, []];
    const processors = {
        style: arg => ["blur", "box"].includes(arg) ? (options.style = arg, true) : false,
        color: arg => (options.color = arg, true),
        p: arg => (options.p = true)
    };
    let i = 0;
    for (; i < args.length; ++i) {
        const regex = /^(?<option>\w+):(?<value>\w+)?$/;
        const matches = regex.exec(args[i]);
        if ((matches === null || matches === void 0 ? void 0 : matches.groups) == undefined)
            break;
        const { option, value } = matches.groups;
        if (!((_a = processors[option]) === null || _a === void 0 ? void 0 : _a.call(processors, value)))
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
