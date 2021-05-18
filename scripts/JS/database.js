const fs = require("fs");
const path = require("path");

const pool = require("../../model/database/database");
const BannedWord = require("../../model/database/bannedWord");

const errorMessage = require("../../strings.json").misc.errors.dbQuery;

module.exports = {
	initializeDatabase: async () => {
		const client = await pool.connect();
		try {
			await client.query(fs.readFileSync(path.join(__dirname, "../SQL/createDB.sql"), "utf-8"));
			await this.addBannedWords(client);
		} catch (e) {
			console.error(`${errorMessage}\n\t${e}`);
		} finally {
			client.release();
			await pool.end();
		}
	},

	addBannedWords: async () => {
		const client = await pool.connect();

		try {
			const bannedWords = require("../../config.json").bannedWords.split(",");
			const {rows: alreadyAddedWords} = await BannedWord.getBannedWords(client);

			for (const bannedWord of bannedWords) {
				const matchAsFullSentence = bannedWord.includes(".match");
				const word = bannedWord.split(".match")[0];
				const alreadyAddedWord = alreadyAddedWords.filter(alreadyAddedWord => alreadyAddedWord.word === word)[0];

				if (!alreadyAddedWord)
					await BannedWord.insertNewBannedWord(client, word, matchAsFullSentence);
				else if (alreadyAddedWord.matchAsFullSentence !== matchAsFullSentence) {
					await BannedWord.updateExistingWord(client, bannedWord, matchAsFullSentence);
				}
			}
		} catch (e) {
			console.error(`${errorMessage}\n\t${e}`);
		} finally {
			client.release();
		}
	}
}