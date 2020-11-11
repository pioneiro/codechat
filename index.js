const PORT = process.env.PORT || 5192;
const botName = "Code Chat";

const socketio = require("socket.io");
const express = require("express");
const http = require("http");
const path = require("path");

const {	userJoin,
		getCurrentUser,
		userDisconnect,
		getUsersInRoom
	} = require("./userModules/users");
const formatMsg = require("./userModules/formatMsg");

const index = express();
const server = http.createServer(index);
const io = socketio(server);

index.use(express.static(path.join(__dirname, "assets")));

io.on("connection", function(socket) {

	socket.on("joinRoom", function({username, room}) {

		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		socket.broadcast.to(user.room).emit("message", formatMsg(botName, `${user.username} joined the chat`));
		socket.emit("message", formatMsg(botName, `Welcome to Code Chat`));
	
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getUsersInRoom(room)
		});
	});

	socket.on("chatMessage", function(chatMessage) {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit("message", formatMsg(user.username, chatMessage));
	});

	socket.on("disconnect", function() {
		const user = userDisconnect(socket.id);

		if(user) {
			io.to(user.room).emit("message", formatMsg(botName, `${user.username} left the chat`));

			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getUsersInRoom(user.room)
			});
		}

	});
});

server.listen(PORT, function() {
	console.log("server initialized at port: ", PORT);
});