const Pool = require("../model/database/database");
const BannedWord = require("../model/database/bannedWord");

const ThermostatEmbed = require("../model/javascript/defaultMessageEmbed");

const banWordStrings = require("../strings.json").commands.banWord;
const {modRoleId} = require("../config.json");
const {dbQuery: dbQueryString, noArgument: noArgumentString} = require("../strings.json").misc.errors;

module.exports = {
	name: banWordStrings.name,
	description: banWordStrings.fieldDescription,
	async execute(message, args) {
		if (!args)
			return message.channel.send(
				ThermostatEmbed().addField(banWordStrings.name, noArgumentString)
			);

		if (!message.member.roles.cache.has(modRoleId))
			return message.channel.send(
				ThermostatEmbed().addField()
			);

		try {
			const client = await Pool.connect();
			const words = args.split(",");

			for (const word of words) {
				const split = word.split(".match");

				await BannedWord.insertNewBannedWord(client, split[0].toLowerCase(), split[1] !== undefined);
			}

			return message.channel.send(
				ThermostatEmbed().addFields(
					{name: banWordStrings.name, value: banWordStrings.misc.success}
				)
			)
		} catch (e) {
			return message.channel.send(
				ThermostatEmbed()
					.addField(
						banWordStrings.name,
						e.constraint && e.constraint.includes("unique") ? banWordStrings.misc.error.unique : dbQueryString
					)
			)
		}
	}
}