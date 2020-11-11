const messageBox = document.querySelector(".messageBox");
const chatForm = document.getElementById("messageForm");
const roomName = document.getElementById("roomName");
const userList = document.getElementById("users");

const {username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

socket.emit("joinRoom", {username, room});

socket.on("roomUsers", function({room, users}) {
	outputRoomName(room);
	outputUsers(users);
});

socket.on("message", function(message) {
	outputMsg(message);

	messageBox.scrollTop = messageBox.scrollHeight;
});

chatForm.addEventListener("submit", function(chat) {
	chat.preventDefault();

	const msg = chat.target.elements.msg.value;

	chat.target.elements.msg.value = "";
	chat.target.elements.msg.focus();

	socket.emit("chatMessage", msg);
});

function outputMsg(message) {
	const div = document.createElement("div");
	div.classList.add("py-1", "alert");
	if(message.userName === "Code Chat") {
		div.classList.add("alert-dark");
		div.innerHTML = `<p class="m-0 text-center">${message.msg}</p>`;
	} else if(message.userName === username) {
		div.classList.add("alert-info");
		div.innerHTML = `
			<p class="m-0 text-right">${message.msg}<small>${message.time}</small></p>`;
	} else {
		div.classList.add("alert-success");
		div.innerHTML = `
			<p class="mb-1 mr-3 user">${message.userName}</p>
			<p class="m-0 text-left">${message.msg}<small>${message.time}</small></p>`;
	}
	document.querySelector(".messageBox").appendChild(div);
}

function outputRoomName(room) {
	roomName.innerText = room;
}

function outputUsers(users) {
	userList.innerHTML = `
		${users.map(user => `<li class="dropdown-item">${user.username}</li>`).join("")}
	`;
}