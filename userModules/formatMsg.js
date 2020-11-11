const time = require("moment-timezone");

function formatMsg(userName, msg) {
	return {
		userName,
		msg,
		time: time(time()).tz("Asia/Kolkata").format("hh:mm A")
	}
}

module.exports = formatMsg;