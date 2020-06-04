import generate from "./IMIDataValidator.mjs";

const path = "https://code4sabae.github.io/imi-data-validator/example/"
const fetchText = async url => (await fetch(url)).text();
const imiv = await fetchText(path + "imicore241.imiv.txt") + await fetchText(path + "datamodel.imiv.txt");

const validate = generate(imiv);

const input = {
  "@context": "https://imi.go.jp/ns/core/context.jsonld",
  "@type": "法人型",
  "表記": "株式会社ほげほげ"
};

const output = validate(input);

console.log(JSON.stringify(output, null, 2));
