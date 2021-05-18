const BannedWordsModel = require("../model/database/bannedWord")
const ThermostatEmbed = require("../model/javascript/defaultMessageEmbed");

const strings = require("../strings.json");

module.exports = {
	name: "message",
	async execute(message) {
		if (!message.author.bot) {
			const client = await require("../model/database/database").connect();

			try {
				const {rows: words} = await BannedWordsModel.getBannedWords(client);

				if (words.find(word => word.matchAsFullSentence ? message.content.toLowerCase() === word.word : message.content.includes(word.word))) {
					message.channel.send(
						ThermostatEmbed()
							.addFields(
								{
									name: strings.events.removeSpam.fieldDescription.name,
									value: strings.events.removeSpam.fieldDescription.value
								},
								{
									name: strings.events.removeSpam.misc.issuer,
									value: message.author.toString()
								}
							)
					).then((response) => {setTimeout(() => response.delete(), 20000)});
					message.delete();
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
}
