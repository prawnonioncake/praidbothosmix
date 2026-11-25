const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 8787;
const YAYIN = ["https://", "anadolu.", "liderhost.", "com.tr:", "10871/", ";"].join("");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url.startsWith("/stream.mp3") || req.url.startsWith("/icecast.audio") || req.url.startsWith("/mp3")) {
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
      "icy-name": "PraidBot HosMix Radyo",
      "icy-genre": "Turkish Remix",
      "icy-br": "128"
    });
    if (req.method === "HEAD") { res.end(); return; }
    const baglan = (u) => {
      const mod = u.startsWith("https") ? https : http;
      const istek = mod.get(u, { rejectUnauthorized: false, headers: { "User-Agent": "WinampMPEG/5.0" } }, (yayin) => {
        if (yayin.statusCode >= 300 && yayin.statusCode < 400 && yayin.headers.location) {
          baglan(yayin.headers.location);
          return;
        }
        yayin.pipe(res);
      });
      istek.on("error", () => { try { res.end(); } catch (_) {} });
      req.on("close", () => { try { istek.destroy(); } catch (_) {} });
    };
    baglan(YAYIN);
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end('<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>PraidBot Radyo</title></head><body style="background:#111;color:#fff;font-family:sans-serif;text-align:center;padding-top:50px"><h2>PraidBot HosMix Radyo</h2><audio controls autoplay src="/stream.mp3"></audio></body></html>');
});

server.listen(PORT, () => console.log("PraidBot Radyo Aktif"));


