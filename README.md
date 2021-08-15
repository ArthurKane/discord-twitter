# Overview

This is a Discord bot that watches for new Tweets from Twitter accounts and sends them to your Discord server.

Small disclaimer: I've under a year of experience with JavaScript/TypeScript. This probably could of been done better but I'm still in the learning process so feedback is also appreciated. 

What's the point of this? I originally made this back in November 2020 because I wanted the presidential election updates sent to my Discord channel so I didn't have to keep browsing Twitter so I made it to keep up with bunch of news / election accounts. Now I use it for keeping up with breaking news and other entertainment accounts. Use it however you'd like!

## Features
- Add as many Twitter users as you want to stream
- Use slash commands to add, remove, and set target channels to send Tweets to in real time

## In order to use
- You need a Twitter developer account for access keys. You can apply here: https://developer.twitter.com
- You need to setup a Discord bot

## Dependencies
- [Discord.js](https://discord.js.org/#/)
- [Twit](https://github.com/ttezel/twit)
- [TypeORM](https://typeorm.io/#/)

## Install
- Pull the repository.
- Run `npm install`
- Create `ormconfig.js` in the same path as package.json and fill in your database credentials.
```
module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: '',
    entities: [__dirname + '/build/entities/*.js'],
    logging: ['error', 'warn'],
    logger: "advanced-console",
    maxQueryExecutionTime: 10000
};
```
- Create the database structure
```sql
-- Dumping database structure for discord
CREATE DATABASE IF NOT EXISTS `discord`;
USE `discord`;

-- Dumping structure for table discord.discord-channels
CREATE TABLE IF NOT EXISTS `discord-channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` bigint(20) NOT NULL DEFAULT 0,
  `alias` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table discord.discord-channels: ~1 rows (approximately)
INSERT INTO `discord-channels` (`id`, `channel_id`, `alias`) VALUES
	(1, 875991556937617555, 'general');

-- Dumping structure for table discord.twitter-streamers
CREATE TABLE IF NOT EXISTS `twitter-streamers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `handle` varchar(30) NOT NULL,
  `rate` int(11) NOT NULL DEFAULT 1,
  `discord_channel` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_twitter-streamers_discord-channels` (`discord_channel`),
  CONSTRAINT `FK_twitter-streamers_discord-channels` FOREIGN KEY (`discord_channel`) REFERENCES `discord-channels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table discord.twitter-streamers: ~1 rows (approximately)
INSERT INTO `twitter-streamers` (`id`, `handle`, `rate`, `discord_channel`) VALUES
	(1, 'Breaking911', 1, 1);
```

- Create your `.env` file in the same path as package.json

```
DISCORD_TOKEN=""
TWITTER_CONSUMER_KEY=""
TWITTER_CONSUMER_SECRET=""
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_TOKEN_SECRET=""
```
- Add your bot's client Id and your server's Id in `src/config.json`.
```
{
    "botClientId": "",
    "guildId": ""
}
```
- Run `npm run build`
- Run `node build` to start
