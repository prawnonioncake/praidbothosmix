const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 8787;
const YAYIN = ["https://", "anadolu.", "liderhost.", "com.tr:", "10871/", ";"].join("");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url.startsWith("/stream.mp3") || req.url.startsWith("/icecast.audio")) {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache, no-store",
      "Pragma": "no-cache",
      "Connection": "keep-alive",
      "icy-name": "PraidBot HosMix Radyo",
      "icy-genre": "Turkish Remix",
      "icy-br": "128"
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const baglan = (u) => {
      const mod = u.startsWith("https") ? https : http;
      const istek = mod.get(u, {
        rejectUnauthorized: false,
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Icy-MetaData": "0"
        }
      }, (yayin) => {
        if (yayin.statusCode >= 300 && yayin.statusCode < 400 && yayin.headers.location) {
          baglan(yayin.headers.location);
          return;
        }
        yayin.pipe(res);
      });

      istek.on("error", () => {
        if (!res.headersSent) res.writeHead(502);
        try { res.end(); } catch (_) {}
      });

      req.on("close", () => {
        try { istek.destroy(); } catch (_) {}
      });
    };

    baglan(YAYIN);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>PraidBot HosMix Radyo Aktif</h1>");
});

server.listen(PORT);



