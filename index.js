const {Client, Collection} = require("discord.js");
const fs = require("fs");
const inquirer = require("inquirer")

const {status: messages, errors} = require("./strings.json").misc;
const version = require("./package.json").version;

console.log(messages.startup.welcomeArt);

try {
	const config = require("./config.json");
	console.log(`${messages.startup.welcomeMessage} ${version}`);

	require("./scripts/JS/database").addBannedWords().then(() => {
		const client = new Client();

		client.commands = new Collection();
		client.events = new Collection();

		console.log(messages.startup.loading.description);
		console.log(messages.startup.loading.commands);
		fs.readdirSync("./commands").filter(file => file.endsWith('.js')).forEach(file => {
			const command = require(`./commands/${file}`);
			client.commands.set(command.name.toLowerCase(), command);
		});

		console.log(messages.startup.loading.events);
		fs.readdirSync("./events").filter(file => file.endsWith('.js')).forEach(file => {
			const event = require(`./events/${file}`);

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args, client));
			} else {
				client.on(event.name, (...args) => {
						event.execute(...args, client);
					}
				);
			}
		});

		client.on('message', message => {
			if (!message.content.startsWith(config.commandPrefix) || message.author.bot) return;

			let args = message.content.slice(config.commandPrefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();

			args = args.join(" ");

			if (!client.commands.has(command)) return;

			try {
				client.commands.get(command).execute(message, args);
			} catch (error) {
				console.error(error);
				message.reply(errors.execError);
			}
		});

		client.login(config.botId).then(() => {
			console.log(messages.startup.connected)
		});
	});
} catch (error) {
	console.log(`${messages.installation.initMessage}${version}`);

	(async () => {
		inquirer.prompt([
			{
				name: "username",
				message: messages.installation.username,
				default: "postgres"
			},
			{
				type: "password",
				name: "password",
				message: messages.installation.password
			},
			{
				name: "host",
				message: messages.installation.host
			},
			{
				name: "port",
				message: messages.installation.port,
				default: "5432"
			},
			{
				name: "dbName",
				message: messages.installation.databaseName,
				default: "postgres"
			},
			{
				name: "confirmButtonId",
				message: messages.installation.confirmButtonId,
				default: "828344615722811453"
			},
			{
				name: "creatorId",
				message: messages.installation.creatorId
			},
			{
				name: "botId",
				message: messages.installation.botId
			},
			{
				name: "botName",
				message: messages.installation.botName,
				default: "Le Thermostat"
			},
			{
				name: "commandPrefix",
				message: messages.installation.commandPrefix,
				default: "!"
			},
			{
				name: "defaultColor",
				message: messages.installation.defaultColor,
				default: "#875A7B"
			},
			{
				name: "bannedWords",
				message: messages.installation.bannedWords,
			}
		]).then(answers => {
			fs.writeFileSync(
				"./config.json",
				JSON.stringify({
					confirmButtonId: answers["confirmButtonId"],
					creatorId: answers["creatorId"],
					botId: answers["botId"],
					botName: answers["botName"],
					commandPrefix: answers["commandPrefix"],
					bannedWords: answers["bannedWords"],
					defaultColor: answers["defaultColor"],
					version: answers["version"],
					credentials: {
						username: answers["username"],
						dbPassword: answers["password"],
						dbHost: answers["host"],
						dbPort: answers["port"],
						database: answers["dbName"]
					}
				}, null, "\t")
			);

			console.log(messages.installation.beginningDBInit);
			require("./scripts/JS/database").initializeDatabase().then(() => {
				inquirer.prompt([
					{
						name: "tmp",
						message: messages.installation.endDBInit
					}]).then(() => {
					process.exit(0);
				});
			});
		}).catch(installationError => {
			console.log(messages.installation.error);
			process.exit(1);
		});
	})();
}
