// Browser-Sync config for `npm run dev`.
//
// The server's Content Security Policy (script-src 'self') blocks Browser-Sync's
// default inline snippet. Instead, inject a plain <script src> tag for the
// client, which is served from the same origin as the page and so is allowed.
module.exports = {
  proxy: 'localhost:4000',
  port: 4001,
  ui: { port: 4002 },
  files: ['views/**/*', 'public/**/*'],
  notify: false,
  open: false,
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: (snippet, match) =>
        '<script async src="/browser-sync/browser-sync-client.js"></script>' + match,
    },
  },
}
