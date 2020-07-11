// /index.js

const server = require("server");
// const d3 = require('d3')
var xss = require("xss");

const { get, socket } = server.router;
const { render } = server.reply;

function dailyViz() {
  return render("8-51-22.html");
}

function showMyWork() {
  return render("work.html");
}

server([
  // for the inital render
  get("/threenumbers", dailyViz),
  get("/chat", (ctx) => render("chatroom.html")),
  get("/snake", (ctx) => render("snake.html")),
  get("/", (ctx) => render("index.html")),
  get("/cfa", (ctx) => render("apartments.html")),
  get("/work", showMyWork),
]);
