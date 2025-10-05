function escapeHtml(html) {
 return html
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}

export const explore = {
 selectKey(
  requestParams,
  response,
  stylesheet,
  destination = "/explore"
 ) {
  const back = `<p><a href="/">&larr; home</a><a href="${destination}">&larr; mode</a></p>`;
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(
   `<!doctype html>
<html>
 <head>
  <meta charset="UTF-8">
  ${stylesheet}
 </head>
 <body>
  ${back}
  <h1>select key</h1>
  <form method="get" action="${destination}">
   <label>
    <span>Mode</span>
    <input readonly name="mode" value=${JSON.stringify(
     requestParams.mode
    )} /> 
   </label>
   <label>
    <span>Key</span> 
    <input name="key" placeholder="value" />
    </label>
    <input type="submit" value="Go" />
  </form>
 </body>
</html>`
  );
 },
 selectMode(
  modes,
  response,
  stylesheet,
  destination = "/explore"
 ) {
  const back =
   '<p><a href="/">&larr; home</a></p>';
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(
   `<!doctype html>
<html>
 <head>
  <meta charset="UTF-8">
  ${stylesheet}
 </head>
 <body>
  ${back}
  <h1>select mode</h1>
  <ul>${modes
   .map(
    (mode) =>
     `<li><a href="${destination}?mode=${mode}">${mode}</a></li>`
   )
   .join("")}</ul>
 </body>
</html>`
  );
 },
 viewKey(
  requestParams,
  response,
  stylesheet,
  value
 ) {
  const destination = "/explore";
  const extension = requestParams.key
   .split(".")
   .pop();
  const extraContent =
   {
    cr() {
     return `<a href="/run?mode=${requestParams.mode}&key=${requestParams.key}">Run</a>`;
    },
    html() {
     return `<a href="/run?mode=${requestParams.mode}&key=${requestParams.key}">Run</a>`;
    },
   }[extension]?.() ?? "";
  const back = `<p><a href="/">&larr; home</a><a href="${destination}">&larr; mode</a><a href="${destination}?mode=${requestParams.mode}">&larr; key</a>${extraContent}</p>`;
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(
   `<!doctype html>
<html>
 <head>
  <meta charset="UTF-8">
  ${stylesheet}
 </head>
 <body>
  ${back}
  <h1>key ${requestParams.key}</h1>
  <form method="post" action="${destination}?mode=${
    requestParams.mode
   }&key=${requestParams.key}">
   <label>
    <span>Mode</span>
    <input readonly name="mode" value=${JSON.stringify(
     requestParams.mode
    )} /> 
   </label>
   <label>
    <span>Key</span>
    <input readonly name="key" value=${JSON.stringify(
     requestParams.key
    )} /> 
   </label>
   <input type="submit" value="Save" />
  ${
   requestParams.message
    ? `<p class="alert">${escapeHtml(
       requestParams.message
      )}</p>`
    : ""
  }
   <br/>
   <label>
    <span>Value</span> 
    <textarea name="value" id="value" placeholder="value"></textarea>
   </label>
   <br/>
   <script>document.getElementById("value").value=decodeURIComponent(${JSON.stringify(
    encodeURIComponent(value)
   )});</script>
  </form>
 </body>
</html>`
  );
 },
};
