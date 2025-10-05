export async function run(value, response, requestParams, stylesheet) {
  const extension = requestParams.key.split(".").pop();
  if (extension === "css") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/css");
    response.end(value);
    return;
  }
  if (extension === "js") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/javascript");
    response.end(value);
    return;
  }
  if (extension === "html") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    response.end(`<!doctype html>
<html>
<head>
 <meta charset="UTF-8">
${stylesheet}
</head>
<body>
<p><a href=${JSON.stringify(
      "/explore?" + new URLSearchParams(requestParams).toString()
    )}>Explore</a></p>
${value}
</body>
</html>`);
    return;
  }
  const code = `<!doctype html>
<html>
<head>
 <meta charset="UTF-8">
 <script src="/language/crown.js"></script>
${stylesheet}
</head>
<body>
 <p><a href=${JSON.stringify(
   "/explore?" + new URLSearchParams(requestParams).toString()
 )}>Explore</a></p>
 <script>
  const value = decodeURIComponent(${JSON.stringify(
    encodeURIComponent(value)
  )});
  async function run() {
   const rootScope = {};
   const rootCrown = crown({
   ...rootScope,
   console: globalThis.console,
   document: globalThis.document,
   location: globalThis.location,
   });
   try {
    await rootCrown.run([value]);
    const result = rootCrown.it();
    console.dir({ result });
   } catch (e) {
    console.error(e);
   }
  }
  run().catch(e => console.error(e));
 </script>
</body>
</html>`;
  response.statusCode = 200;
  response.end(code);
}
