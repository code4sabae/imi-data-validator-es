import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

import generate from "../IMIDataValidator.mjs";

if (Deno.args.length < 1) {
  console.error("usage: deno run deno --allow-read cli.js [IMIV_VOCABULARY]... [IMIV_DATAMODEL] [JSON]");
  Deno.exit(1);
}

let imiv = "";
let input = null;
for (var i = 0; i < Deno.args.length; i++) {
  const s = Deno.readTextFileSync(Deno.args[i]);
  if (s.match(/^[\s]*{/)) {
    if (input === null)
      input = new TextProtoReader(new BufReader(Deno.openSync(Deno.args[i])));
  } else {
    imiv += s;
  }
}

const validate = generate(imiv);

input = input || new TextProtoReader(new BufReader(Deno.stdin));

let mode = 0;

const lines = [];

for (;;) {
  const line = await input.readLine();
  if (line !== null) {
    if (mode === 0) {
      try {
        JSON.parse(line);
        mode = 2;
      } catch (e) {
        mode = 1;
      }
    }
    switch (mode) {
      case 1:
        lines.push(line);
        break;
      case 2:
        try {
          const json = JSON.parse(line);
          const done = validate(json);
          console.log(JSON.stringify(done));
        } catch (e) {
          console.log(`# error ${e.toString()}`)
        }
        break;
    }
  } else {
    if (mode === 1) {
      try {
        const json = JSON.parse(lines.join("\n"));
        const done = validate(json);
        console.log(JSON.stringify(done, null, 2));
      } catch (e) {
        console.log(`# error ${e.toString()}`)
      }
    }
    break;
  }
}
