let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket);
    socket.on('disconnect', function(){
        //ionic app notifications: sent to socket channel and everyone else connected
        io.emit('users-changed',{user: socket.username, event: 'left'});
    });
    socket.on('set-name', (name) => {
        socket.username = name;
        //ionic app notifications: sent to socket channel and everyone else connected
        io.emit('users-changed', {user: name, event: 'joined'});
    });
    //message sent frm ionic app to the server, the socket listens, handles the message and emits it to the user
    socket.on('send-message', (message) => {
        io.emit('message', {msg: message.text, user: socket.username, create});
    });
});

var port = process.env.PORT || 3001;
server.listen(port, function(){
    console.log('Listening in http://localhost' + port);
});