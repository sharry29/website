// /public/javascript.js


// Connect to theh server-side websockets. but there's no server yet!
var socket = io();

// Get the current username from cookies
socket.on('connect', async function(data) {
	var user = await cookie.get('user');
	while (!user) {
		// no username set, so ask for it
		user = await prompt('Choose a username:');
		if (user) {
			cookie.set('user', user);
		}
	}
	const userInfo = {user : user, id : socket.id}
	socket.emit('join', userInfo);	
});


// The user count. Can change when a person leaves or joins
socket.on('count', function (data) {
	$('.user-count').html(data);
});

// On receiving a message:
// {user : 'username', message : 'text'}
socket.on('message', function (data) {
	if (data.user === "poop") {
		$('.chat').append('<p><strong text-color="pink">' + data.user + '</strong>: ' + data.message + '</p>');
	}
	$('.chat').append('<p><strong>' + data.user + '</strong>: ' + data.message + '</p>');
	var objSection = document.getElementById("chatbox");
	objSection.scrollTop = objSection.scrollHeight;
});

// On a user joining the chatroom
socket.on('join', function (data) {
	$('.chat').append('<p><strong>' + data.user + ' has joined.</strong></p>');
});

// On a user leaving the chatroom
socket.on('leave', function (data) {
	console.log(data)
	for (var user of data) {
		$('.chat').append('<p><strong>' + user + ' has left.</strong></p>');
	}
});

// when form is submitted

$('form').submit(function (e) {
	//don't go through HTTP
	e.preventDefault();

	// get the message from user
	var message = $(e.target).find('input').val();

	// Send the message to the server
	socket.emit('message', {
		user: cookie.get('user') || 'Anonymous',
		message: message
	});

	// Clear the input, focus for new message
	e.target.reset();
	$(e.target).find('input').focus();
});