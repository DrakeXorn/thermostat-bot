const newPollStrings = require("../strings.json").commands.poll;

module.exports = {
	name: newPollStrings.name,
	description: newPollStrings.fieldDescription,
	execute(command, args) {
		throw Error("Not implemented");
	}
}