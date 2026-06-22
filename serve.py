#!/usr/bin/env python3
"""Local dev server for TD-SOLAR that ALWAYS sends no-cache headers,
so the browser never serves a stale index.html / CSS / JS.
Run:  python3 serve.py   (serves on http://127.0.0.1:8080)
"""
import http.server, socketserver

PORT = 8080

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
        print(f"TD-SOLAR dev server (no-cache) running at http://127.0.0.1:{PORT}/")
        httpd.serve_forever()
