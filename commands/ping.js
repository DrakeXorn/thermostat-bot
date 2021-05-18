module.exports = {
	name: "ping",
	execute(command) {
		return command.reply("Pong");
	}
}