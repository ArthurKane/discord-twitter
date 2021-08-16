# Overview

This is a Discord bot that watches for new Tweets from Twitter accounts and sends them to your Discord server.

Small disclaimer: I've under a year of experience with JavaScript/TypeScript. This probably could of been done better but I'm still in the learning process so feedback is also appreciated. 

What's the point of this? I originally made this back in November 2020 because I wanted the presidential election updates sent to my Discord channel so I didn't have to keep browsing Twitter so I made it to keep up with bunch of news / election accounts. Now I use it for keeping up with breaking news and other entertainment accounts. Use it however you'd like!

![Tweet Example](https://i.imgur.com/HyT7IbM.png)

![Slash Commands](https://i.imgur.com/vJSHmcO.png)

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
- Fill in your database credentials in `ormconfig.js`
- Create the database structure, you can find the schema in the repoistory wiki.
- Fill in your Discord and Twitter keys in `.env`
- Add your bot's client Id and your server's Id in `src/config.ts`.
- Run `npm run build`
- Run `node build` to start
