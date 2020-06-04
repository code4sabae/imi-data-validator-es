import { serve } from "https://deno.land/std@0.54.0/http/server.ts";

import generate from "../IMIDataValidator.mjs";

if (Deno.args.length < 2 || !Deno.args[0].match(/^[1-9][0-9]*$/)) {
  console.error("Usage: deno run --allow-net --allow-read server.mjs [port number] [IMIV_VOCABULARY]... [IMIV_DATAMODEL]");
  Deno.exit(1);
}

const port = parseInt(Deno.args[0]);

let imiv = "";
for (var i = 1; i < Deno.args.length; i++) {
  imiv += Deno.readTextFileSync(Deno.args[i]);
}

const validate = generate(imiv);

const s = serve({ port });
console.log(`imi-data-validator is running on port ${port}`);
for await (const req of s) {
  if (req.method !== "POST") {
    const headers = new Headers();
    headers.set("Content-Type", "text/plain");
    const body = [
      "405 Method Not Allowed, only POST method is supported",
      ""
    ].join("\n");
    req.respond({ status: 405, body, headers });
    continue;
  }
  const len = req.headers.get("content-length");
  const buf = new Uint8Array(len);
  await req.r.read(buf);
  const data = new TextDecoder().decode(buf);

  let json = null;
  try {
    json = JSON.parse(data);
  } catch (e) {
    const headers = new Headers();
    headers.set("Content-Type", "text/plain");
    const body = [
      "400 Bad Request, exception occurred during parsing POST body as JSON",
      ""
    ].join("\n");
    req.respond({ status: 400, body, headers });
    continue;
  }
  try {
    const done = validate(json);
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    const body = [
      JSON.stringify(done, null, 2),
      ""
    ].join("\n");
    req.respond({ body, headers });
    continue;
  } catch (e) {
    const headers = new Headers();
    headers.set("Content-Type", "text/plain");
    const body = [
      "500 Internal Server Error",
      ""
    ].join("\n");
    req.respond({ status: 500, body, headers });
    continue;
  }
}
