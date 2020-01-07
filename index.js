// /index.js

const server = require('server')
var xss = require('xss')

const { get, socket } = server.router
const { render } = server.reply

// function dailyViz(id) {
// 	return render('index.html')
// }

server([
	// for the inital render
	get('/chat', ctx => render('chatroom.html')),
	get('/snake', ctx => render('snake.html')),
	get('/', ctx => render('index.html')),
	get('/cfa', ctx => render('apartments.html')),
	get('/:junk', ctx => render('index.html')),
	get('/8-51-22/:id', ctx => {
		render('/index.html')
	})
])
