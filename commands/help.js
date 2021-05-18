const ThermostatEmbed = require("../model/javascript/defaultMessageEmbed")();

const commandStrings = require("../strings.json").commands;
const {commandPrefix} = require("../config.json");

module.exports = {
	name: commandStrings["help"].name,
	description: commandStrings["help"].fieldDescription,
	execute(message) {
		const commands = message.client.commands.array();

		ThermostatEmbed.setDescription(commandStrings["help"].misc.toString);

		commands.forEach((command) => {
			ThermostatEmbed.addField(`**${commandPrefix}${command.name}**`, `*${command.description}*\n${commandStrings[command.name].usage.fieldDescription}`);
		});

		return message.channel.send(ThermostatEmbed).catch(console.error);
	}
};