module.exports.getBannedWords = async (client) => {
	return await client.query(`
		SELECT word, ban_date AS "banDate", match_as_full_sentence AS "matchAsFullSentence"
		FROM banned_word;
	`);
}

module.exports.insertNewBannedWord = async (client, newBannedWord, matchAsFullSentence) => {
	const now = new Date();

	return await client.query(`
		INSERT INTO banned_word(word, ban_date, match_as_full_sentence, update_date) VALUES ($1, $2, $3, $4);
	`, [newBannedWord, now, matchAsFullSentence, now]);
}

module.exports.updateExistingWord = async (client, bannedWord, matchAsFullSentence) => {
	return await client.query(`
		UPDATE banned_word SET match_as_full_sentence = $1 WHERE word = $2
	`, [matchAsFullSentence, bannedWord]);
}
