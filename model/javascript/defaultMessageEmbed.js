const {MessageEmbed} = require("discord.js");
const strings = require("../../strings.json");
const {botName, defaultColor} = require("../../config.json");

module.exports = () => {
	return new MessageEmbed()
		.setAuthor(botName)
		.setColor(defaultColor)
		.setTitle(strings.misc.embed.title)
		.setFooter(`${strings.misc.embed.footer} : ${Math.floor(Math.random() * (40) + 21)}°C`)
		.setTimestamp();
}
