import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import http from "node:http";
import { dirname, join } from "node:path";
import querystring from "node:querystring";

import { collectRequestBody } from "./collectRequestBody.mjs";
import { explore } from "./explore.js";
import { diskKV } from "./memory/kv/diskKV.js";
import { httpKV } from "./memory/kv/httpKV.js";
import { volatileKV } from "./memory/kv/volatileKV.js";
import { run } from "./run.js";

const ModeOptionsDiskBasePathParamName = "modeOptions.disk.basePath";

const modeDisk = diskKV.name?.replace("KV", "");
const modeHttp = httpKV.name?.replace("KV", "");
const modeVolatile = volatileKV.name?.replace("KV", "");

const DEFAULT_PORT = 7777;

const ROOT_DIR = dirname(import.meta.url).replace("file://", "");

const STORAGE_DIR = join(ROOT_DIR, ".kv");

async function main() {
  const indexHtml = (await readFile(join(ROOT_DIR, "index.html"))).toString(
    "utf-8"
  );
  const languageCrown = (
    await readFile(join(ROOT_DIR, "language", "crown.js"))
  ).toString("utf-8");
  const faviconIco = await readFile(join(ROOT_DIR, "favicon.ico"));
  const portEnv = parseInt(process.env.PORT, 10);
  const port =
    Number.isFinite(portEnv) && portEnv >= 1 && portEnv < 65536
      ? portEnv
      : DEFAULT_PORT;

  const volatileStore = volatileKV();

  const modes = [
    // "cloudflare",
    "disk",
    "http",
    // "vercel",
    "volatile",
  ];

  function getKVByMode(mode, params) {
    switch (mode) {
      case "disk":
        return diskKV({
          rootDir:
            ModeOptionsDiskBasePathParamName in params
              ? params[ModeOptionsDiskBasePathParamName]
              : STORAGE_DIR,
          fsPromises: {
            mkdir,
            readFile,
            unlink,
            writeFile,
          },
          path: { join },
        });
      case "http":
        const httpUrl = params.url;
        if (typeof httpUrl !== "string") {
          const err = new Error(
            `parameter url must be specified for 'http' mode`
          );
          err.statusCode = 400;
          throw err;
        }
        return httpKV({ baseUrl: httpUrl });
      case "volatile":
        return volatileStore;
      default:
        const err = new Error(
          `parameter mode must be one of: ${modes.join(", ")}`
        );
        err.statusCode = 400;
        throw err;
    }
  }

  function setCorsHeaders(request, response) {
    const requestOrigin = request.headers.origin;
    const allowedOrigin =
      requestOrigin && requestOrigin.startsWith("http://localhost")
        ? requestOrigin
        : "http://localhost:9090";

    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, OPTIONS"
    );
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  const stylesheet = `
<style>
  body {
    background-color: black;
    padding: 8px 12px;
  }
  body * {
    background-color: #ffffff04;
    color: #b0b0b0;
  }
  a, button {
    background-color: #b0b0b0fb;
    border-radius: 4px;
    box-shadow: inset #80808080 -1px -1px 4px 4px;
    color: black;
    display: inline-block;
    margin-right: 1px;
    max-width: 400px;
    padding: 6px 12px;
    text-decoration: none;
    text-overflow: ellipsis;
    word-wrap: nowrap;
  }
  li {
    list-style: none;
    margin-bottom: 1px;
  }
  input, select, textarea {
    background-color: transparent;
    border: 1px solid #80808080;
    box-sizing: border-box;
    color: inherit;
    margin-bottom: 1px;
    padding: 12px;
  }
  textarea {
   height: 100vh;
   min-height: 50vh;
   width: 100%;
  }
  .alert {
   background-color: #8080f0f0;
   border: 1px solid #24249680;
   border-radius: 6px;
   box-shadow: inset 2px 2px 2px #8080f0f0;
   color: #242496;
   display: inline-block;
   padding: 6px 12px;
  }
</style>
 `;

  const httpServer = http.createServer(async function (request, response) {
    try {
      setCorsHeaders(request, response);

      if (request.method === "OPTIONS") {
        response.statusCode = 204;
        response.end();
        return;
      }

      const [requestPath, requestParamString] = request.url.split("?");
      const requestParams = querystring.parse(requestParamString ?? "");
      console.log({
        method: request.method,
        path: requestPath,
        url: request.url,
        params: JSON.stringify(requestParams),
        $note: "Incoming Message",
      });
      switch (request.method) {
        case "DELETE": {
          const kv = getKVByMode(requestParams.mode, requestParams);
          if (typeof requestParams.key !== "string") {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                error: "request parameter key missing",
              })
            );
            return;
          }
          await kv.delete(requestParams.key);
          response.statusCode = 200;
          response.end();
          return;
        }
        case "GET": {
          if (request.url === "/") {
            response.statusCode = 200;
            response.end(indexHtml);
            return;
          }
          if (request.url.startsWith("/apps") && request.url.endsWith(".cr")) {
            try {
              const fileData = (
                await readFile(
                  join(ROOT_DIR, "apps", ...request.url.split("/").slice(2))
                )
              ).toString("utf-8");
              response.setHeader("Content-Type", "text/crown");
              response.end(fileData);
            } catch (e) {
              console.error(e);
              console.dir(
                join(ROOT_DIR, "apps", ...request.path.split("/").slice(2))
              );
              response.statusCode = 404;
              response.end("Not found");
            }
            return;
          }
          if (
            request.url.startsWith("/terminal") &&
            request.url.endsWith(".cr")
          ) {
            try {
              const fileData = (
                await readFile(
                  join(ROOT_DIR, "terminal", ...request.url.split("/").slice(2))
                )
              ).toString("utf-8");
              response.setHeader("Content-Type", "text/crown");
              response.end(fileData);
            } catch (e) {
              console.error(e);
              console.dir(
                join(ROOT_DIR, "terminal", ...request.path.split("/").slice(2))
              );
              response.statusCode = 404;
              response.end("Not found");
            }
            return;
          }
          if (request.url === "/language/crown.js") {
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/javascript");
            response.end(languageCrown);
            return;
          }
          if (request.url === "/favicon.ico") {
            response.statusCode = 200;
            response.setHeader("Content-Type", "image/x-icon");
            response.end(faviconIco);
            return;
          }
          if (request.url.startsWith("/run")) {
            if (!modes.includes(requestParams.mode)) {
              explore.selectMode(modes, response, stylesheet, "/run");
              return;
            }
          }
          if (request.url.startsWith("/explore")) {
            if (!modes.includes(requestParams.mode)) {
              explore.selectMode(modes, response, stylesheet, "/explore");
              return;
            }
          }
          if (typeof requestParams.key !== "string") {
            if (request.url.startsWith("/explore")) {
              explore.selectKey(requestParams, response, stylesheet);
              return;
            }
            if (request.url.startsWith("/run")) {
              explore.selectKey(requestParams, response, stylesheet, "/run");
              return;
            }
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                error: "request parameter key missing",
              })
            );
            return;
          }
          const kv = getKVByMode(requestParams.mode, requestParams);
          const value = await kv.get(requestParams.key);
          if (request.url.startsWith("/run")) {
            await run(value, response, requestParams, stylesheet);
            return;
          }
          if (request.url.startsWith("/explore")) {
            explore.viewKey(requestParams, response, stylesheet, value);
            return;
          }
          response.statusCode = 200;
          response.end(value ?? "");
          return;
        }
        case "POST": {
          const kv = getKVByMode(requestParams.mode, requestParams);
          if (typeof requestParams.key !== "string") {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                error: "request parameter key missing",
              })
            );
            return;
          }
          console.log("about to collect request body....");
          const requestBody = await collectRequestBody(request);
          if (requestBody.key !== requestParams.key) {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                error: "request body key must match request parameter key",
              })
            );
            return;
          }
          if (requestBody.mode !== requestParams.mode) {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                error: "request body mode must match request parameter mode",
              })
            );
            return;
          }
          await kv.set(requestParams.key, requestBody.value);
          const redirectParams = new URLSearchParams(requestParams);
          redirectParams.append(
            "message",
            `Saved at ${new Date().toLocaleString()}`
          );
          response.statusCode = 303;
          response.setHeader(
            "Location",
            `/explore?${redirectParams.toString()}`
          );
          response.end();
          return;
        }
        default: {
          response.statusCode = 405;
          response.end("invalid method");
          return;
        }
      }
    } catch (e) {
      console.error(e);
      response.statusCode = e.statusCode ?? 500;
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.end(e.message);
    }
  });

  httpServer.listen(port, "localhost", function () {
    console.log(
      `Server running (and test suite ready) at http://localhost:${port}

Example URL parameters:

 • ?mode=disk&${ModeOptionsDiskBasePathParamName}=./my-kv-store // disk-based key-value store in ./my-kv-store
 • ?mode=volatile // volatile in-memory key-value store
 • ?mode=http&url=http://localhost:3636 // forwards requests to another Civil Memory compatible kv server

Valid values for the mode URL parameter:
 • ?mode=${modeDisk}
 • ?mode=${modeHttp}
 • ?mode=${modeVolatile}

All API operations:

 • Read value at key
   GET ?mode=${modeDisk}&${ModeOptionsDiskBasePathParamName}=./my-kv-store&key=urlEncodedKey

   The GET request will return the value of the key, which is sent as the response body.

 • Delete value at key
   DELETE ?mode=${modeDisk}&${ModeOptionsDiskBasePathParamName}=./my-kv-store&key=urlEncodedKey

   The DELETE request will delete the value of the key.

 • Write value at key
   POST ?mode=${modeDisk}&${ModeOptionsDiskBasePathParamName}=./my-kv-store&key=urlEncodedKey [ POST body ]
   
   Where [ POST body ] is the value to be stored at the key, which is sent as the body of the POST request.`
    );
  });
}

main().catch(async function (e) {
  console.error(e);
  const errorFilePath = join(STORAGE_DIR, ".civil-memory-kv-error.txt");
  await writeFile(errorFilePath, e.stack);
  console.log(`Error details written to ${errorFilePath}`);
  process.exitCode = 1;
});
